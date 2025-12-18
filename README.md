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

