import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'date',})
  dateOfBirth: Date;

  @ManyToMany(() => Movie, (movie) => movie.actors)
  @JoinTable()
  movies: Movie[]
}
