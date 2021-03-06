import { Request } from "express"
import validator from "validator"
import isAuthenticate from "../../util/isauthenticated"
import todoInputData from "../../interface/todo/todoInputData"
import Todo from "../../models/todo"
import userExist from "../../util/userExist"

export ={
    createTodo: async (args: todoInputData, req: Request) => {
        const { todoInput } = args;
        let { text, description } = todoInput;
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                text = text.trim();
                description = description.trim()
                if (validator.isEmpty(text) || validator.isEmpty(description)) {
                    const err: any = new Error("Fill all the input fields");
                    err.status = 422;
                    throw err;
                }
                const todo = await Todo.create({ text: text, description: description, userId: req.userId });
                if (!todo) {
                    const err: any = new Error("User not created");
                    err.status = 500
                    throw err
                }
                return { todo: todo.get({ plain: true }), message: "Todo created successfully" }
            }
        }
    },

    updateTodo: async (args: todoInputData, req: Request) => {
        const { todoInput } = args;
        let { text, description, id } = todoInput;
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                text = text.trim();
                description = description.trim();
                if (validator.isEmpty(text) || validator.isEmpty(description)) {
                    const err: any = new Error("Fill all the input fields");
                    err.status = 422;
                    throw err;
                }
                const todo = await Todo.findOne({ where: { id: id, userId: req.userId } });
                if (!todo) {
                    const err: any = new Error("Todo not found");
                    err.status = 400
                    throw err
                }
                todo?.setDataValue("text", text);
                todo?.setDataValue("description", description);
                const saveTodo = await todo.save();
                if (!saveTodo) {
                    const err: any = new Error("Todo not saved");
                    err.status = 500
                    throw err
                }
                return { todo: saveTodo.get({ plain: true }), message: "Todo update successfully" }
            }
        }
    },

    toggleComplete: async (args: todoInputData, req: Request) => {
        const { todoInput } = args
        const { completed, id } = todoInput
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                const todo = await Todo.findOne({ where: { id: id, userId: req.userId } });
                if (!todo) {
                    const err: any = new Error("Todo not found");
                    err.status = 400
                    throw err
                }
                todo.setDataValue("completed", completed)
                const saveTodo = await todo.save();
                if (!saveTodo) {
                    const err: any = new Error("Todo not saved");
                    err.status = 500
                    throw err
                }
                return { todo: saveTodo.get({ plain: true }), message: "Todo update successfully" }
            }
        }
    },
    deleteTodo: async (args: todoInputData, req: Request) => {
        const { todoInput } = args;
        let { id } = todoInput;
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                const todo = await Todo.findOne({ where: { id: id, userId: req.userId } });
                if (!todo) {
                    const err: any = new Error("Todo not found");
                    err.status = 400
                    throw err
                }
                await todo?.destroy()
                return { message: "Todo delete successfully" }
            }
        }
    },

    getAllTodo: async (args: todoInputData, req: Request) => {
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                const todos = await Todo.findAll({ where: { userId: req.userId } })
                if (todos.length === 0) {
                    const err: any = new Error("No Todos created");
                    err.status = 200
                    throw err
                }
                return { todos: todos }
            }
        }
    }
}