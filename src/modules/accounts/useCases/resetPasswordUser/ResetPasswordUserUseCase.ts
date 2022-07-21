import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/infra/errors/AppError";
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository";

interface IRequest {
    token: string,
    password: string
}

@injectable()
class ResetPasswordUserUseCase {

    constructor(
        @inject("UsersTokenRepository")
        private userTokenRepository: IUsersTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute({ token, password }: IRequest) {

        const userToken = await this.userTokenRepository.findByRefreshToken(token)

        if (!userToken) {
            throw new AppError("Token invalid!")
        }
    }
}

export { ResetPasswordUserUseCase }