# eCommerce Microservices - Marcelo

This project consists of a suite of microservices that together create a robust eCommerce platform. The application is developed using NestJS and TypeScript, with a focus on modular design and scalability. Each service is designed to be independently deployable and scalable, offering high availability and resilience.

## Services

- **Product Service**: Handles operations related to product management such as creating, updating, retrieving, and deleting products.
- **Warehouse Service**: Manages inventory, tracking product quantities, and handling updates related to stock changes.
- **User Service**: Manages user data, including account creation, user authentication, and user profile updates.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The services are containerized using Docker, and the database used is Prisma Client. Therefore, Docker and Prisma Client are required to run this project. Make sure you have them installed on your machine.

### Installation

1. Clone the repository
```sh
git clone https://github.com/marcelormendes/ecommerce-micro-marcelo.git
```
2. Build the Docker images
```sh
docker-compose build
```
3. Start the services
```sh
docker-compose up
```

## Testing

To run the tests, use the following command:

```sh
npm test
```

## Contributing

Contributions are always welcome! See `CONTRIBUTING.md` for ways to get started.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
