import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config();

const databaseName = process.env.DATABASE_NAME!
const databaseUsername = process.env.DATABASE_USERNAME!
const databasePassword = process.env.DATABASE_PASSWORD!
const sequelize = new Sequelize(databaseName, databaseUsername, databasePassword, { dialect: "mysql", host: "mysql-21670-0.cloudclusters.net", port: 21670 })
export default sequelize;

