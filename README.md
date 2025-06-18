# 🚀 Express TypeScript Clean Architecture API

Welcome to the Express TypeScript Clean Architecture API — A robust TypeScript-based backend boilerplate for building scalable web applications.

## 🌟 Overview

This project is a modern, feature-rich backend starter kit built with TypeScript and Express.js. It implements best practices, clean architecture principles, and provides essential features needed for building production-ready APIs.

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
├── config/         # Configuration files
├── constants/      # Constants and enums
├── controllers/    # Route controllers
├── decorators/    # Custom decorators
├── entities/      # TypeORM entities
├── exceptions/    # Custom exceptions
├── interfaces/    # TypeScript interfaces
├── mappers/       # Data mappers
├── middlewares/   # Express middlewares
├── migrations/    # Database migrations
├── repositories/  # Data access layer
└── requests/      # Request validators
```

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/vdhuyme/codient.git
cd codient
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

Configure your environment variables in the `.env` file

4. **Development Mode**

```bash
npm run dev
```

5. **Production Build**

```bash
# First time setup with migrations and seeding
npm run production:first

# Regular production build
npm run production
```

## 🛠️ Available Scripts

- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run production` - Build and start production server
- `npm run production:first` - First-time production setup with migrations

## 💻 Technologies Used

- TypeScript
- Express.js
- TypeORM
- InversifyJS
- JSON Web Tokens
- Docker
- PostgreSQL

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

Made with ❤️ by [Vo Duc Huy](https://github.com/vdhuy)
