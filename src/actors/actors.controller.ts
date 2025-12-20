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
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Public, Roles } from '../common/decorators';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new actor', description: 'Create a new actor' })
  @ApiBody({ type: CreateActorDto })
  @ApiResponse({ status: 201, description: 'Actor successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  @ApiOperation({ summary: 'Get all actors', description: 'Returns a list of all actors (cached for 30 seconds)' })
  @ApiResponse({ status: 200, description: 'Returns list of all actors' })
  findAll() {
    return this.actorsService.findAll();
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get(':id')
  @ApiOperation({ summary: 'Get actor by ID', description: 'Returns a specific actor by ID (cached for 30 seconds)' })
  @ApiParam({ name: 'id', description: 'Actor ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the actor' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update actor', description: 'Update actor details' })
  @ApiParam({ name: 'id', description: 'Actor ID', type: Number })
  @ApiBody({ type: UpdateActorDto })
  @ApiResponse({ status: 200, description: 'Actor successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  update(@Param('id') id: string, @Body() updateActorDto: UpdateActorDto) {
    return this.actorsService.update(+id, updateActorDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete actor', description: 'Delete an actor (Admin only)' })
  @ApiParam({ name: 'id', description: 'Actor ID', type: Number })
  @ApiResponse({ status: 200, description: 'Actor successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  remove(@Param('id') id: string) {
    return this.actorsService.remove(+id);
  }
}
