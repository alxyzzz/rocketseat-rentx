import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {

    async handle(requesst: Request, response: Response): Promise<Response> {
        const { name, brand, category_id } = requesst.query
        const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase)
        const cars = await listAvailableCarsUseCase.execute({
            brand: brand as string,
            category_id: category_id as string,
            name: name as string
        })
        return response.json(cars)
    }
}

export { ListAvailableCarsController }