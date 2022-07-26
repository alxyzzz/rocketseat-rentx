import { hash } from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { app } from '../../../../shared/infra/http/app'
import { createConnection } from '../../../../shared/infra/typeorm/data-source'

let connection: DataSource

describe("Create Category Controller", () => {

    beforeAll(async () => {

        connection = await createConnection()
        await connection.runMigrations()

        const id = uuidV4()
        const password = await hash("admin", 8)

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
            values('${id}', 'admin', 'admin@email.com', '${password}', true, 'now()', 'XXXXXX')
            `)
    })

    afterAll(async () => {
        await connection.dropDatabase()
        await connection.destroy()
    })

    it("should be able to create a new category", async () => {

        const responseToken = await request(app)
            .post("/session")
            .send({
                email: "admin@email.com",
                password: "admin"
            })

        const { token } = responseToken.body

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest Name",
                description: "Category Supertest Description"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(201)
    })

    it("should not be able to create a new category with an existent name", async () => {

        const responseToken = await request(app)
            .post("/session")
            .send({
                email: "admin@email.com",
                password: "admin"
            })

        const { token } = responseToken.body

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest Name",
                description: "Category Supertest Description"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.status).toBe(400)
    })
})