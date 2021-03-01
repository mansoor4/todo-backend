import { Model } from "sequelize/types";
import userData from "../../interface/user/userData"
declare global{
    namespace Express {
        interface Request {
            userId: number,
            profile:Model<any,any>
        }
    }
}