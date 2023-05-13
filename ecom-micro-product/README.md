# Product Service - eCommerce Microservices - Marcelo

The Product Service is a key component of the eCommerce Microservices suite. It manages all product-related operations, including creating, updating, retrieving, and deleting products. The service is designed with a focus on modular design and scalability, offering high availability and resilience.

## Getting Started

These instructions will guide you on setting up the project on your local machine for development and testing purposes.

### Prerequisites

This service is developed using NestJS and TypeScript and uses Prisma Client for the database. Therefore, Node.js, TypeScript, and Prisma Client are required to run this project. Make sure you have them installed on your machine.

### Installation

1. Clone the repository
```sh
git clone https://github.com/marcelormendes/ecommerce-micro-marcelo.git
```
2. Install dependencies
```sh
cd productService
npm install
```
3. Run the service
```sh
npm start
```

## Usage

The Product Service exposes several RESTful endpoints:

- `GET /item/search?query={query}`: Search for items based on a query.
- `POST /item`: Create a new item.
- `POST /item/addCartItem`: Add a specific item to the cart.
- `PUT /item/{id}`: Update a specific item.
- `DELETE /item/{id}`: Delete a specific item by its ID.

Here are the RESTful endpoints exposed by the Product Service:

Item endpoints:
1. **Search for items**: - `GET /item/search?query={query}`- This endpoint is used to search for items based on a query. The query can be the name, description or any other identifiable feature of a product.
2. **Create a new item**: - `POST /item`- This endpoint is used to create a new item. It requires a request body with details of the item to be created.
3. **Add an item to a cart**: - `POST /item/addCartItem`- This endpoint is used to add a specific item to a cart. The request body should contain details of the item and cart to which the item is to be added.
4. **Update a specific item**: - `PUT /item/{id}`- This endpoint is used to update details of a specific item. The `{id}` path parameter should be replaced with the ID of the item to be updated. The request body should contain the new details of the item.
5. **Delete a specific item**:  - `DELETE /item/{id}`- This endpoint is used to delete a specific item by its ID. The `{id}` path parameter should be replaced with the ID of the item to be deleted.
6. **Get item details**: `GET /item/{id}` - Retrieves details of a specified item.
7. **Get all items**: `GET /item` - Fetches a list of all items in the catalog.
8. **Update item stock**: `PUT /item/updateStock/{id}` - Updates the stock level of a specific item.
9. **Get items in a category**: `GET /item/category/{category}` - Fetches all items in a specific category.
10. **Rate an item**: `POST /item/rate/{id}` - Allows a user to rate a specified item.
11. **Get top-rated items**: `GET /item/topRated` - Retrieves a list of the top-rated items.
12. **Get items by user**: `GET /item/user/{userId}` - Retrieves all items added by a specific user.
13. **Get recent items**: `GET /item/recent` - Fetches a list of recently added items in the catalog.
14. **Search items by price range**: `GET /item/price?min={min}&max={max}` - Fetches items within a specified price range.

Checkout endpoints:
16. **Begin Checkout**: `POST /checkout/begin` - Initiates the checkout process for a given cart remove the quantity of the item from the stock for X minutes.
17. **Cancel Checkout**: `POST /checkout/cancel` - Cancels an ongoing checkout process for a specified cart add the item back to the stock.

Order endpoints:
18. **Get All Orders**: `GET /order/all` - Retrieves all orders in the system.
19. **Get Order By ID**: `GET /order/:id` - Fetches specific order details using the order ID.
20. **Create Order**: `POST /order` - Creates a new order with the specified details.
21. **Submit Order**: `PUT /order/submit/:id` - Submits an existing order for processing.
22. **Cancel Order**: `PUT /order/cancel/:id` - Cancels an existing order that hasn't been submitted or completed.

To run the tests, use the following command:

```sh
npm test
```

## Contributing

Contributions are always welcome! See `CONTRIBUTING.md` for ways to get started.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
