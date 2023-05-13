// import { StockService } from './stock.service';
// import { PrismaClient, AggregatedStock } from '@prisma/client';
// import { PrismaClientSingle } from '../factories';
// import { Items } from '../interfaces';

// describe('StockService', () => {
//     let service: StockService;
//     let mockPrisma: PrismaClient;
//     let aggregatedStock: AggregatedStock;

//     beforeEach(() => {
//         mockPrisma = {
//             aggregatedStock: {
//                 findUnique: jest.fn(),
//                 findMany: jest.fn(),
//                 update: jest.fn(),
//             },
//             $transaction: jest.fn(),
//         };

//         jest.spyOn(PrismaClientSingle, 'buildPrismaClient').mockReturnValue(mockPrisma as any);

//         service = new StockService();
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('getStock', () => {
//         it('should return the stock for a given item', async () => {
//             const itemId = '1';
//             const mockStock = { stock: 10 };
//             jest.spyOn(mockPrisma.aggregatedStock, 'findUnique').mockResolvedValue(mockStock as any);

//             const stock = await service.getStock(itemId);

//             expect(stock).toEqual(mockStock.stock);
//             expect(mockPrisma.aggregatedStock.findUnique).toHaveBeenCalledWith({
//                 where: { itemId },
//                 select: { stock: true },
//             });
//         });
//     });

//     describe('updateStockItem', () => {
//         it('should update the stock for given items', async () => {
//             const mockItems: Partial<Items>[] = [{ itemId: '1', quantity: 2 }];
//             const mockStockItems = [{ id: '1', itemId: '1', stock: 10 }];
//             jest.spyOn(mockPrisma.aggregatedStock, 'findMany').mockResolvedValue(mockStockItems as any);
//             jest.spyOn(mockPrisma.aggregatedStock, 'update').mockImplementation((args) => Promise.resolve(args as any));
//             jest.spyOn(mockPrisma, '$transaction').mockImplementation((args) => Promise.resolve(args));

//             const result = await service.updateStockItem(mockItems, true);

//             expect(result).toEqual(expect.any(Array));
//             expect(mockPrisma.aggregatedStock.findMany).toHaveBeenCalledWith({ where: { itemId: { in: ['1'] } } });
//             expect(mockPrisma.aggregatedStock.update).toHaveBeenCalledWith(expect.any(Object));
//             expect(mockPrisma.$transaction).toHaveBeenCalledWith(expect.any(Array));
//         });
//     });

//     describe('updateStockItem', () => {
//         it('should decrement the stock for given items if enough stock is available', async () => {
//             const mockItems: Partial<Items>[] = [{ itemId: '1', quantity: 2 }];
//             const mockStockItems = [{ id: '1', itemId: '1', stock: 10 }];
//             jest.spyOn(mockPrisma.aggregatedStock, 'findMany').mockResolvedValue(mockStockItems as any);
//             jest.spyOn(mockPrisma.aggregatedStock, 'update').mockImplementation((args) => Promise.resolve(args as any));
//             jest.spyOn(mockPrisma, '$transaction').mockImplementation((args) => Promise.resolve(args));

//             const result = await service.updateStockItem(mockItems, false);

//             expect(result).toEqual(expect.any(Array));
//             expect(mockPrisma.aggregatedStock.findMany).toHaveBeenCalledWith({ where: { itemId: { in: ['1'] } } });
//             expect(mockPrisma.aggregatedStock.update).toHaveBeenCalledWith({
//                 where: { id: '1' },
//                 data: { stock: 8 },
//             });
//             expect(mockPrisma.$transaction).toHaveBeenCalledWith(expect.any(Array));
//         });

//         it('should return items without enough stock when trying to decrement more than available', async () => {
//             const mockItems: Partial<Items>[] = [{ itemId: '1', quantity: 12 }];
//             const mockStockItems = [{ id: '1', itemId: '1', stock: 10 }];
//             jest.spyOn(mockPrisma.aggregatedStock, 'findMany').mockResolvedValue(mockStockItems as any);

//             const result = await service.updateStockItem(mockItems, false);

//             expect(result).toEqual([{ itemId: '1', quantity: 12 }]);
//             expect(mockPrisma.aggregatedStock.findMany).toHaveBeenCalledWith({ where: { itemId: { in: ['1'] } } });
//         });

//         it('should increment the stock for given items', async () => {
//             const mockItems: Partial<Items>[] = [{ itemId: '1', quantity: 2 }];
//             const mockStockItems = [{ id: '1', itemId: '1', stock: 10 }];
//             jest.spyOn(mockPrisma.aggregatedStock, 'findMany').mockResolvedValue(mockStockItems as any);
//             jest.spyOn(mockPrisma.aggregatedStock, 'update').mockImplementation((args) => Promise.resolve(args as any));
//             jest.spyOn(mockPrisma, '$transaction').mockImplementation((args) => Promise.resolve(args));

//             const result = await service.updateStockItem(mockItems, true);

//             expect(result).toEqual(expect.any(Array));
//             expect(mockPrisma.aggregatedStock.findMany).toHaveBeenCalledWith({ where: { itemId: { in: ['1'] } } });
//             expect(mockPrisma.aggregatedStock.update).toHaveBeenCalledWith({
//                 where: { id: '1' },
//                 data: { stock: 12 },
//             });
//             expect(mockPrisma.$transaction).toHaveBeenCalledWith(expect.any(Array));
//         });
//     });


// });
