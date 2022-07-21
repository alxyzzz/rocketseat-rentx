import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

let listCarsUseCase: ListAvailableCarsUseCase
let carsRepositoryInMemory: CarsRepositoryInMemory

describe("List Cars", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory)
    })

    it("should be able to list all available cars", async () => {

        const car = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car description",
            daily_rate: 200,
            license_plate: "PQT-3910",
            fine_amount: 150,
            brand: "Car brand",
            category_id: "category_id"
        })

        const cars = await listCarsUseCase.execute({})

        expect(cars).toEqual([car])
    })

    it("should be able to list all available cars by the brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car2",
            description: "Car description",
            daily_rate: 200,
            license_plate: "PQT-3910",
            fine_amount: 150,
            brand: "Car_brand_test",
            category_id: "category_id"
        })

        const cars = await listCarsUseCase.execute({
            brand: "Car_brand_test"
        })

        expect(cars).toEqual([car])
    })

    it("should be able to list all available cars by the name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car3",
            description: "Car description",
            daily_rate: 200,
            license_plate: "PQT-3910",
            fine_amount: 150,
            brand: "Car_brand_test",
            category_id: "category_id"
        })

        const cars = await listCarsUseCase.execute({
            name: "Car3"
        })

        expect(cars).toEqual([car])
    })

    it("should be able to list all available cars by the category_id", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car4",
            description: "Car description",
            daily_rate: 200,
            license_plate: "PQT-3910",
            fine_amount: 150,
            brand: "Car_brand_test",
            category_id: "category_id_test"
        })

        const cars = await listCarsUseCase.execute({
            category_id: "category_id_test"
        })

        expect(cars).toEqual([car])
    })

})