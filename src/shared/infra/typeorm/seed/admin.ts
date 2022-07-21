import { createConnection } from "../data-source";
import { v4 as uuidV4 } from 'uuid'
import { hash } from 'bcrypt'

async function create() {
    const connection = await createConnection("localhost")

    const id = uuidV4()
    const password = await hash("admin", 8)

    await connection.query(
        `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@email.com', '${password}', true, 'now()', 'XXXXXX')
        `)
}

create().then(() => console.log("User admin created!"))