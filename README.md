# 🚀 Express TypeScript Clean Architecture API

Welcome to the Express TypeScript Clean Architecture API — A robust TypeScript-based backend boilerplate for building scalable web applications.

## 🌟 Overview

This project is a modern, feature-rich backend starter kit built with TypeScript and Express.js. It implements best practices, clean architecture principles, and provides essential features needed for building production-ready APIs. The architecture follows SOLID principles and emphasizes maintainability, scalability, and testability.

## 🛠️ System Requirements

- Node.js (>= 20.x)
- PostgreSQL (>= 13)
- npm or yarn
- Docker (optional, for containerization)

## 🎯 Key Features

- ⚡ **TypeScript & Express.js** - Type-safe backend development
- 🏗️ **Clean Architecture** - Well-organized folder structure for scalability
- 🔐 **Authentication** - JWT-based authentication system
- 📚 **TypeORM** - Elegant database operations with TypeORM
- 🎯 **Dependency Injection** - Using InversifyJS for better modularity
- 🔄 **Migrations** - Database version control
- 🧪 **Environment Configuration** - Separate configs for different environments
- 🎨 **Code Quality** - ESLint and Prettier integration

## 📁 Project Structure

```
src/
├── config/         # Application configuration files
├── constants/      # Constants, enums, and type definitions
├── controllers/    # HTTP request handlers
├── decorators/    # Custom TypeScript decorators
├── entities/      # TypeORM entity definitions
├── exceptions/    # Custom exception classes
├── interfaces/    # TypeScript interfaces and types
├── mappers/       # Data transformation and mapping
├── middlewares/   # Express middleware functions
├── migrations/    # Database migration scripts
├── repositories/  # Data access layer implementations
│   ├── contracts/     # Repository interfaces
│   └── implements/    # Repository implementations
├── requests/      # Request validation schemas
├── services/      # Business logic layer
│   ├── contracts/     # Service interfaces
│   └── implements/    # Service implementations
├── seeders/       # Database seed data
├── subscribers/   # Event subscribers
├── types/         # Additional TypeScript type definitions
├── utils/         # Utility functions and helpers
└── validators/    # Custom validation rules
```

### Key Files

- `data-source.ts` - TypeORM configuration and database connection
- `inversify-config.ts` - Dependency injection container setup
- `index.ts` - Application entry point

## 🚀 Getting Started

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/vdhuyme/vdhuyme-api.git
cd vdhuyme-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

Configure your `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret
```

4. **Start Development Server**

```bash
npm run dev
```

### Docker Setup

```bash
docker-compose up -d
```

### Production Deployment

1. **Build for production**

```bash
npm run build
```

2. **First-time setup**

```bash
npm run production:first
```

3. **Regular production deployment**

```bash
npm run production
```

## 🛠️ Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run lint` - Run ESLint code analysis
- `npm run format` - Format code with Prettier

### Database

- `npm run db:create` - Create database
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run seed` - Seed database with initial data

### Production

- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run production` - Build and start production server
- `npm run production:first` - First-time production setup with migrations

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/change-password` - Change user password

### Post Endpoints

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### User Endpoints

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/:id/status` - Update user status

...

## 💻 Technologies Used

### Core

- TypeScript 5.x
- Express.js 4.x
- Node.js 20+

### Database & ORM

- PostgreSQL 13+
- TypeORM 0.3.x

### Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt for password hashing
- Express-validator for request validation

### Architecture & Design

- InversifyJS for Dependency Injection
- Clean Architecture principles
- SOLID principles
- Repository Pattern

### Development & Testing

- ESLint for code linting
- Prettier for code formatting
- Jest for unit testing
- Supertest for API testing

### Deployment & Infrastructure

- Docker & Docker Compose
- GitHub Actions for CI/CD
- PM2 for process management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Vo Duc Huy](https://github.com/vdhuyme/)
