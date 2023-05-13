# Warehouse Service

The Warehouse Service is a part of a microservices-based system, responsible for managing and processing orders and handling the stock. This service interfaces with the Order Service to create, update and retrieve orders, and manages the stock of items.

This service uses NestJS, a progressive Node.js framework for building efficient and scalable server-side applications, and it's developed in TypeScript. It also uses Prisma as an Object-Relational Mapping (ORM) tool to interact with the database.

## Setup

1. Clone the repository to your local machine.
2. Navigate to the root directory of the project.
3. Install the required dependencies by running `npm install` in your terminal.
4. To start the service, run `npm run start`.

## Usage

This service exposes several endpoints related to order and stock management:

### Order Endpoints

1. `GET /order/all`: Retrieve all orders.
2. `PUT /order/ship/:id`: Update an order's status to "Shipped".
3. `PUT /order/complete/:id`: Complete an order and update stock accordingly.
4. `PUT /order/cancel/:id`: Cancel an order and revert the stock changes.

#### GET /order/all

Retrieves all existing orders.

#### PUT /order/ship/:id

Updates the status of an order to "Shipped". This is used when an order has been shipped from the warehouse.

#### PUT /order/complete/:id

Completes an order. This endpoint will also update the stock accordingly, reducing the physical stock of the items included in the order.

#### PUT /order/cancel/:id

Cancels an order. If the order was already shipped or completed, it cannot be cancelled. If the order is successfully cancelled, this endpoint will revert the stock changes, increasing both the physical and available stock of the items included in the order.

### Stock Endpoints

5. `POST /stock/create-items`: Create new items in the stock.
6. `POST /stock/add-items`: Increase the quantity of existing items in the stock.
7. `DELETE /stock/remove-items`: Decrease the quantity of existing items in the stock.

#### POST /stock/create-items

Creates new items in the stock. This endpoint requires a body that includes the item ID and the quantity to be added.

#### POST /stock/add-items

Increases the quantity of existing items in the stock. This endpoint requires a body that includes the item ID and the quantity to be added.

#### DELETE /stock/remove-items

Decreases the quantity of existing items in the stock. This endpoint requires a body that includes the item ID and the quantity to be removed.

## Development

To further develop this service, you can use:

1. `npm run dev`: This command starts the server in development mode with hot-reloading enabled.
2. `npm test`: This command runs the tests for the service.
3. `npm run build`: This command builds the service, compiling the TypeScript into JavaScript.
4. `npm run start`: This command starts the server.

## Code Overview

The project structure is organized based on feature areas. The `src` folder contains the main service code, organized into controllers and services. The `OrderController` and `StockController` handle HTTP requests and responses, while the `OrderService` and `StockService` contain the core logic for processing orders and managing stock.

The service uses the NestJS `@Controller` and `@Service` decorators to define controllers and services, and the `@Get`, `@Post`, `@Put`, and `@Delete` decorators to define routes.

The `OrderController` listens for `order_submitted` messages using the `@MessagePattern` decorator and the `handleOrderCreated` method. When an `order_submitted` message is received, it creates the order and updates the stock accordingly.

The `StockController` provides endpoints for creating, adding to, and removing items from the stock. These endpoints update both the physical and available stock for the specified items.

## Error Handling

The service uses custom error codes and messages to handle errors. These can be found in the `OrderError`, `StockError`, `getOrderErrorCode`, and `getStockErrorCode` modules. When an error occurs, the service responds with the appropriate status code, error code, and error message.

## Further Development

Future enhancements to this service could include adding more detailed logging, integrating with other services (e.g., a payment service), adding more robust error handling, and implementing more advanced stock management features.
