import { DataSource } from 'typeorm'
import { User } from '../../../modules/accounts/infra/typeorm/entities/User'
import { UserTokens } from '../../../modules/accounts/infra/typeorm/entities/UserTokens'
import { Car } from '../../../modules/cars/infra/typeorm/entities/Car'
import { CarImage } from '../../../modules/cars/infra/typeorm/entities/CarImage'
import { Category } from '../../../modules/cars/infra/typeorm/entities/Category'
import { Specification } from '../../../modules/cars/infra/typeorm/entities/Specification'
import { Rental } from '../../../modules/rentals/infra/typeorm/entities/Rental'

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "docker",
    password: "ignite",
    database: "rentx",
    synchronize: false,
    logging: false,
    entities: [User, Category, Specification, Car, CarImage, Rental, UserTokens],
    migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
})

export async function createConnection(host = "database"): Promise<DataSource> {
    return await AppDataSource
        .setOptions({
            host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
            database: process.env.NODE_ENV === 'test' ?
                "rentx_test" :
                AppDataSource.options.database.toString()
        }).initialize()
}

export default AppDataSource