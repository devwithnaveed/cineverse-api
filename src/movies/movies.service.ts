import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ActorsService } from '../actors/actors.service';
import { GenresService } from '../genres/genres.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @Inject(forwardRef(() => ActorsService))
    private readonly actorsService: ActorsService,
    @Inject(forwardRef(() => GenresService))
    private readonly genresService: GenresService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const {genreIds, actorIds, ...rest} = createMovieDto;

    const movie = this.movieRepository.create(rest);
    const actors = await this.actorsService.findActorsByIds(actorIds);

    if(actors.length !== actorIds.length) {
      throw new NotFoundException(`one or more actors not found`);
    }

    const genres = await this.genresService.findGenresByIds(genreIds);

    if(genres.length !== genreIds.length) {
      throw new NotFoundException(`one or more genres not found`);
    }

    movie.genres = genres;
    movie.actors = actors;

    return this.movieRepository.save(movie);
  }

  async findAll() {
    return this.movieRepository.find({
      relations: { actors: true, genres: true, reviews: true },
    });
  }

  async findOne(id: number) {
    const movies = await this.movieRepository.findOne({
      where: { id },
      relations: { actors: true, genres: true, reviews: true },
    });

    if(!movies){
      throw new NotFoundException(`no movies found with id ${id}`);
    }
    return movies;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    const { genreIds, actorIds, ...rest } = updateMovieDto;

    if (actorIds) {
      movie.actors = await this.actorsService.findActorsByIds(actorIds);
    }

    if (genreIds) {
      movie.genres = await this.genresService.findGenresByIds(genreIds);
    }

    Object.assign(movie, rest);

    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const movies = await this.findOne(id);
    return this.movieRepository.remove(movies);
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
