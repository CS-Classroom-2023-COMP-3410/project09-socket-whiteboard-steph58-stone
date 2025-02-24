import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a basic HTTP server
const server = http.createServer((req, res) => {

    // Handle the favicon request to avoid 404 errors
    if (req.url === '/favicon.ico') {
        res.writeHead(204, { 'Content-Type': 'image/x-icon' });
        return res.end();
    }

    
    let filePath = path.join(__dirname, '../client/dist', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);

    // Default to index.html if no specific file is requested
    if (!ext) {
        filePath = path.join(__dirname, '../client/dist', 'index.html');
    }

    // Determine the content type based on the file extension
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.ico': 'image/x-icon'
    }[ext] || 'text/plain';

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

let boardState = [];

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('boardState', boardState);

    socket.on('draw', (data) => {
        boardState.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        boardState = [];
        io.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Socket.IO server running on port 3000');
});