const http = require("http");
const { createCanvas } = require("canvas");

const PORT = process.env.PORT || 3000;
const CACHE_DURATION = 60 * 60 * 24;

const addCacheHeaders = (res) => {
    res.setHeader("Cache-Control", `public, max-age=${CACHE_DURATION}`);
    res.setHeader("Expires", new Date(Date.now() + CACHE_DURATION * 1000).toUTCString());
};

const getRandomShortHex = () => Array.from({ length: 3 }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");

const getOppositeLightness = (hex) => {
    // Validate hex format (3 or 6 characters)
    if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) {
        throw new Error('Invalid hex color format. Color value must be a hex without #');
    }

    // Convert 3-char hex to 6-char
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Parse RGB values
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    return 100 - ((max + min) / 2 * 100).toFixed(0);
}

const generateImage = (width, height, color = getRandomShortHex()) => {
    // Account for an empty string
    if (color.length === 0) color = getRandomShortHex();

    const canvas = createCanvas(Number(width), Number(height));
    const ctx = canvas.getContext("2d");

    // Fill background with color
    ctx.fillStyle = `#${color}`;
    ctx.fillRect(0, 0, Number(width), Number(height));

    // Add centered text
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = `hsl(0 0% ${getOppositeLightness(color)}%`;
    ctx.fillText(`${width}x${height}`, Number(width) / 2, Number(height) / 2);

    return canvas.createPNGStream();
}

const handleImageGeneration = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');

    // Parse out the image resolution from the path
    const resolution = req.url.split("/")[2];

    if (!resolution) {
        throw new Error("Missing image dimensions. Expected /image/[width]x[height]");
    }

    // Parse out the width and height
    const [width, height] = resolution.split("x");

    if (!width || !height || isNaN(width) || isNaN(height)) {
        throw new Error("Invalid image dimensions. Expected 'width' and 'height' to be numeric.")
    }

    // Parse out color hex value
    const color = req.url.split("/")[3];

    // Generate the image
    const stream = generateImage(width, height, color);

    addCacheHeaders(res);

    // Pipe the image stream to the response
    return stream.pipe(res);
};

const server = http.createServer((req, res) => {

    // get first path segment
    const path = req.url.split("/")[1];

    try {
        switch (path) {
            case "":
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Placeholdy is up and running.\n');
                break;
            case "image":
                handleImageGeneration(req, res);
                break;
            default:
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found\n');
                break;
        }
    } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end(e.message + '\n');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});