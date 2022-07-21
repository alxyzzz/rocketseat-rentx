

import { In, Repository } from "typeorm";
import AppDataSource from "../../../../../shared/infra/typeorm/data-source";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "../../../repositories/ISpecificationsRepository";
import { Specification } from "../entities/Specification";





class SpecificationsRepository implements ISpecificationsRepository {

    private repository: Repository<Specification>

    constructor() {
        this.repository = AppDataSource.getRepository(Specification)
    }

    async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {

        const specification = this.repository.create({
            name,
            description
        })

        await this.repository.save(specification)

        return specification
    }

    async findByName(name: string): Promise<Specification> {
        const specification = await this.repository.findOneBy({ name })
        return specification
    }

    async list(): Promise<Specification[]> {
        const specifications = await this.repository.find()
        return specifications
    }

    async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = await this.repository.findBy({ id: In(ids) })
        return specifications
    }
}

export { SpecificationsRepository }