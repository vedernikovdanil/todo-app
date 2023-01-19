import { Knex } from "knex";
import {
  TodoPriorityEnum,
  TodoStatusEnum,
} from "../../interfaces/enums/TodoEnum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
      table.text("name").notNullable();
      table.text("lastName").notNullable();
      table.text("middleName").notNullable();
      table.text("login").unique().notNullable();
      table.uuid("supervisorId").references("id").inTable("users").nullable();
    })
    .createTable("users-passwords", (table) => {
      table.uuid("userId").references("id").inTable("users").primary();
      table.text("password").notNullable();
    })
    .createTable("tokens", (table) => {
      table.uuid("userId").references("id").inTable("users").primary();
      table.text("refreshToken").notNullable();
    })
    .createTable("todos", (table) => {
      table.increments("id").primary();
      table.text("title").notNullable();
      table.text("description").nullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt");
      table.dateTime("expiresAt").nullable();
      table.enum("priority", Object.values(TodoPriorityEnum)).notNullable();
      table.enum("status", Object.values(TodoStatusEnum)).notNullable();
      table.uuid("creatorId").references("id").inTable("users").notNullable();
      table
        .uuid("responsibleId")
        .references("id")
        .inTable("users")
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("todos")
    .dropTable("tokens")
    .dropTable("users-passwords")
    .dropTable("users");
}
