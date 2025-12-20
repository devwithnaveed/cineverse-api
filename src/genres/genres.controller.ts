import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new genre', description: 'Create a new movie genre' })
  @ApiBody({ type: CreateGenreDto })
  @ApiResponse({ status: 201, description: 'Genre successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  @ApiOperation({ summary: 'Get all genres', description: 'Returns a list of all genres (cached for 30 seconds)' })
  @ApiResponse({ status: 200, description: 'Returns list of all genres' })
  findAll() {
    return this.genresService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID', description: 'Returns a specific genre by ID (cached for 30 seconds)' })
  @ApiParam({ name: 'id', description: 'Genre ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the genre' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update genre', description: 'Update genre details' })
  @ApiParam({ name: 'id', description: 'Genre ID', type: Number })
  @ApiBody({ type: UpdateGenreDto })
  @ApiResponse({ status: 200, description: 'Genre successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(+id, updateGenreDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete genre', description: 'Delete a genre' })
  @ApiParam({ name: 'id', description: 'Genre ID', type: Number })
  @ApiResponse({ status: 200, description: 'Genre successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }
}
