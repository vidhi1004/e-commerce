import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { ProductVariant } from 'src/product-variant/entities/product-variant.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inverntoryRepo: Repository<Inventory>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
  ) {}
  async create(createInventoryDto: CreateInventoryDto) {
    const productVariant = await this.productVariantRepo.findOne({
      where: { id: createInventoryDto.productVariantId },
    });
    if (!productVariant) {
      throw new NotFoundException('Product Variant Not Found');
    }
    const IsInInventory = await this.inverntoryRepo.findOne({
      where: {
        productVariant: {
          id: createInventoryDto.productVariantId,
        },
      },
    });
    if (IsInInventory) {
      throw new ConflictException('Invertory already exists');
    }
    const inventory = this.inverntoryRepo.create({
      ...createInventoryDto,
      productVariant,
    });
    return this.inverntoryRepo.save(inventory);
  }

  async findAll() {
    return await this.inverntoryRepo.find();
  }

  async findOne(id: number) {
    const inventory = await this.inverntoryRepo.findOne({
      where: { id },
    });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    return inventory;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inverntoryRepo.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    if (updateInventoryDto.productVariantId) {
      const productVariant = await this.productVariantRepo.findOne({
        where: {
          id: updateInventoryDto.productVariantId,
        },
      });

      if (!productVariant) {
        throw new NotFoundException('Product Variant Not Found');
      }
    }
    const updateInventory = Object.assign(inventory, updateInventoryDto);
    return await this.inverntoryRepo.save(updateInventory);
  }

  async remove(id: number) {
    const inventory = await this.inverntoryRepo.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`inventory with id ${id} not found`);
    }
    return await this.inverntoryRepo.delete(inventory);
  }
}
