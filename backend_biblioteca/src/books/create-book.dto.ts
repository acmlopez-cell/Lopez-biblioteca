import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}