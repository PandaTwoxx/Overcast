import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import { Router, renderTemplate, enhanceResponse } from "./nodeHttpRouter.js";
import { watch } from 'node:fs';
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
const createLiveReloadPlugin = (options) => {
    return {
        name: 'liveReload',
        handler: async (req, res, params, query, body) => {
            if (req.method === 'GET' && req.url === '/live-reload-template') {
                const enhancedRes = enhanceResponse(res);
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                res.flushHeaders();
                const sendUpdate = async () => {
                    try {
                        const content = await renderTemplate(options.templatePath, { message: 'Template updated!' });
                        res.write(`data: ${JSON.stringify({ html: content })}\n\n`);
                    }
                    catch (error) {
                        console.error('Error rendering template:', error);
                        res.write(`data: ${JSON.stringify({ error: 'Failed to render template' })}\n\n`);
                    }
                };
                await sendUpdate();
                const watcher = watch(options.templatePath, { persistent: true }, async (eventType, filename) => {
                    if (filename && eventType === 'change') {
                        console.log(`Template file changed: ${filename}`);
                        await sendUpdate();
                    }
                });
                req.on('close', () => {
                    console.log('Client disconnected, closing file watcher.');
                    watcher.close();
                });
                req.on('end', () => {
                    console.log('Client connection ended, closing file watcher.');
                    watcher.close();
                });
                req.on('error', (err) => {
                    console.error('Client connection error:', err);
                    watcher.close();
                });
                return false; // Halt further processing as the response is being streamed
            }
            return true; // Allow other handlers/plugins to process the request
        },
    };
};
router.addGlobalPlugin(logger);
let indexReloadPlugin = createLiveReloadPlugin({ templatePath: 'templates/index.html' });
router.addStreamRoute('GET', '/', (req, res) => {
    enhanceResponse(res).renderTemplate('index.html', { title: 'Home' });
}, [indexReloadPlugin]);
router.addDirectory('public');
const server = router.createServer();
console.log("hi :)");
server.listen(8000, '0.0.0.0', () => {
    console.log('Listening on port 8000');
});
