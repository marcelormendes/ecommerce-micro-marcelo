// src/userRepository.ts

import { Inject, Injectable } from '@nestjs/common'
import { Order, OrderItem, OrderStatus, PrismaClient } from '@prisma/client'
import { PrismaClientSingle } from '../factories'
import { SubmitOrder } from '../interfaces'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class OrderService {
  private prisma: PrismaClient

  constructor(@Inject(process.env.RABBITMQ_NAME2) private orderClient: ClientProxy) {
    this.prisma = PrismaClientSingle.buildPrismaClient()
  }

  async findOrderById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } })
  }

  async findAllOrders(): Promise<Order[] | null> {
    return this.prisma.order.findMany();
  }

  async findOrderItems(orderId: string): Promise<OrderItem[] | null> {
    return this.prisma.orderItem.findMany({ where: { orderId } });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status }
    })

    if (order) {
      this.orderClient.emit('order_status_updated', { id: order.parentOrderId, status })
    }

    return order;
  }

  async createOrder(submitOrder: SubmitOrder) {

    // split parentOrderId and items from the order
    const { id: parentOrderId, items, ...orderWithoutItems } = submitOrder
    const data = { status: OrderStatus.CREATED, parentOrderId, ...orderWithoutItems }

    // create the order
    const order = await this.prisma.order.create({ data })

    // create the order items
    const orderItems = items.map(items => {
      return {
        ...items,
        orderId: order.id
      }
    })

    await this.prisma.orderItem.createMany({ data: orderItems })
  }

}
