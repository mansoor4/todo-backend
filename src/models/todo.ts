import { DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

const Todo = sequelize.define("todo", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },


}, { timestamps: true })

export default Todo;