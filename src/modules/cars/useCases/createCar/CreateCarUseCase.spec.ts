import { AppError } from "../../../../shared/infra/errors/AppError"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { CreateCarUseCase } from "./CreateCarUseCase"

let createCarUseCase: CreateCarUseCase
let carsRepositoryInMemory: CarsRepositoryInMemory

describe("Create Car", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory)
    })

    it("should be able to create a new car", async () => {

        const createdCar = await createCarUseCase.execute({
            brand: "Brand",
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1324",
            fine_amount: 60,
            category_id: "category"
        })

        expect(createdCar).toHaveProperty("id")
    })

    it("should not be able to create a new car with exists license plate", async () => {
        await createCarUseCase.execute({
            brand: "Brand",
            name: "Car1",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1324",
            fine_amount: 60,
            category_id: "category"
        })
        expect(createCarUseCase.execute({
            brand: "Brand",
            name: "Car2",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1324",
            fine_amount: 60,
            category_id: "category"
        })

        ).rejects.toEqual(new AppError("Car already exists!"))
    })

    it("the created car must be available", async () => {
        const createdCar = await createCarUseCase.execute({
            brand: "Brand",
            name: "Car Available",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABCD-1324",
            fine_amount: 60,
            category_id: "category"
        })

        expect(createdCar.available).toBe(true)
    })
})