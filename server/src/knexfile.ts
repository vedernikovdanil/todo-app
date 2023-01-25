import * as CFG from "./configs/db.config";

// Update with your config settings.

export default {
  development: {
    client: "pg",
    connection: {
      host: CFG.POSTGRES_HOST,
      port: +CFG.POSTGRES_PORT,
      user: CFG.POSTGRES_USER,
      password: CFG.POSTGRES_PASSWORD,
      database: CFG.POSTGRES_DB,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/persistence/migrations",
    },
    seeds: {
      directory: "./src/persistence/seeds",
    },
    pool: {
      min: 0,
      max: 7,
      acquireTimeoutMillis: 300000,
      createTimeoutMillis: 300000,
      destroyTimeoutMillis: 50000,
      idleTimeoutMillis: 300000,
      reapIntervalMillis: 10000,
      createRetryIntervalMillis: 2000,
      propagateCreateError: false,
    },
    acquireConnectionTimeout: 60000,
  },
  production: {
    client: "pg",
    connection: {
      host: CFG.POSTGRES_HOST,
      port: +CFG.POSTGRES_PORT,
      user: CFG.POSTGRES_USER,
      password: CFG.POSTGRES_PASSWORD,
      database: CFG.POSTGRES_DB,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./build/persistence/migrations",
    },
    seeds: {
      directory: "./build/persistence/seeds",
    },
    pool: {
      min: 0,
      max: 7,
      acquireTimeoutMillis: 300000,
      createTimeoutMillis: 300000,
      destroyTimeoutMillis: 50000,
      idleTimeoutMillis: 300000,
      reapIntervalMillis: 10000,
      createRetryIntervalMillis: 2000,
      propagateCreateError: false,
    },
    acquireConnectionTimeout: 60000,
  },
};
