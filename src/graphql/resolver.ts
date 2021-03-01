import authResolver from "./resolver/auth"
import todoResolver from "./resolver/todo"
import userResolver from "./resolver/user"
export ={
    auth: { ...authResolver },
    todo: { ...todoResolver },
    user: { ...userResolver }
}