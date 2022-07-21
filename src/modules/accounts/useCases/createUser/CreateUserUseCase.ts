import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from 'bcrypt'
import { AppError } from "../../../../shared/infra/errors/AppError";

@injectable()
class CreateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute({ email, driver_license, name, password }: ICreateUserDTO): Promise<void> {

        const userAlreadyExists = await this.usersRepository.findByEmail(email)

        if (userAlreadyExists) {
            throw new AppError("User already exists!")
        }

        const encryptedPassword = await hash(password, 8)
        await this.usersRepository.create({
            email,
            driver_license,
            name,
            password: encryptedPassword
        })
    }

}

export { CreateUserUseCase }