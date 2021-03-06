import { Request } from "express"
import userInputData from "../../interface/user/userInputData"
import User from "../../models/user"
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import isAuthenticate from "../../util/isauthenticated"
import { OAuth2Client } from "google-auth-library"

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
export ={
    signup: async (args: userInputData, req: Request) => {
        const { userInput } = args
        let { name, lastName, contact, email, password } = userInput
        name = name.trim()
        lastName = lastName.trim()
        contact = contact.trim()
        email = email.trim()
        password = password.trim()
        if (validator.isEmpty(name) ||
            validator.isEmpty(lastName) ||
            validator.isEmpty(contact) ||
            validator.isEmpty(email) ||
            validator.isEmpty(password)) {
            const err: any = new Error("Fill all the input fields");
            err.status = 422;
            throw err;
        }
        if (!validator.isEmail(email)) {
            const err: any = new Error("Email is not valid");
            err.status = 422;
            throw err;
        }
        if (!validator.isLength(contact, { min: 10, max: 10 })) {
            const err: any = new Error("Enter the correct contact number");
            err.status = 422;
            throw err;
        }
        if (!validator.isLength(password, { min: 6 })) {
            const err: any = new Error("Password should contain atleast 6 characters");
            err.status = 422;
            throw err;
        }

        const user = await User.findOne({ where: { email: email } })
        if (user) {
            const err: any = new Error("Email is already exist, Please sign in");
            err.status = 422;
            throw err;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        password = hashPassword;
        const createUser = await User.create({ name: name, lastName: lastName, contact: contact, email: email, password: password });
        if (!createUser) {
            const err: any = new Error("User not created");
            err.status = 500;
            throw err;
        }
        return { user: createUser.get({ plain: true }), message: "Signup successfully" }
    },
    signin: async (args: userInputData, req: Request) => {
        const { userInput } = args;
        let { email, password } = userInput;
        email = email.trim();
        password = password.trim();
        if (validator.isEmpty(email) ||
            validator.isEmpty(password)) {
            const err: any = new Error("Fill all the input fields");
            err.status = 422;
            throw err;
        }
        if (!validator.isEmail(email)) {
            const err: any = new Error("Email is not valid");
            err.status = 422;
            throw err;
        }
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            const err: any = new Error("Email is not available, Please signup");
            err.status = 422;
            throw err;
        }
        if (user?.getDataValue("password") === null) {
            const err: any = new Error("You have login with google method,reset password to login manually");
            err.status = 422;
            throw err;
        }
        const result = await bcrypt.compare(password, user?.getDataValue("password"))
        if (!result) {
            const err: any = new Error("Password is incorrect");
            err.status = 422;
            throw err;
        }
        const secret = process.env.SECRET!
        const token = jwt.sign({
            id: user?.getDataValue("id"),
            email: user?.getDataValue("email"),
        }, secret, {
            expiresIn: "1h"
        });
        return { message: "Successfully signin", token: token, user: user.get({ plain: true }) }

    },
    googleLogin: async (args: any, req: Request) => {
        const { token } = args
        const decode = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        if (decode.getPayload()?.email_verified) {
            const email = decode.getPayload()?.email
            const name = decode.getPayload()?.name
            const lastName = decode.getPayload()?.family_name
            let user = await User.findOne({ where: { email: email } });
            if (!user) {
                user = await User.create({ name: name, lastName: lastName, contact: null, email: email, password: null })
                if (!user) {
                    const err: any = new Error("User not created");
                    err.status = 500;
                    throw err;
                }
            }
            const secret = process.env.SECRET!
            const token = jwt.sign({
                id: user?.getDataValue("id"),
                email: user?.getDataValue("email"),
            }, secret, {
                expiresIn: "1h"
            });
            return { message: "Successfully signin", token: token, user: user.get({ plain: true }) }
        }
        return { message: "Email not verified you cannot login with google" }
    },

    signout: (args: userInputData, req: Request) => {
        if (!isAuthenticate(req)) {
            const err: any = new Error("You are not authenticated , Please login");
            err.status = 403;
            throw err;

        }
        return { message: "Successfully signout" }

    },
    resetPassword: async (args: userInputData, req: Request) => {
        const { userInput } = args;
        let { email, password, confirmPassword } = userInput;
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        if (validator.isEmpty(email) ||
            validator.isEmpty(password) ||
            validator.isEmpty(confirmPassword)) {
            const err: any = new Error("Fill all the input fields");
            err.status = 422;
            throw err;
        }
        if (!validator.isEmail(email)) {
            const err: any = new Error("Email is not valid");
            err.status = 422;
            throw err;
        }
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            const err: any = new Error("Email is not available, Please signup");
            err.status = 422;
            throw err;
        }
        if (password !== confirmPassword) {
            const err: any = new Error("Password and Confirm Password not matched");
            err.status = 422;
            throw err;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        password = hashPassword;
        user.setDataValue("password", password)
        const saveUser = await user.save()
        if (!saveUser) {
            const err: any = new Error("User not saved");
            err.status = 500;
            throw err;
        }

        return { message: "password reset successfully" }
    }
}