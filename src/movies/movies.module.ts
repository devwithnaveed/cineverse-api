import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { GenresModule } from '../genres/genres.module';
import { ActorsModule } from '../actors/actors.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    forwardRef(() => GenresModule),
    forwardRef(() => ActorsModule),
    UploadsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const type = file.fieldname === 'poster' ? 'posters' : 'trailers';
          const uploadPath = join(process.cwd(), 'uploads', type);

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'poster') {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed for poster'), false);
          }
        } else if (file.fieldname === 'trailer') {
          if (file.mimetype.startsWith('video/')) {
            cb(null, true);
          } else {
            cb(new Error('Only video files are allowed for trailer'), false);
          }
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
