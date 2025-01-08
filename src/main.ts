import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import { Router, renderTemplate, enhanceResponse, parseBody, Plugin, RouteHandler, EnhancedServerResponse } from "./nodeHttpRouter"

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
const queryDatabase = async (query: string, params: any[] = []): Promise<any> => {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(query, params);
            return result.rows;
        } finally {
            client.release(); // Release the connection back to the pool
        }
    } catch (err) {
        console.error('Database query error', err);
        throw err;
    }
};

let router = new Router()

let logger: Plugin = {
    name: "logger",
    handler: async (req, res, params, query) => {
        const ip = req.headers['x-forwarded-for'] ||
               req.socket.remoteAddress;
        console.log('Received %s request on path %s from ip %s', req.method, req.url, ip)
        return true;
      },
};

router.addGlobalPlugin(logger);

router.addRoute('GET', '/', async (req, res, params, query) => {
    let enhancedRes = enhanceResponse(res);
    await enhancedRes.renderTemplate('index.html', { title: 'Home' });
});

router.addRoute('GET', '/dev', async (req, res, params, query) => {

});


router.addRoute('GET', '/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendEvent = (data: string) => {
        res.write(`data: ${data}\n\n`);
    };

    // Example: Send a message every second
    const intervalId = setInterval(() => {
        sendEvent(JSON.stringify({ message: 'Hello from server' }));
    }, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

router.addDirectory('public');

const server = router.createServer();
console.log("hi :)")
server.listen(8000, '0.0.0.0', () => {
    console.log('Listening on port 8000');
  });