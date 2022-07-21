import { AppError } from "../../../../shared/infra/errors/AppError"
import { ICreateRentalDTO } from "../../dtos/ICreateRentalDTO"
import { Rental } from "../../infra/typeorm/entities/Rental"
import { IRentalsRepository } from "../../repositories/IRentalsRepository"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider"
import { inject, injectable } from "tsyringe"
import { ICarsRepository } from "../../../cars/repositories/ICarsRepository"

dayjs.extend(utc)


@injectable()
class CreateRentalUseCase {

    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository
    ) { }

    async execute({ user_id, car_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
        const minimunHour = 24
        const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(car_id)

        if (carUnavailable) {
            throw new AppError("Car is unavailable!")
        }

        const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUserId(user_id)

        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress for user!")
        }

        const dateNow = this.dateProvider.dateNow()

        const compare = this.dateProvider.compareInHours(dateNow, expected_return_date)

        if (compare < minimunHour) {
            throw new AppError("Invalid return time!")
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date
        })

        await this.carsRepository.updateAvailable(car_id, false)

        return rental
    }

}

export { CreateRentalUseCase }