import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity('users')
@Index(['email'],{ unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({type: 'boolean', default: true})
  isActive: boolean;
}
