import { Request } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

interface decode {
    id: number,
    email: string
}
dotenv.config();
const isAuthenticate = (req: Request) => {
    return new Promise((resolve, reject) => {
        const authorization = req.get("Authorization");
        if (authorization != undefined && authorization !== "") {
            const token = authorization.split(" ")[1];
            const secret = process.env.SECRET!;
            const decode = jwt.verify(token, secret) as decode
            if (!decode) {
                const err: any = new Error("Token give is not valid");
                err.status = 400;
                return reject(err)
            }
            req.userId = decode.id
            return resolve(true)
        }
        else {
            const err: any = new Error("Something went wrong");
            err.status = 400;
            return reject(err)
        }
    })

}


export default isAuthenticate