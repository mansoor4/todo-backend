import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet"
import cors from "cors";
import { graphqlHTTP } from "express-graphql"
import schema from "./graphql/schema"
import resolver from "./graphql/resolver"
import sequelize from "./config/sequelize"
import User from "./models/user"
import Todo from "./models/todo"
const app: Application = express();


//Environment variables
dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet())

// Graphql Middleware
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn(err: any) {
        if (!err.originalError) {
            return err;
        }
        const message = err.message || "Something went wrong!";
        const status = err.originalError.status || 500
        return { message: message, status: status };
    },
}))


//Routes

// Error middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status).json({
        error: err,
        message: err.message
    })
})
User.hasMany(Todo, { onDelete: "CASCADE" });
Todo.belongsTo(User);

sequelize.sync(/*{ force: true }*/)
    .then(() => {
        app
            .listen(process.env.PORT, () => {
                console.log(`server started at port ${process.env.PORT}`);
            })
    })
    .catch(err => {
        console.log(err);
    })
