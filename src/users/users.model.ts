import { Model, Column, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  email: string;

  @Column
  password: string;
}