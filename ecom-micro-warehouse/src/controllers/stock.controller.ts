// src/ItemController.ts

import { Body, Controller, Delete, Post, Response } from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { StockService } from "../services/stock.service";
import { StockError, StockOperation, getStockErrorCode } from "../models/Stock";

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) { }

    @Post('create-items')
    async createItemsToStock(
        @Body() addItems: { itemId: string, quantity: number }[],
        @Response() res: ExpressResponse) {
        try {
            const stockUpdated = await this.stockService.createItemsToStock(addItems);
            res.json({ stockUpdated });
        } catch (error) {
            const message = StockError.INTERNAL_ERROR_ADD_ITEMS;
            res.status(500).json({ code: getStockErrorCode(message), message, error });
        }
    };

    @Post('add-items')
    async addItemToStock(
        @Body() addItems: { itemId: string, quantity: number }[],
        @Response() res: ExpressResponse) {
        try {
            const stockUpdated = await this.stockService.updateStockItem(addItems, true, StockOperation.BOTH);
            res.json({ stockUpdated });
        } catch (error) {
            const message = StockError.INTERNAL_ERROR_ADD_ITEMS;
            res.status(500).json({ code: getStockErrorCode(message), message, error: error.message });
        }
    };

    @Delete('remove-items')
    async removeItemFromStock(
        @Body() removeItems: { itemId: string, quantity: number }[],
        @Response() res: ExpressResponse) {
        try {
            const stockUpdated = await this.stockService.updateStockItem(removeItems, false, StockOperation.BOTH);
            res.json({ stockUpdated });
        } catch (error) {
            const message = StockError.INTERNAL_ERROR_REMOVE_ITEMS;
            res.status(500).json({ code: getStockErrorCode(message), message, error: error.message });
        }
    };


}
