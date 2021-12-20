// 验证码模型
// src/entity/code.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;
}
