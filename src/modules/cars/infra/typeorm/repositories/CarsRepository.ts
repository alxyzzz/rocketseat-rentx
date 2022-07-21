import { Repository } from "typeorm";
import AppDataSource from "../../../../../shared/infra/typeorm/data-source";
import { ICreateCarDTO } from "../../../dtos/ICreateCarDTO";
import { ICarsRepository } from "../../../repositories/ICarsRepository";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {

    private respository: Repository<Car>

    constructor() {
        this.respository = AppDataSource.getRepository(Car)
    }


    async create({ brand,
        category_id,
        daily_rate,
        description,
        fine_amount,
        license_plate,
        name,
        specifications,
        id }: ICreateCarDTO): Promise<Car> {

        const car = this.respository.create({
            brand,
            category_id,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            name,
            specifications,
            id
        })

        await this.respository.save(car)

        return car

    }
    async findByLicensePlate(license_plate: string): Promise<Car> {
        return await this.respository.findOneBy({ license_plate })
    }

    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {

        const carsQuery = this.respository
            .createQueryBuilder("c")
            .where("available = :available", { available: true });

        if (brand) {
            carsQuery
                .andWhere("c.brand = :brand", { brand })
        }

        if (name) {
            carsQuery
                .andWhere("c.name = :name", { name })
        }

        if (category_id) {
            carsQuery
                .andWhere("c.category_id = :category_id", { category_id })
        }

        const cars = await carsQuery.getMany()

        return cars
    }

    async findById(id: string): Promise<Car> {

        const car = await this.respository.findOneBy({ id })
        return car;
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.respository
            .createQueryBuilder()
            .update()
            .set({ available })
            .where("id =:id")
            .setParameters({ id })
            .execute()
    }
}

export { CarsRepository }