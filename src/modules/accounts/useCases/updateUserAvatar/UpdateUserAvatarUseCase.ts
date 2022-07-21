import { inject, injectable } from "tsyringe"
import { deleteFile } from "../../../../utils/File"

import { IUsersRepository } from "../../repositories/IUsersRepository"

interface IRequest {
    user_id: string,
    avatar_file: string
}

@injectable()
class UpdateUserAvatarUseCase {
    //Adicionar Coluna 'avatar' na tabela 'users'
    //Refatorar usuário com a coluna avatar
    //Configurar upload do multer para avartares
    //Criar a regra de negocio do upload
    //Criar controller 

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute({ user_id, avatar_file }: IRequest): Promise<void> {
        const user = await this.usersRepository.findById(user_id)

        if (user.avatar)
            await deleteFile(`./tmp/avatar/${user.avatar}`)
        user.avatar = avatar_file

        await this.usersRepository.create(user)
    }

}

export { UpdateUserAvatarUseCase }