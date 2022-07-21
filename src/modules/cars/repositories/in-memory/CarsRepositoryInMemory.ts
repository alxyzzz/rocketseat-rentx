import { ICreateCarDTO } from "../../dtos/ICreateCarDTO";
import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
    cars: Car[] = []

    async create({ name,
        description,
        brand,
        category_id,
        daily_rate,
        fine_amount,
        license_plate,
        id }: ICreateCarDTO): Promise<Car> {

        const car = new Car()

        Object.assign(car, {
            name,
            description,
            brand,
            category_id,
            daily_rate,
            fine_amount,
            license_plate,
            id
        })

        this.cars.push(car)

        return car
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {

        return this.cars.find(car => car.license_plate === license_plate)

    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {
        const cars = this.cars
            .filter(car => car.available ||
                ((brand && car.brand === brand) ||
                    (category_id && car.category_id === category_id) ||
                    (name && car.name === name)
                ))
        return cars
    }

    async findById(id: string): Promise<Car> {
        return this.cars.find(car => car.id === id)
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        const index = this.cars.findIndex(car => car.id === id)
        if (index !== -1) {
            this.cars[index].available = available
        }
    }
}


export { CarsRepositoryInMemory }