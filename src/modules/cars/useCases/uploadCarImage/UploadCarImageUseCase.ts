import { inject, injectable } from "tsyringe"
import { ICarsImageRepository } from "../../repositories/ICarsImageRepository"

interface IRequest {
    car_id: string,
    images_name: string[]
}

@injectable()
class UploadCarImageUseCase {

    constructor(
        @inject("CarImagesRepository")
        private carImagesRepository: ICarsImageRepository
    ) { }

    async execute({ car_id, images_name }: IRequest): Promise<void> {
        images_name.map(async (image) => {
            await this.carImagesRepository.create(car_id, image)
        })
    }
}

export { UploadCarImageUseCase }