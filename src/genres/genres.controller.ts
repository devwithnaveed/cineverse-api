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
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(+id, updateGenreDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(+id);
  }
}
