## PickApp API

### TO GET STARTED

```
// ENVIRONMENT
1. COPY ".env.example" AND change it's name to ".env"

// DOCKER
1. INSTALL docker if not installed yet
2. RUN: docker compose up (OR docker-compose up)

// NODEJS
1. INSTALL node.js
2. RUN: npm i -g @nestjs/cli
3. RUN: npm i -g yarn

// PROJECT
1. RUN: yarn install
2. RUN: yarn migration:run
3. RUN: yarn start:dev

Now the server is listening on port http://localhost:8080
and graphql is on http://localhost:8080/graphql


### Migrations

```

// Create
yarn migration:create src/database/migrations/MIGRATION_NAME

// Generate
yarn migration:generate src/database/migrations/MIGRATION_NAME

// Run
yarn migration:run

// Revert
yarn migration:revert

```

```
