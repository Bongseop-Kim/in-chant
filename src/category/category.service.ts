import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(category: Category) {
    return await this.prisma.category.create({
      data: category,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findByName(name: string) {
    return await this.prisma.category.findMany({
      where: { categoryName: { contains: name } },
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
