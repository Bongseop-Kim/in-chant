import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() category: Category) {
    return this.categoryService.create(category);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
