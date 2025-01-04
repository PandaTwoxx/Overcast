import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import { Router, enhanceResponse } from "./nodeHttpRouter.js";
// Load .env variables
dotenv.config();
// Create a connection pool
const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});
// Function to query the database
const queryDatabase = async (query, params = []) => {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(query, params);
            return result.rows;
        }
        finally {
            client.release(); // Release the connection back to the pool
        }
    }
    catch (err) {
        console.error('Database query error', err);
        throw err;
    }
};
let router = new Router();
let logger = {
    name: "logger",
    handler: async (req, res, params, query) => {
        const ip = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;
        console.log('Received %s request on path %s from ip %s', req.method, req.url, ip);
        return true;
    },
};
router.addGlobalPlugin(logger);
router.addRoute('GET', '/', async (req, res, params, query) => {
    let enhancedRes = enhanceResponse(res);
    await enhancedRes.renderTemplate('index.html', { title: 'Home' });
});
router.addDirectory('public');
const server = router.createServer();
console.log("hi :)");
server.listen(8000, '0.0.0.0', () => {
    console.log('Listening on port 8000');
});
