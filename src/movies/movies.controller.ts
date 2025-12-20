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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a new movie', description: 'Create a new movie with actors and genres' })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ status: 201, description: 'Movie successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  @ApiOperation({ summary: 'Get all movies', description: 'Returns a list of all movies (cached for 30 seconds)' })
  @ApiResponse({ status: 200, description: 'Returns list of all movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID', description: 'Returns a specific movie by ID (cached for 30 seconds)' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update movie', description: 'Update movie details' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({ status: 200, description: 'Movie successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete movie', description: 'Delete a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Movie successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
