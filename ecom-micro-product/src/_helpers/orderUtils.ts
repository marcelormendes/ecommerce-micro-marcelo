import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export const ordersMock = [{
    id: '1',
    customerId: '1',
    status: OrderStatus.CREATED,
    phone: '1234567890',
    price: new Decimal(100.00),
    address1: '123 Main St',
    address2: 'Apt 1',
    city: 'New York',
    state: 'NY',
    zip: '12345',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    id: '2',
    customerId: '1',
    status: OrderStatus.CREATED,
    phone: '1234567890',
    price: new Decimal(100.00),
    address1: '123 Main St',
    address2: 'Apt 1',
    city: 'New York',
    state: 'NY',
    zip: '12345',
    createdAt: new Date(),
    updatedAt: new Date()
}]

export const newOrder = {
    "userId": "3d233461-06f2-4172-9f91-e4f805356461",
    "address1": "1341 Hidden Meadow Drive",
    "address2": "",
    "city": "New Effington",
    "state": "North Dakota",
    "zip": "57255",
    "phone": "701-634-7877",
    "cartId": "1"
}

export const items = [{
    "id": "1",
    "name": "TV",
    "description": "Black",
    "price": new Decimal(300),
    "otherDetails": "test tv",
    "createdAt": new Date(),
    "updatedAt": new Date()
}]