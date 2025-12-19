import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Actor } from '../../actors/entities/actor.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({nullable: true})
  poster: string;

  @Column({nullable: true})
  trailerLink: string;

  // Many to Many -> Actors
  @ManyToMany(() => Actor, (actor) => actor.movies, {cascade: true})
  @JoinTable()
  actors: Actor[];

  @ManyToMany(() => Genre, (genre) => genre.movies, {cascade: true})
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Review, (review) => review.movie)
  @JoinTable()
  reviews : Review[];
}
