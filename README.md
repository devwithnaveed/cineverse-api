# Cineverse Backend API

NestJS REST API with JWT authentication, role-based access control, caching, and rate limiting.

## API Documentation (Swagger)

Interactive API documentation is available at:

```
http://localhost:3000/api
```

Features:
- Browse all endpoints organized by tags
- View request/response schemas with examples
- Test endpoints directly from the browser
- JWT authentication support (click "Authorize" button)

## Project Setup

```bash
$ npm install
```

## Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## Project Structure

```
src/
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts   # @CurrentUser() - Get logged-in user
│   │   ├── public.decorator.ts         # @Public() - Skip auth
│   │   ├── roles.decorator.ts          # @Roles() - Role-based access
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts           # JWT authentication
│   │   ├── roles.guard.ts              # Role authorization
│   │   └── index.ts
│   ├── middleware/
│   │   └── logger.middleware.ts        # Request logging
│   └── strategies/
│       └── jwt.strategy.ts             # Passport JWT strategy
│
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── movies/
│   ├── dto/
│   │   ├── create-movie.dto.ts
│   │   └── update-movie.dto.ts
│   ├── entities/
│   │   └── movie.entity.ts
│   ├── movies.controller.ts
│   ├── movies.module.ts
│   └── movies.service.ts
│
├── actors/
│   ├── dto/
│   │   ├── create-actor.dto.ts
│   │   └── update-actor.dto.ts
│   ├── entities/
│   │   └── actor.entity.ts
│   ├── actors.controller.ts
│   ├── actors.module.ts
│   └── actors.service.ts
│
├── genres/
│   ├── dto/
│   │   ├── create-genre.dto.ts
│   │   └── update-genre.dto.ts
│   ├── entities/
│   │   └── genre.entity.ts
│   ├── genres.controller.ts
│   ├── genres.module.ts
│   └── genres.service.ts
│
├── reviews/
│   ├── dto/
│   │   ├── create-review.dto.ts
│   │   └── update-review.dto.ts
│   ├── entities/
│   │   └── review.entity.ts
│   ├── reviews.controller.ts
│   ├── reviews.module.ts
│   └── reviews.service.ts
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

---

## Authentication & Authorization

JWT-based auth with role-based access control.

### Roles
- `admin` - Full access
- `user` - Limited access (default)

### How it works
- All routes are **protected by default**
- Use `@Public()` decorator to make a route public
- Use `@Roles(UserRole.ADMIN)` to restrict to admins only

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Login and get token |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users/register` | Public | Register new user |
| GET | `/users/profile` | Auth | Get current user profile |
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| PATCH | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |

### Movies
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/movies` | Public | Get all movies (Cached) |
| GET | `/movies/:id` | Public | Get movie by ID (Cached) |
| POST | `/movies` | Auth | Create movie |
| PATCH | `/movies/:id` | Auth | Update movie |
| DELETE | `/movies/:id` | Auth | Delete movie |

### Actors
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/actors` | Public | Get all actors (Cached) |
| GET | `/actors/:id` | Public | Get actor by ID (Cached) |
| POST | `/actors` | Auth | Create actor |
| PATCH | `/actors/:id` | Auth | Update actor |
| DELETE | `/actors/:id` | Admin | Delete actor |

### Genres
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/genres` | Public | Get all genres (Cached) |
| GET | `/genres/:id` | Public | Get genre by ID (Cached) |
| POST | `/genres` | Auth | Create genre |
| PATCH | `/genres/:id` | Auth | Update genre |
| DELETE | `/genres/:id` | Auth | Delete genre |

### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/reviews` | Public | Get all reviews |
| GET | `/reviews?movieId=1` | Public | Get reviews by movie |
| GET | `/reviews/:id` | Public | Get review by ID |
| POST | `/reviews` | Auth | Create review |
| PATCH | `/reviews/:id` | Owner/Admin | Update review |
| DELETE | `/reviews/:id` | Owner/Admin | Delete review |

---

## Advanced Features

### Caching (In-Memory)
Applied to heavy read endpoints:
- `GET /movies` - Cached 30 seconds
- `GET /movies/:id` - Cached 30 seconds
- `GET /actors` - Cached 30 seconds
- `GET /actors/:id` - Cached 30 seconds
- `GET /genres` - Cached 30 seconds
- `GET /genres/:id` - Cached 30 seconds

**For Redis caching**, update `app.module.ts`:
```typescript
CacheModule.register({
  store: redisStore,
  host: 'localhost',
  port: 6379,
  ttl: 60000,
})
```

### Rate Limiting
Protects API from abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 5 requests | 1 minute |
| `POST /users/register` | 3 requests | 1 minute |
| All other routes | 100 requests | 1 minute |

**Error Response** (when limit exceeded):
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## Database Configuration

```typescript
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

---

## Dependencies

```bash
npm i typeorm
npm i @nestjs/typeorm
npm i class-validator
npm i pg
npm i class-transformer
npm i bcrypt @types/bcrypt
npm i @nestjs/jwt
npm i @nestjs/passport passport passport-jwt @types/passport-jwt
npm i @nestjs/throttler
npm i @nestjs/cache-manager cache-manager
npm i redis cache-manager-redis-store
npm i @nestjs/swagger
```

---

## NestJS Commands

```bash
# Create module with CRUD
nest g res moduleName

# Create individual files
nest g module moduleName
nest g controller moduleName
nest g service moduleName
```
