import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a review', description: 'Create a new movie review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all reviews', description: 'Returns all reviews or filter by movie ID' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter reviews by movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns list of reviews' })
  findAll(@Query('movieId') movieId?: string) {
    if (movieId) {
      return this.reviewsService.findByMovie(+movieId);
    }
    return this.reviewsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID', description: 'Returns a specific review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update review', description: 'Update a review (only owner or admin)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Review successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the review owner' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, user.id, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete review', description: 'Delete a review (only owner or admin)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Review successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the review owner' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.reviewsService.remove(+id, user.id, user.role);
  }
}
