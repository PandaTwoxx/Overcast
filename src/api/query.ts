'use server'

import { Client } from 'pg'
import 'dotenv/config'

const dbUrl = process.env.DATABASE_URL || 'fake-database-url-please-replace-me'

export default async function queryDatabase(
    query: string,
    params: unknown[] = []
) {
    try {
        const client = new Client({
            connectionString: dbUrl,
        })
        await client.connect()
        //console.log(client);
        const result = await client.query(query, params)
        await client.end()
        return result
    } catch (err) {
        console.error('Database query error:', err)
        throw err
    }
}

// Example usage
//(async () => {
//    const query = 'SELECT * FROM your_table_name';
//    const rows = await queryDatabase(query);
//    console.log(rows);
//})();
