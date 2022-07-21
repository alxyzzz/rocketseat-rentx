import { AppError } from "../../../../shared/infra/errors/AppError"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let specificationRepositoryInMemory: SpecificationsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory

describe("Create Car Specification", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        specificationRepositoryInMemory = new SpecificationsRepositoryInMemory()
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationRepositoryInMemory)
    })

    it("should be able to add a new specification to the car", async () => {

        const car = await carsRepositoryInMemory.create({
            brand: "Brand",
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1324",
            fine_amount: 60,
            category_id: "category"
        })

        const specification = await specificationRepositoryInMemory.create({
            name: "test",
            description: "test"
        })

        const specifications_id = [specification.id]

        const specificationsCars = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id
        })

        expect(specificationsCars).toHaveProperty("specifications")
        expect(specificationsCars.specifications.length).toBe(1)
    })

    it("should not be able to add a new specification to an unexistent car", async () => {
        const car_id = "1324"
        const specifications_id = ["54321"]
        await expect(createCarSpecificationUseCase.execute({
            car_id,
            specifications_id
        })
        ).rejects.toEqual(new AppError("Car does not exists!"))
    })

})