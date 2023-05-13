// src/twoFactorAuthRepository.ts

import { Injectable } from '@nestjs/common'
import { Item, PrismaClient } from '@prisma/client'
import { Client } from '@elastic/elasticsearch';
import { AddCartItem, NewItem } from '../models';
import { ESClientSingle, PrismaClientSingle } from '../factories';

@Injectable()
export class ItemService {

  private prisma: PrismaClient
  private esClient: Client

  constructor(private readonly esClientSingle: ESClientSingle) {
    this.prisma = PrismaClientSingle.buildPrismaClient()
    this.esClient = this.esClientSingle.buildESclient();
  }

  async getCartItems(cartId: string) {
    const cartItems = await this.prisma.cartItem.findMany({ where: { cartId } })
    return cartItems.map(cartItem => { return { itemId: cartItem.itemId, quantity: cartItem.quantity } });
  }
  async addItem(item: NewItem) {
    const itemInserted = await this.prisma.item.create({ data: item })
    // Add the item to Elasticsearch
    this.addToElasticSearch(itemInserted);

    // create stock for that item
    await this.prisma.aggregatedStock.create({ data: { itemId: itemInserted.id, stock: 1 } })

    return itemInserted;

  }

  async addToElasticSearch(item: Item) {
    try {
      await this.esClient.index({
        index: 'items',
        id: item.id,
        body: item,
      });
    } catch (error) {
      console.error('Error adding item to Elasticsearch:', error);
    }
  }

  async updateItem(id: string, updateItem: Partial<Item>) {
    const itemUpdated = await this.prisma.item.update({
      where: { id },
      data: updateItem
    })

    // Update the item in Elasticsearch
    try {
      await this.esClient.update({
        index: 'items',
        id,
        body: {
          doc: itemUpdated,
        },
      });
    } catch (error) {
      console.error('Error updating item in Elasticsearch:', error);
    }

    return itemUpdated;
  }

  async deleteItem(id: string) {
    const itemDeleted = await this.prisma.item.delete({
      where: { id }
    })

    // Delete the item from Elasticsearch
    try {
      await this.esClient.delete({
        index: 'items',
        id,
      });
    } catch (error) {
      console.error('Error deleting item from Elasticsearch:', error);
    }

    return itemDeleted;
  }

  async searchItems(query: string) {
    try {
      const response = await this.esClient.search({
        index: 'items',
        body: {
          query: {
            multi_match: {
              query,
              fields: ['name', 'description'],
              fuzziness: 'AUTO',
            },
          },
        },
      });

      // Extract the search results from the response
      const results = response.hits.hits.map((hit) => hit._source);
      return results;
    } catch (error) {
      console.error('Error searching items in Elasticsearch:', error);
      return [];
    }
  }

  async addCartItem(addCartItem: AddCartItem) {

    const { itemId, quantity, userId: customerId } = addCartItem;

    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      select: { id: true }
    })

    let cartId = cart ? cart.id : null;

    if (!cartId) {
      cartId = (await this.prisma.cart.create({ data: { customerId } })).id
    }

    const cartItemUpdated = await this.prisma.cartItem.upsert({
      where: { cartItemUnique: { itemId, cartId } },
      update: { quantity },
      create: { cartId, itemId, quantity }
    })

    return cartItemUpdated;
  }

}
