// src/userRepository.ts

import { Inject, Injectable } from '@nestjs/common'
import { Order, OrderItem, OrderStatus, PrismaClient } from '@prisma/client'
import { PrismaClientSingle } from '../factories'
import { NewOrder, OrderToSubmit } from '../models'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class OrderService {
  private prisma: PrismaClient


  constructor(@Inject(process.env.RABBITMQ_NAME) private productClient: ClientProxy) {
    this.prisma = PrismaClientSingle.buildPrismaClient()
  }

  async findOrderById(id: string): Promise<Order | null> {
    try {
      return await this.prisma.order.findUnique({ where: { id } })
    } catch (error) {
      return null
    }
  }

  async findAllOrders(): Promise<Order[] | null> {

    try {
      return await this.prisma.order.findMany();
    } catch (error) {
      return null
    }

  }

  async findOrderItems(orderId: string): Promise<OrderItem[] | null> {
    return await this.prisma.orderItem.findMany({ where: { orderId } });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return await this.prisma.order.update({
      where: { id },
      data: { status }
    })
  }

  async createOrder(orderToCreate: NewOrder) {

    // split userId and cartId from the order
    const { userId: customerId, cartId, ...orderWithoutItems } = orderToCreate

    const items = await this.prisma.cartItem.findMany({ where: { cartId } })
    const itemIds = items.map(item => item.itemId)

    const itemWithPrice = await this.prisma.item.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, price: true }
    })

    if (itemWithPrice.length === 0) {
      throw new Error('No items found for calculate price')
    }

    const price = items.reduce((acc, item) => { // calculate the order price based on the items * quantity
      const itemPrice = itemWithPrice.find(i => i.id === item.itemId).price.toNumber()
      return acc + (itemPrice * item.quantity)
    }, 0)


    const data = { customerId, price, status: OrderStatus.CREATED, ...orderWithoutItems }

    // create the order
    const order = await this.prisma.order.create({ data })

    // create the order items
    const orderItems = items.map(item => {
      return {
        orderId: order.id,
        itemId: item.itemId,
        quantity: item.quantity,
      }
    })

    const orderItemsCreated = await this.prisma.orderItem.createMany({ data: orderItems })

    // Delete the cart items and cart
    await this.prisma.cartItem.deleteMany({ where: { cartId } })
    await this.prisma.cart.delete({ where: { id: cartId } })

    return { order, orderItems: orderItemsCreated }
  }


  async submitOrder(order: Order, orderItems: OrderItem[]) {
    const items = orderItems.map(oi => ({ orderId: oi.orderId, itemId: oi.itemId, quantity: oi.quantity }));

    // publish the order
    const orderSubmitted = await this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.SUBMITTED } })

    const orderToSubmit: OrderToSubmit = {
      id: orderSubmitted.id,
      phone: orderSubmitted.phone,
      price: orderSubmitted.price,
      address1: orderSubmitted.address1,
      address2: orderSubmitted.address2,
      city: orderSubmitted.city,
      state: orderSubmitted.state,
      zip: orderSubmitted.zip,
      items,
    }

    this.productClient.emit('order_submitted', orderToSubmit)

  }

}
