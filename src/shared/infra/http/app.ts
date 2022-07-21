import "reflect-metadata"
import "../../container"
import express, { NextFunction, Request, Response } from "express"
import "express-async-errors"
import { createConnection } from "../typeorm/data-source"
import { router } from "./routes"
import { AppError } from "../errors/AppError"



createConnection()
    .then()
    .catch((e) => {
        console.log('DataSource Error:', e)
    })

const app = express()

app.use(express.json())


app.use(router)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(err)
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error ${err.message}`
    })
})


export { app }

