import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { In, Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorsRepository: Repository<Actor>,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
  ) {}

  async create(createActorDto: CreateActorDto) {
    const {name, dateOfBirth, movieIds} = createActorDto;

    const actor = this.actorsRepository.create({
      name,
      dateOfBirth: new Date(dateOfBirth),
    });

    if(movieIds && movieIds.length > 0) {
      const movies = await this.moviesService.findMoviesByIds(movieIds)

      if(movies.length !== movieIds.length) {
        throw new NotFoundException(`Movies not found.`)
      }
      actor.movies = movies;
    }
    await this.actorsRepository.save(actor);

    return this.findOne(actor.id);
  }

  async findAll() {
    return this.actorsRepository.find({
      relations: {movies: true},
    });
  }

  async findOne(id: number) {
    const actor = await this.actorsRepository.findOne({
      where: {id},
      relations: {movies: true},
    })

    if(!actor) {
      throw new NotFoundException(`Actor with id ${id} not found`)
    }

    return actor;
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    const actor = await this.findOne(id);

    if(!actor) {
      throw new NotFoundException(`Actor with id ${id} not found`)
    }

    if(updateActorDto.movieIds) {
      actor.movies = await this.moviesService.findMoviesByIds(updateActorDto.movieIds);
    }
    const {movieIds, ...rest} = updateActorDto;
    Object.assign(actor, rest);

    return this.actorsRepository.save(actor);
  }

  async remove(id: number) {
    const actors = await this.findOne(id);
    return this.actorsRepository.remove(actors);
  }

  async findActorsByIds(actorIds: number[]): Promise<Actor[]> {
    if(!actorIds || actorIds.length === 0) {
      return []
    }

    return this.actorsRepository.find({
      where: {id: In(actorIds)},
      relations: {movies: true},
    })
  }
}
