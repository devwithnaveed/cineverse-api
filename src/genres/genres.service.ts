import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { In, Repository } from 'typeorm';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class GenresService {

  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
  ) {
  }
  async create(createGenreDto: CreateGenreDto) {
    const {name, description, movieIds} = createGenreDto;
    const genres = this.genreRepository.create({
      name,
      description,
    });

    if(movieIds && movieIds.length > 0) {
      const movies = await this.moviesService.findMoviesByIds(movieIds);

      if(movies.length !== movieIds.length) {
        throw new NotFoundException(`Movies not found`);
      }
      genres.movies = movies;
    }

    return this.genreRepository.save(genres);
  }

  async findAll() {
    return this.genreRepository.find({
      relations: {movies: true}
    });
  }

  async findOne(id: number) {
    const genre =  await this.genreRepository.findOne({
      where: {id},
      relations: {movies: true}
    });

    if(!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`)
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    if(!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`)
    }

    if(updateGenreDto.movieIds) {
      genre.movies = await this.moviesService.findMoviesByIds(updateGenreDto.movieIds);
    }

    const {movieIds, ...rest} = updateGenreDto;

    Object.assign(genre, rest);

    return this.genreRepository.save(rest);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    return this.genreRepository.remove(genre);
  }

  async findGenresByIds(genreIds: number[]): Promise<Genre[]> {
    if(!genreIds || genreIds.length === 0) {
      return [];
    }

    return this.genreRepository.find({
      where: {id: In(genreIds)},
      relations: {movies: true},
    })
  }
}
