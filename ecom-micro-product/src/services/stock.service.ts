import { Injectable } from "@nestjs/common";
import { PrismaClientSingle } from "../factories";
import { PrismaClient } from "@prisma/client";
import { Items } from "../models";


@Injectable()
export class StockService {

  private prisma: PrismaClient

  constructor() {
    this.prisma = PrismaClientSingle.buildPrismaClient()
  }

  async getStock(itemId: string) {
    const { stock } = await this.prisma.aggregatedStock.findUnique({
      where: { itemId },
      select: { stock: true }
    })
    return stock;
  }

  async updateStockItemFromWarehouse(items: Items[]) {
    const updatePromises = items.map(record =>
      this.prisma.aggregatedStock.update({
        where: { itemId: record.itemId },
        data: { stock: record.quantity },
      })
    );

    return await this.prisma.$transaction(updatePromises);
  }

  async updateStockItem(items: Partial<Items>[], isIncrement: boolean) {

    const { orderItems, orderItemIds } = items.reduce((acc, { itemId, quantity }) => {
      acc.orderItems.push({ itemId, quantity });
      acc.orderItemIds.push(itemId);
      return acc;
    }, { orderItems: [] as Array<Items>, orderItemIds: [] as string[] });

    const stockItems = await this.prisma.aggregatedStock.findMany({ where: { itemId: { in: orderItemIds } } })
    const stockItemsMap = new Map(stockItems.map((item) => [item.itemId, item]));

    if (!isIncrement) {
      // Check if there is enough stock for all items
      const itemsWithoutStock = orderItems.filter((item) => {
        const stockItem = stockItemsMap.get(item.itemId);
        return stockItem && stockItem.stock < item.quantity;
      });

      if (itemsWithoutStock.length > 0) {
        return itemsWithoutStock;
      }
    }

    const data = orderItems.map((orderItem) => {
      const { id, stock } = stockItemsMap.get(orderItem.itemId);
      const newStock = isIncrement ? stock + orderItem.quantity : stock - orderItem.quantity;

      return {
        id,
        stock: newStock
      }

    });

    const updatePromises = data.map(record =>
      this.prisma.aggregatedStock.update({
        where: { id: record.id },
        data: { stock: record.stock },
      })
    );

    return await this.prisma.$transaction(updatePromises);

  }
}