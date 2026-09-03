import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigEnum } from '../utils/enums';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const data = await this.dataSource.query(
      `
      SELECT
        id,
        title,
        author,
        category_id AS "categoryId",
        file_url AS "fileUrl"
      FROM books
      ORDER BY title ASC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const totalResult = await this.dataSource.query(
      `SELECT COUNT(*)::int AS total FROM books`,
    );

    const total = totalResult[0]?.total ?? 0;

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const result = await this.dataSource.query(
      `
      SELECT
        id,
        title,
        author,
        category_id AS "categoryId",
        file_url AS "fileUrl"
      FROM books
      WHERE id = $1
      `,
      [id],
    );

    if (!result.length) {
      throw new NotFoundException('Libro no encontrado');
    }

    return result[0];
  }

  async create(createBookDto: CreateBookDto) {
    const { title, author, categoryId, fileUrl } = createBookDto;

    const result = await this.dataSource.query(
      `
      INSERT INTO books (title, author, category_id, file_url)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        author,
        category_id AS "categoryId",
        file_url AS "fileUrl"
      `,
      [
        title,
        author ?? null,
        categoryId ?? null,
        fileUrl ?? null,
      ],
    );

    return result[0];
  }
}