import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
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
  @ApiOperation({
    summary: 'Get all movies with search, filter, and pagination',
    description: 'Returns a paginated list of movies. Supports filtering by title, genre, actor, and minimum rating.',
  })
  @ApiQuery({ name: 'title', required: false, description: 'Search by movie title (partial match)', example: 'Matrix' })
  @ApiQuery({ name: 'genreId', required: false, description: 'Filter by genre ID', type: Number, example: 1 })
  @ApiQuery({ name: 'actorId', required: false, description: 'Filter by actor ID', type: Number, example: 1 })
  @ApiQuery({ name: 'minRating', required: false, description: 'Filter by minimum average rating (1-5)', type: Number, example: 4 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 100)', type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'The Matrix' },
              description: { type: 'string' },
              releaseDate: { type: 'string', example: '1999-03-31' },
              averageRating: { type: 'number', example: 4.5 },
              actors: { type: 'array' },
              genres: { type: 'array' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  findAll(@Query() filterDto: FilterMovieDto) {
    return this.moviesService.findAll(filterDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID', description: 'Returns a specific movie by ID with average rating' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the movie with average rating' })
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
