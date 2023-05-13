// src/ItemController.ts

import { Body, Controller, Delete, Param, Post, Put, Response, Get, Query } from "@nestjs/common";
import { ItemService } from "../services";
import { AddCartItem, ItemError, NewItem, StockUpdate, getItemErrorCode } from "../models";
import { Response as ExpressResponse } from "express";
import { Item } from "@prisma/client";
import { StockService } from "../services/stock.service";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService,
        private readonly stockService: StockService) { }

    @Get('/search')
    async getItemCatalog(
        @Query('query') query: string,
        @Response() res: ExpressResponse) {

        try {
            const item = await this.itemService.searchItems(query);

            if (item) {
                res.json(item);
            } else {
                const message = ItemError.ITEM_NOT_FOUND;
                res.status(404).json({ code: getItemErrorCode(message), message });
            }
        } catch (error) {
            const message = ItemError.INTERNAL_ERROR_RETRIEVING_ITEM;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }

    };

    @Post()
    async createItem(
        @Body() newItem: NewItem,
        @Response() res: ExpressResponse) {
        try {
            const item = await this.itemService.addItem(newItem);
            res.json({ item });
        } catch (error) {
            const message = ItemError.INTERNAL_ERROR_CREATE_ITEM;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }
    };

    @Post('/addCartItem')
    async addCartItem(
        @Body() addCartItem: AddCartItem,
        @Response() res: ExpressResponse) {
        try {

            const itemStock = await this.stockService.getStock(addCartItem.itemId);

            if (itemStock < addCartItem.quantity) {
                res.status(400).json({ message: 'Not enough stock' });
            }

            const cartItemUpdated = await this.itemService.addCartItem(addCartItem);
            res.json({ cartItemUpdated });
        } catch (error) {
            const message = ItemError.INTERNAL_ERROR_UPDATE_CART_ITEM;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }
    };


    @Put('/:id')
    async updateItem(
        @Param('id') itemId: string,
        @Body() updateItem: Partial<Item>,
        @Response() res: ExpressResponse) {

        try {
            const result = await this.itemService.updateItem(itemId, updateItem);
            if (result) {
                res.json(result);
            } else {
                const message = ItemError.ITEM_NOT_FOUND;
                res.status(404).json({ code: getItemErrorCode(message), message });
            }
        } catch (error) {
            const message = ItemError.INTERNAL_ERROR_UPDATE_ITEM;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }

    };



    @Delete('/:id')
    async deleteItemById(
        @Param('id') id: string,
        @Response() res: ExpressResponse) {

        try {
            const item = await this.itemService.deleteItem(id);
            if (item) {
                res.json(item);
            } else {
                const message = ItemError.ITEM_NOT_FOUND;
                res.status(404).json({ code: getItemErrorCode(message), message });
            }
        } catch (error) {
            const message = ItemError.INTERNAL_ERROR_DELETE_ITEM;
            res.status(500).json({ code: getItemErrorCode(message), message, error: error.message });
        }

    };


    @MessagePattern('stock_update')
    async handleStockUpdates(@Payload() data: StockUpdate): Promise<void> {
        console.log('Stock update received', data);
        await this.stockService.updateStockItemFromWarehouse(data.items);
    }
}
