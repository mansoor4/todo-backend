import { buildSchema } from "graphql";


export default buildSchema(`

   type Todo {
    id:Int  
    text:String
    description:String
    completed:Boolean
    userId:Int
    createdAt:String
    updatedAt:String
   }

   type TodoOutput {
       todo:Todo
       message:String
       todos:[Todo!]
   }

   input InputTodoData{
       id:Int
       text:String
       description:String
       completed:Boolean
       userId:Int
   }

  type User {
    id:Int  
    name:String
    lastName:String
    contact:String
    email:String
    password:String
    createdAt:String
    updatedAt:String
   }

   type UserOutput {
       user:User
       message:String
       token:String
   }

   input InputUserData{
       id:Int
       name:String
       lastName:String
       contact:String
       email:String
       password:String
       confirmPassword:String
   }

  type TodoQuery {
    getAllTodo:TodoOutput!
   }

  type TodoMutation {
   createTodo(todoInput:InputTodoData!):TodoOutput!
   updateTodo(todoInput:InputTodoData!):TodoOutput!
   toggleComplete(todoInput:InputTodoData!):TodoOutput!
   deleteTodo(todoInput:InputTodoData!):TodoOutput!
   } 
  
   type AuthQuery{
    signout:UserOutput!
   }

   type AuthMutation {
    signup(userInput:InputUserData):UserOutput!
    signin(userInput:InputUserData):UserOutput!
    googleLogin(token:String!):UserOutput!
    resetPassword(userInput:InputUserData):UserOutput!
   }

   type UserQuery{
    getUser:UserOutput!
   }

   type UserMutation {
    updateUser(userInput:InputUserData):UserOutput!
    deleteUser:UserOutput!
   }

   type RootQuery{
    auth:AuthQuery
    todo:TodoQuery
    user:UserQuery
   }

   type RootMutation{
    auth:AuthMutation
    todo:TodoMutation
    user:UserMutation
   }

   schema{
       query:RootQuery
       mutation:RootMutation
   }
`);
