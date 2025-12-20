import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Create a new movie with actors, genres, and optional poster/trailer files',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'releaseDate', 'actorIds', 'genreIds'],
      properties: {
        title: { type: 'string', example: 'The Matrix' },
        description: { type: 'string', example: 'A computer hacker learns about the true nature of reality' },
        releaseDate: { type: 'string', format: 'date', example: '1999-03-31' },
        actorIds: { type: 'string', example: '1,2,3', description: 'Comma-separated actor IDs' },
        genreIds: { type: 'string', example: '1,2', description: 'Comma-separated genre IDs' },
        poster: { type: 'string', format: 'binary', description: 'Poster image file (jpg, png, etc.)' },
        trailer: { type: 'string', format: 'binary', description: 'Trailer video file (mp4, etc.)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Movie successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFiles()
    files?: { poster?: Express.Multer.File[]; trailer?: Express.Multer.File[] },
  ) {
    const posterFile = files?.poster?.[0];
    const trailerFile = files?.trailer?.[0];

    const posterPath = posterFile ? `/uploads/posters/${posterFile.filename}` : undefined;
    const trailerPath = trailerFile ? `/uploads/trailers/${trailerFile.filename}` : undefined;

    return this.moviesService.create(createMovieDto, posterPath, trailerPath);
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
              poster: { type: 'string', example: '/uploads/posters/123456.jpg' },
              trailerLink: { type: 'string', example: '/uploads/trailers/123456.mp4' },
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update movie',
    description: 'Update movie details including poster/trailer files',
  })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Matrix Reloaded' },
        description: { type: 'string' },
        releaseDate: { type: 'string', format: 'date', example: '2003-05-15' },
        actorIds: { type: 'string', example: '1,2,3', description: 'Comma-separated actor IDs' },
        genreIds: { type: 'string', example: '1,2', description: 'Comma-separated genre IDs' },
        poster: { type: 'string', format: 'binary', description: 'New poster image file' },
        trailer: { type: 'string', format: 'binary', description: 'New trailer video file' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Movie successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFiles()
    files?: { poster?: Express.Multer.File[]; trailer?: Express.Multer.File[] },
  ) {
    const posterFile = files?.poster?.[0];
    const trailerFile = files?.trailer?.[0];

    const posterPath = posterFile ? `/uploads/posters/${posterFile.filename}` : undefined;
    const trailerPath = trailerFile ? `/uploads/trailers/${trailerFile.filename}` : undefined;

    return this.moviesService.update(+id, updateMovieDto, posterPath, trailerPath);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete movie', description: 'Delete a movie and its associated files' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Movie successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
