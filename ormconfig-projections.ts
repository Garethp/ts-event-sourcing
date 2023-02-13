const { DataSource } = require("typeorm");

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: process.env.DATABASE ?? "eventsourcing",
  schema: "projections",
  synchronize: false,
  entities: ["src/infrastructure/projection-entities/*.{js,ts}"],
  migrations: ["src/infrastructure/projection-migrations/*.ts"],
});
