import User from "../models/user"
import { Request } from "express"
const userExist = async (userId: number, req: Request) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({ where: { id: userId } })
        if (!user) {
            const err: any = new Error("User not found");
            err.status = 400
            return reject(err);
        }
        req.profile = user
        return resolve(true);
    })
}

export default userExist