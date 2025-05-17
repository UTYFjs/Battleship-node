import fsPromises from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

export const httpServer = http.createServer(async (req, res) => {
  const __dirname = path.resolve(path.dirname(''));
  const filePath =
    __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

  try {
    const data = await fsPromises.readFile(filePath);
    res.writeHead(200);
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end(JSON.stringify(err));
  }
});