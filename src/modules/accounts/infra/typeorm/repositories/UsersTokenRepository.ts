import { Repository } from "typeorm";
import AppDataSource from "../../../../../shared/infra/typeorm/data-source";
import { ICreateUserTokenDTO } from "../../../dtos/ICreateUserTokenDTO";
import { IUsersTokenRepository } from "../../../repositories/IUsersTokenRepository";
import { UserTokens } from "../entities/UserTokens";

class UsersTokenRepository implements IUsersTokenRepository {

    private repository: Repository<UserTokens>

    constructor() {
        this.repository = AppDataSource.getRepository(UserTokens)
    }


    async create({ user_id, refresh_token, expires_date }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = this.repository.create({
            user_id,
            refresh_token,
            expires_date
        })

        await this.repository.save(userToken)

        return userToken
    }

    async findByUserIdAndRefreshToken(user_id: string, token: string): Promise<UserTokens> {
        const userToken = await this.repository.findOneBy({ user_id, refresh_token: token })
        return userToken
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
    }

    async findByRefreshToken(refreshToken: string): Promise<UserTokens> {
        const userToken = await this.repository.findOneBy({
            refresh_token: refreshToken
        })

        return userToken
    }

}

export { UsersTokenRepository }