import { Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaClientSingle } from "../factories";
import { OrderItem, PrismaClient } from "@prisma/client";
import { Items } from "../interfaces";
import { ClientProxy } from "@nestjs/microservices";
import { StockOperation, StockUpdate } from "../models/Stock";


@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  private prisma: PrismaClient

  constructor(@Inject(process.env.RABBITMQ_NAME1) private whClient: ClientProxy) {
    this.prisma = PrismaClientSingle.buildPrismaClient()
  }

  async getPhysicalStock(itemId: string) {
    const { physicalStock } = await this.prisma.stock.findUnique({
      where: { itemId },
      select: { physicalStock: true }
    })
    return physicalStock;
  }

  async getAvailableStock(itemId: string) {
    const { availableStock } = await this.prisma.stock.findUnique({
      where: { itemId },
      select: { availableStock: true }
    })
    return availableStock;
  }

  async createItemsToStock(items: Items[]) {

    const stockItems = items.map(({ itemId, quantity }) => {
      return {
        itemId,
        physicalStock: quantity,
        availableStock: quantity
      }
    })

    await this.prisma.stock.createMany({ data: stockItems })
  }

  async updateStockItem(items: Partial<OrderItem>[],
    isIncrement: boolean,
    stockOperation: StockOperation) {

    const field = 'physicalStock'
    const field2 = 'availableStock'

    const { orderItems, orderItemIds } = items.reduce((acc, { itemId, quantity }) => {
      acc.orderItems.push({ itemId, quantity });
      acc.orderItemIds.push(itemId);
      return acc;
    }, { orderItems: [] as Array<Items>, orderItemIds: [] as string[] });

    const stockItems = await this.prisma.stock.findMany({ where: { itemId: { in: orderItemIds } } })
    const stockItemsMap = new Map(stockItems.map((item) => [item.itemId, item]));

    if (!isIncrement) {
      // Check if there is enough stock for all items
      const itemsWithoutStock = orderItems.filter((item) => {
        const stockItem = stockItemsMap.get(item.itemId);
        return stockItem && stockItem[field] < item.quantity;
      });

      if (itemsWithoutStock.length > 0) {
        return itemsWithoutStock;
      }
    }
    let stockItemsToUpdateOnProduct: Items[] = []

    const itemsToUpdate = orderItems.map((orderItem) => {

      const stockItem = stockItemsMap.get(orderItem.itemId);

      let newPhysicalStock: number = stockItem[field];
      let newAvailableStock: number = stockItem[field2];

      if (stockOperation === StockOperation.PHYSICAL_STOCK || stockOperation === StockOperation.BOTH) {
        newPhysicalStock = isIncrement ? newPhysicalStock + orderItem.quantity : newPhysicalStock - orderItem.quantity;
      }

      if (stockOperation === StockOperation.AVAILABLE_STOCK || stockOperation === StockOperation.BOTH) {
        newAvailableStock = isIncrement ? newAvailableStock + orderItem.quantity : newAvailableStock - orderItem.quantity;

        stockItemsToUpdateOnProduct.push({
          itemId: orderItem.itemId,
          quantity: newAvailableStock
        })
      }


      return {
        ...stockItem,
        [field]: newPhysicalStock,
        [field2]: newAvailableStock ? newAvailableStock : stockItem[field2]
      }

    });


    const updatePromises = itemsToUpdate.map(record =>
      this.prisma.stock.update({
        where: { id: record.id },
        data: { physicalStock: record.physicalStock, availableStock: record.availableStock },
      })
    );

    const updateResults = await this.prisma.$transaction(updatePromises);

    console.log(updateResults);

    const data: StockUpdate = { items: stockItemsToUpdateOnProduct };

    this.logger.log('Sending event to the queue...');

    if (stockItemsToUpdateOnProduct.length > 0) {
      this.whClient.emit('stock_update', data);
    }

    this.logger.log('Event sent to the queue.');

    return updateResults;

  }

}