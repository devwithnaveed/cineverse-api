## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
---

## Authentication & Authorization

This project uses JWT-based auth with role-based access control.

### Roles
- `admin` - Full access
- `user` - Limited access (default)

### How it works
- All routes are **protected by default**
- Use `@Public()` decorator to make a route public
- Use `@Roles(UserRole.ADMIN)` to restrict to admins only

---

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login and get token |
| POST | `/users/register` | Register new user |

### Users (Protected)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| PATCH | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

---

## Usage Examples

### Register
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Muhammad Naveed","email":"m.naveed@test.com","password":"123456","role": "admin"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"m.naveed@test.com","password":"123456"}'
```

### Access Protected Route
```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Project Structure

```
src/
├── common/
│   ├── decorators/    # @Public(), @Roles()
│   ├── guards/        # JwtAuthGuard, RolesGuard
│   └── strategies/    # JWT Strategy
├── auth/              # Login logic
└── users/             # User CRUD
```

---

```to create user module
// ===== Create User Module with Single Comand
nest g res users
// ===== Comands to create only single file
nest g module users
nest g controller users
nest g service users
```

```aiignore
TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'postgres',
      password: 'pass123',
      database: 'movies',
      autoLoadEntities: true,
      synchronize: true,
    })
```

## Commands
```aiignore
npm i typeorm
npm i @nestjs/typeorm
npm i class-validator
npm install pg
npm i class-transformer
npm i @types/bcrypt
npm i @nestjs/jwt
npm i passport-jwt
npm i @types/passport-jwt
```


