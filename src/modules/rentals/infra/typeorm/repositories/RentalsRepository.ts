import { IsNull, Repository } from "typeorm";
import AppDataSource from "../../../../../shared/infra/typeorm/data-source";
import { ICreateRentalDTO } from "../../../dtos/ICreateRentalDTO";
import { IRentalsRepository } from "../../../repositories/IRentalsRepository";
import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {

    private repository: Repository<Rental>

    constructor() {
        this.repository = AppDataSource.getRepository(Rental)
    }


    async findOpenRentalByCarId(car_id: string): Promise<Rental> {
        const rental = await this.repository.findOne({
            where: { car_id, end_date: IsNull() }
        })
        return rental
    }
    async findOpenRentalByUserId(user_id: string): Promise<Rental> {
        const rental = await this.repository.findOne({
            where: { user_id, end_date: IsNull() }
        })
        return rental
    }
    async create({
        car_id,
        expected_return_date,
        user_id,
        id,
        end_date,
        total
    }: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create({
            car_id,
            expected_return_date,
            user_id,
            id,
            end_date,
            total
        })
        await this.repository.save(rental)
        return rental
    }

    async findById(id: string): Promise<Rental> {
        const rental = await this.repository.findOneBy({ id })
        return rental
    }

    async findByUser(user_id: string): Promise<Rental[]> {
        const rentals = await this.repository.find({
            where: { user_id },
            relations: ["car"]
        })

        return rentals
    }
}

export { RentalsRepository }