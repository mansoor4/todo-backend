import { Request } from "express"
import userInputData from "../../interface/user/userInputData"
import validator from "validator"
import isAuthenticate from "../../util/isauthenticated"
import userExist from "../../util/userExist"
import Todo from "../../models/todo"

export ={
    getUser: async (args: userInputData, req: Request) => {
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                return { user: req.profile.get({ plain: true }) }
            }
        }
    },

    deleteUser: async (args: userInputData, req: Request) => {
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                const todos = await Todo.findAll({ where: { userId: req.userId } });
                const todosId = todos.map(todo => todo.getDataValue("id"))
                await Todo.destroy({ where: { id: todosId } })
                await req.profile.destroy();
                return { message: "User successfully deleted" }
            }
        }
    },

    updateUser: async (args: userInputData, req: Request) => {
        const { userInput } = args
        const authenticate = await isAuthenticate(req);
        if (authenticate) {
            const user = await userExist(req.userId, req);
            if (user) {
                userInput.name = userInput.name.trim()
                userInput.lastName = userInput.lastName.trim()
                userInput.contact = userInput.contact.trim()
                if (validator.isEmpty(userInput.name) ||
                    validator.isEmpty(userInput.lastName) ||
                    validator.isEmpty(userInput.contact)) {
                    const err: any = new Error("Fill all the input fields");
                    err.status = 422;
                    throw err;
                }

                if (!validator.isLength(userInput.contact, { min: 10, max: 10 })) {
                    const err: any = new Error("Enter the correct contact number");
                    err.status = 422;
                    throw err;
                }
                const updateUser = req.profile.set(userInput);
                const saveUser = await updateUser.save();
                return { user: saveUser.get({ plain: true }), message: "Signup successfully" }
            }
        }

    }
}
