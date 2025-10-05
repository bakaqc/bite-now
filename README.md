# 🍽️ Bite Now - Restaurant Ordering API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <strong>A modern, scalable restaurant ordering system built with NestJS and GraphQL</strong>
</p>

<p align="center">
  🚀 <strong>Production-ready</strong> • 🔐 <strong>Secure</strong> • 📱 <strong>API-first</strong> • ⚡ <strong>High Performance</strong>
</p>

---

## 🌟 Features

### 👤 **User Management**

- **Multi-role system**: Restaurant owners and customers
- **Secure authentication**: Argon2 password hashing
- **Profile management**: Complete user CRUD operations

### 🏪 **Restaurant Management**

- **Restaurant profiles**: Name, description, address, contact info
- **Owner relationships**: Link restaurants to their owners
- **Status management**: Active/inactive restaurant control

### 📝 **Menu Management**

- **Dynamic menus**: Create, update, and manage menu items
- **Pricing control**: Flexible pricing for each item
- **Availability tracking**: Mark items as available/unavailable
- **Rich descriptions**: Detailed item descriptions

### 🛒 **Order System**

- **Complex orders**: Support multiple items per order
- **Order tracking**: Status management (Pending, Confirmed, Preparing, Delivered)
- **Delivery management**: Address and payment method tracking
- **Order history**: Complete order lifecycle tracking

### 🔗 **Advanced Relations**

- **Nested queries**: Get complete data with single GraphQL query
- **Optimized loading**: Efficient data fetching with Prisma
- **Real-time relations**: Live updates across all entities

## 🛠️ Tech Stack

| Technology        | Purpose              | Version |
| ----------------- | -------------------- | ------- |
| **NestJS**        | Backend framework    | ^10.0.0 |
| **GraphQL**       | API query language   | ^16.0.0 |
| **Apollo Server** | GraphQL server       | ^4.0.0  |
| **Prisma**        | Database ORM         | ^5.0.0  |
| **PostgreSQL**    | Database             | ^15.0   |
| **TypeScript**    | Programming language | ^5.0.0  |
| **Argon2**        | Password hashing     | ^0.44.0 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bakaqc/bite-now.git
   cd bite-now
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed data
   npx tsx scripts/seed-data.ts
   ```

5. **Start the server**

   ```bash
   # Development mode with hot reload
   pnpm run start:dev

   # Production mode
   pnpm run start:prod
   ```

6. **Access GraphQL Playground**
   ```
   🌐 http://localhost:3000/graphql
   ```

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o{ Restaurant : owns
    User ||--o{ Order : places
    Restaurant ||--o{ MenuItem : has
    Order ||--o{ OrderItem : contains
    OrderItem }o--|| MenuItem : references

    User {
        int id PK
        string email UK
        string name
        string password
        enum role
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Restaurant {
        int id PK
        string name
        string description
        string address
        string phone
        boolean isActive
        int ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    MenuItem {
        int id PK
        string name
        string description
        decimal price
        boolean isAvailable
        int restaurantId FK
        datetime createdAt
        datetime updatedAt
    }

    Order {
        int id PK
        int userId FK
        decimal totalPrice
        enum status
        string deliveryAddress
        string paymentMethod
        datetime createdAt
        datetime updatedAt
    }

    OrderItem {
        int id PK
        int orderId FK
        int menuItemId FK
        int quantity
        decimal unitPrice
        decimal totalPrice
    }
```

## 🔍 GraphQL API Examples

### 🍕 Get Complete Restaurant Data

```graphql
query GetRestaurantWithMenu {
	restaurants {
		id
		name
		address
		owner {
			name
			email
		}
		menuItems {
			id
			name
			price
			isAvailable
		}
	}
}
```

### 🛒 Create New Order

```graphql
mutation CreateOrder {
	createOrder(
		createOrderInput: {
			userId: 1
			totalPrice: 450000
			deliveryAddress: "123 Main St, City"
			paymentMethod: "card"
			items: [
				{ menuItemId: 1, quantity: 2, unitPrice: 150000 }
				{ menuItemId: 2, quantity: 1, unitPrice: 150000 }
			]
		}
	) {
		id
		totalPrice
		status
		items {
			quantity
			unitPrice
			menuItem {
				name
				restaurant {
					name
				}
			}
		}
	}
}
```

### 👤 Get User with Orders and Restaurants

```graphql
query GetCompleteUserData {
	users {
		id
		name
		email
		role
		restaurants {
			name
			menuItems {
				name
				price
			}
		}
		orders {
			id
			totalPrice
			status
			items {
				quantity
				menuItem {
					name
				}
			}
		}
	}
}
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Test password hashing
npx tsx scripts/test-password-hashing.ts
```

## 🔐 Security Features

- ✅ **Argon2 Password Hashing**: Industry-standard password security
- ✅ **Input Validation**: Comprehensive data validation with class-validator
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **SQL Injection Protection**: Prisma ORM prevents SQL injection
- ✅ **CORS Configuration**: Configurable cross-origin requests

## 📁 Project Structure

```
src/
├── 📁 users/              # User management module
│   ├── dtos/              # Data Transfer Objects
│   ├── entities/          # GraphQL entities
│   ├── resolvers/         # GraphQL resolvers
│   └── services/          # Business logic
├── 📁 restaurants/        # Restaurant management module
├── 📁 menu-items/         # Menu management module
├── 📁 orders/             # Order management module
├── 📁 providers/          # Shared providers (Prisma)
├── app.module.ts          # Root application module
└── main.ts               # Application entry point

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations

scripts/
├── hash-existing-passwords.ts  # Security utility
└── test-password-hashing.ts   # Testing utility
```

## 🌐 API Endpoints

| Endpoint        | Description                         |
| --------------- | ----------------------------------- |
| `POST /graphql` | GraphQL endpoint for all operations |
| `GET /graphql`  | GraphQL Playground interface        |

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bite_now"
PORT=3000
NODE_ENV=development
```

### Prisma Configuration

- **Provider**: PostgreSQL
- **Connection**: Environment-based
- **Migrations**: Version controlled

## 🚀 Deployment

### Development

```bash
pnpm run start:dev
```

### Production

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

### Docker (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Authentication & JWT**: Complete auth system
- [ ] **File Upload**: Image upload for restaurants and menu items
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Payment Integration**: Stripe/PayPal integration
- [ ] **Email Notifications**: Order confirmation emails
- [ ] **Mobile API**: Optimized mobile endpoints
- [ ] **Admin Dashboard**: Web interface for management
- [ ] **Analytics**: Order and restaurant analytics
- [ ] **Multi-language**: i18n support
- [ ] **Caching**: Redis integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [GraphQL](https://graphql.org/) - A query language for APIs
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL server

---
