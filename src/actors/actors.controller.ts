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
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) // Cache for 30 seconds
  @Get()
  findAll() {
    return this.actorsService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
}
