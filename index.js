const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    switch (req.url) {
        case "/":
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Placeholdy is up and running.\n');
            break;
        case "/about":
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('About\n');
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found\n');
            break;
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});