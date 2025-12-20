import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { ActorsService } from '../actors/actors.service';
import { GenresService } from '../genres/genres.service';
import { UploadsService } from '../uploads/uploads.service';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(forwardRef(() => ActorsService))
    private readonly actorsService: ActorsService,
    @Inject(forwardRef(() => GenresService))
    private readonly genresService: GenresService,
    private readonly uploadsService: UploadsService,
  ) {}

  private calculateAverageRating(movie: Movie): number {
    if (!movie.reviews || movie.reviews.length === 0) {
      return 0;
    }
    const sum = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / movie.reviews.length) * 10) / 10;
  }

  private parseIds(ids: string | number[]): number[] {
    if (Array.isArray(ids)) {
      return ids;
    }
    return ids.split(',').map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id));
  }

  async create(createMovieDto: CreateMovieDto, posterPath?: string, trailerPath?: string) {
    const { genreIds, actorIds, ...rest } = createMovieDto;

    const parsedActorIds = this.parseIds(actorIds);
    const parsedGenreIds = this.parseIds(genreIds);

    const movie = this.movieRepository.create({
      ...rest,
      poster: posterPath || undefined,
      trailerLink: trailerPath || undefined,
    });

    const actors = await this.actorsService.findActorsByIds(parsedActorIds);

    if (actors.length !== parsedActorIds.length) {
      throw new NotFoundException(`one or more actors not found`);
    }

    const genres = await this.genresService.findGenresByIds(parsedGenreIds);

    if (genres.length !== parsedGenreIds.length) {
      throw new NotFoundException(`one or more genres not found`);
    }

    movie.genres = genres;
    movie.actors = actors;

    return this.movieRepository.save(movie);
  }

  async findAll(filterDto?: FilterMovieDto): Promise<PaginatedResult<Movie & { averageRating: number }>> {
    const {
      title,
      genreId,
      actorId,
      minRating,
      page = 1,
      limit = 10,
    } = filterDto || {};

    const where: FindOptionsWhere<Movie> = {};

    if (title) {
      where.title = Like(`%${title}%`);
    }

    let movies = await this.movieRepository.find({
      where,
      relations: { actors: true, genres: true, reviews: true },
    });

    if (genreId) {
      movies = movies.filter((movie) =>
        movie.genres?.some((genre) => genre.id === genreId),
      );
    }

    if (actorId) {
      movies = movies.filter((movie) =>
        movie.actors?.some((actor) => actor.id === actorId),
      );
    }

    let moviesWithRating = movies.map((movie) => ({
      ...movie,
      averageRating: this.calculateAverageRating(movie),
    }));

    if (minRating) {
      moviesWithRating = moviesWithRating.filter(
        (movie) => movie.averageRating >= minRating,
      );
    }

    const total = moviesWithRating.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedData = moviesWithRating.slice(skip, skip + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { actors: true, genres: true, reviews: true },
    });

    if (!movie) {
      throw new NotFoundException(`no movies found with id ${id}`);
    }

    return {
      ...movie,
      averageRating: this.calculateAverageRating(movie),
    };
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, posterPath?: string, trailerPath?: string) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { actors: true, genres: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const { genreIds, actorIds, ...rest } = updateMovieDto;

    if (actorIds) {
      const parsedActorIds = this.parseIds(actorIds);
      movie.actors = await this.actorsService.findActorsByIds(parsedActorIds);
    }

    if (genreIds) {
      const parsedGenreIds = this.parseIds(genreIds);
      movie.genres = await this.genresService.findGenresByIds(parsedGenreIds);
    }

    if (posterPath) {
      if (movie.poster) {
        this.uploadsService.deleteFile(movie.poster);
      }
      movie.poster = posterPath;
    }

    if (trailerPath) {
      if (movie.trailerLink) {
        this.uploadsService.deleteFile(movie.trailerLink);
      }
      movie.trailerLink = trailerPath;
    }

    Object.assign(movie, rest);

    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    if (movie.poster) {
      this.uploadsService.deleteFile(movie.poster);
    }

    if (movie.trailerLink) {
      this.uploadsService.deleteFile(movie.trailerLink);
    }

    return this.movieRepository.remove(movie);
  }

  async findMoviesByIds(movieIds: number[]): Promise<Movie[]> {
    if (!movieIds || movieIds.length === 0) {
      return [];
    }

    return this.movieRepository.find({
      where: {
        id: In(movieIds),
      },
    });
  }
}
