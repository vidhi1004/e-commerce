import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { HttpService } from '@nestjs/axios';
import { Status } from '../enum/status.enum';
import { firstValueFrom } from 'rxjs';
import { INVENTORY_CLIENT, NOTIFICATION_CLIENT } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly httpService: HttpService,
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClinet: ClientProxy,
    @Inject(INVENTORY_CLIENT)
    private readonly inventoryClinet: ClientProxy,
  ) {}
  private async getProduct(id: number) {
    const product = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/product/${id}`),
    );
    return product.data;
  }
  private async getProductVariant(id: number) {
    const productVariant = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/product-variant/${id}`),
    );
    return productVariant.data;
  }
  private async getInventory(id: number) {
    const inventory = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/inventory/${id}`),
    );
    return inventory.data;
  }
  async create(userId: number, createOrderDto: CreateOrderDto, email: string) {
    const items = createOrderDto.items;
    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];
    if (!items || items.length === 0) {
      throw new BadRequestException('ITEMS MUST BE PRESENT');
    }
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (!product) {
        throw new NotFoundException('Product does not exists');
      }
      const variant = await this.getProductVariant(item.productVariantId);
      if (!variant) {
        throw new NotFoundException('ProductVarient not availabe');
      }
      const inventory = await this.getInventory(item.productVariantId);
      if (!inventory) {
        throw new NotFoundException('Invetory not availabe');
      }
      if (inventory.stock < item.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const subtotal = variant.price * item.quantity;

      orderItems.push({
        productId: product.id,
        productVariantId: variant.id,
        productName: product.name,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice: variant.price,
        subtotal,
      });

      totalAmount += subtotal;
    }
    const order = this.orderRepo.create({
      userId: userId,
      status: Status.PENDING,
      totalAmount: totalAmount,
    });

    const savedOrder = await this.orderRepo.save(order);

    for (const item of orderItems) {
      const orderItem = this.orderItemRepo.create({
        ...item,
        order: savedOrder,
      });
      await this.orderItemRepo.save(orderItem);
    }

    console.log(
      this.notificationClinet.emit('order.created', {
        id: savedOrder.id,
        userId,
        email,
        status: savedOrder.status,
        totalAmount,
      }),
    );
    this.inventoryClinet.emit('order.created', {
      items: createOrderDto.items,
    });
    return await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: {
        items: true,
      },
    });
  }

  async findAll() {
    return await this.orderRepo.find({
      relations: {
        items: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not Found');
    }
    if (userId !== order.userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with orderId ${id} Not Found`);
    }
    const updatedOrder = Object.assign(order, updateOrderDto);
    if (order.status === Status.CONFIRMED) {
      this.inventoryClinet.emit('order.confirmed', { order });
    }
    if (order.status === Status.CANCELLED) {
      this.inventoryClinet.emit('order.cancelled', { order });
    }

    return await this.orderRepo.save(updatedOrder);
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with orderId ${id} Not Found`);
    }
    if (userId !== order.userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    if (order.status === Status.DELIVERED) {
      throw new BadRequestException('ORDER AlREADY DELIVERED');
    }
    order.status = Status.CANCELLED;
    await this.orderRepo.save(order);
    return `Order Cancelled successfully`;
  }
}
