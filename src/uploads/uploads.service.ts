import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

@Injectable()
export class UploadsService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    const directories = ['posters', 'trailers'];
    directories.forEach((dir) => {
      const path = join(this.uploadPath, dir);
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    });
  }

  getFilePath(type: 'posters' | 'trailers', filename: string): string {
    return `/uploads/${type}/${filename}`;
  }

  deleteFile(filePath: string): void {
    if (!filePath) return;

    const fullPath = join(process.cwd(), filePath);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
    }
  }
}
