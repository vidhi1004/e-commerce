import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly CategoryRepo: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const categoryId = createProductDto.categoryId;
    const category = await this.CategoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category does not exists');
    }
    const product = this.ProductRepo.create({ ...createProductDto, category });

    return await this.ProductRepo.save(product);
  }

  async findAll() {
    return await this.ProductRepo.find({
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.ProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.ProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (updateProductDto.categoryId) {
      const category = await this.CategoryRepo.findOne({
        where: {
          id: updateProductDto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with id ${updateProductDto.categoryId} not found`,
        );
      }
      const updatedProduct = Object.assign(product, updateProductDto);
      return await this.ProductRepo.save(updatedProduct);
    }
  }

  async remove(id: number) {
    const product = await this.ProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    product.isActive = false;
    await this.ProductRepo.save(product);
    return `Product with Id ${id} and Name ${product.name} removed successfully`;
  }
}
