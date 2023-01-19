import knexfile from "../knexfile";
import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const environment = process.env.NODE_ENV as "development";

const pg = knex(knexfile[environment]);

export default pg;
