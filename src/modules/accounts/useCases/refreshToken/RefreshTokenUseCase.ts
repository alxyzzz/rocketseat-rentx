import { sign, verify } from "jsonwebtoken"
import { inject, injectable } from "tsyringe"
import auth from "../../../../config/auth"

import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider"
import { AppError } from "../../../../shared/infra/errors/AppError"
import { IUsersTokenRepository } from "../../repositories/IUsersTokenRepository"

interface IPayload {
    sub: string,
    email: string
}


@injectable()
class RefreshTokenUSeCase {

    constructor(
        @inject("UsersTokenRepository")
        private usersTokenRepository: IUsersTokenRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }



    async execute(token: string): Promise<string> {

        const { expires_in_refresh_token, secret_refresh_token, expires_refresh_token_days } = auth

        const { email, sub } = verify(token, secret_refresh_token) as IPayload

        const user_id = sub

        const userToken = await this.usersTokenRepository.findByUserIdAndRefreshToken(user_id, token)

        if (!userToken) {
            throw new AppError("Refresh Token does not exists!")
        }

        await this.usersTokenRepository.deleteById(userToken.id)

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: sub,
            expiresIn: expires_in_refresh_token
        })

        const expires_date = this.dateProvider.addDays(
            expires_refresh_token_days
        )

        await this.usersTokenRepository.create({
            expires_date,
            refresh_token,
            user_id
        })

        return refresh_token
    }
}

export { RefreshTokenUSeCase }