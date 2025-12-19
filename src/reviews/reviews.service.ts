import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { MoviesService } from '../movies/movies.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly moviesService: MoviesService,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const { movieId, rating, comment } = createReviewDto;

    const movie = await this.moviesService.findOne(movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with id ${movieId} not found`);
    }

    const review = this.reviewRepository.create({
      rating,
      comment,
      movie: { id: movieId },
      user: { id: userId },
    });

    await this.reviewRepository.save(review);

    return this.findOne(review.id);
  }

  async findAll() {
    return this.reviewRepository.find({
      relations: { movie: true, user: true },
    });
  }

  async findByMovie(movieId: number) {
    return this.reviewRepository.find({
      where: { movie: { id: movieId } },
      relations: { user: true },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { movie: true, user: true },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: string,
    userRole: string,
  ) {
    const review = await this.findOne(id);

    if (review.user.id !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const { rating, comment } = updateReviewDto;

    if (rating) {
      review.rating = rating;
    }
    if (comment) {
      review.comment = comment;
    }

    return this.reviewRepository.save(updateReviewDto);
  }

  async remove(id: number, userId: string, userRole: string) {
    const review = await this.findOne(id);

    // Only owner or admin can delete
    if (review.user.id !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.reviewRepository.remove(review);
  }
}
