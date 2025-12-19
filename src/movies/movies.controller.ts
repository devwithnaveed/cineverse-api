import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) // Cache for 30 seconds
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
