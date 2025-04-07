import queryDatabase from '@/api/query'
import { hashPassword, verifyPassword } from '@/api/password'

async function createUser(
    username: string,
    password: string,
    firstName: string,
    lastName: string
) {
    try {
        await queryDatabase(
            'INSERT INTO users(username, password, firstname, lastname) VALUES ($1, $2, $3, $4)',
            [username, await hashPassword(password), firstName, lastName]
        )
        const result = await queryDatabase(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )
        return Number(result.rows[0].id)
    } catch (err) {
        console.error(err)
        return undefined
    }
}

async function verifyUsername(username: string) {
    const result = await queryDatabase(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    return result.rows.length > 0
}

async function checkPassword(
    username: string,
    password: string
): Promise<boolean> {
    const result = await queryDatabase(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    return await verifyPassword(password, result.rows[0].password)
}

async function deleteUser(username: string) {
    const result = await queryDatabase(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    const userId = result.rows[0].id
    await queryDatabase('DELETE FROM users WHERE username = $1', [username])
    await queryDatabase('DELETE FROM topics WHERE userid = $1', [userId])
    await queryDatabase('DELETE FROM votes WHERE user_id = $1', [userId])
}

async function getUserId(username: string) {
    const result = await queryDatabase(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    return result.rows[0].id
}

async function getUsername(userId: string) {
    const result = await queryDatabase('SELECT * FROM users WHERE id = $1', [
        userId,
    ])
    return result.rows[0].username
}

async function getUser(userId: string) {
    return (await queryDatabase('SELECT * FROM users WHERE id = $1', [userId]))
        .rows[0]
}

export {
    createUser,
    verifyUsername,
    checkPassword,
    deleteUser,
    getUserId,
    getUsername,
    getUser,
}
