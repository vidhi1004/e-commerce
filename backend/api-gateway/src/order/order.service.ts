import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateOrderDto,
  DeleteOrderDto,
  Empty,
  GetOrderByIdDto,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
  UpdateOrderDto,
} from './order';
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class OrderService implements OnModuleInit {
  private orderService!: OrderServiceClient;
  constructor(
    @Inject('ORDER_PACKAGE')
    private readonly orderServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderServiceClient.getService<OrderServiceClient>(
        ORDER_SERVICE_NAME,
      );
  }

  createOrder(request: CreateOrderDto) {
    return this.orderService.createOrder(request);
  }

  getAllOrders(request: Empty) {
    return this.orderService.getAllOrders(request);
  }

  getOrderById(request: GetOrderByIdDto) {
    return this.orderService.getOrderById(request);
  }

  updateOrder(request: UpdateOrderDto) {
    return this.orderService.updateOrder(request);
  }

  deleteOrder(request: DeleteOrderDto) {
    return this.orderService.deleteOrder(request);
  }
}
