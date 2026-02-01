const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { getDate } = require('./modules/utils.js');
const messages = require('./lang/en/en.json');

const port = process.env.PORT || 8080;

http.createServer((req, res) => {
    
    const baseURL = `http://${req.headers.host}`;
    const q = new URL(req.url, baseURL);
    const pathname = q.pathname;

    
    if (pathname.includes('/COMP4537/labs/3/getDate/')) {
        const name = q.searchParams.get("name") || "Guest";
        const formattedMessage = messages.greeting.replace("%1", name) + getDate();
        
        res.writeHead(200, { 
            'Content-Type': 'text/html', 
            'Access-Control-Allow-Origin': '*' 
        });
        return res.end(`<span style="color: blue;">${formattedMessage}</span>`);
    }

    
    if (pathname.includes('/COMP4537/labs/3/writeFile/')) {
        const textToAppend = q.searchParams.get("text");
        
        if (textToAppend) {
            
            fs.appendFile('file.txt', textToAppend + '\n', (err) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error writing to file");
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<p style="color: green;">Successfully appended: ${textToAppend}</p>`);
            });
        } else {
            res.end("Please provide text in the query string, e.g., ?text=BCIT");
        }
        return;
    }

    
    if (pathname.includes('/COMP4537/labs/3/readFile/')) {
        const fileName = path.basename(pathname); 
        const filePath = path.join(__dirname, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end(`<h2 style="color: red;">404 Error: File "${fileName}" not found.</h2>`);
            }
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
        return;
    }

    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("404 Not Found: Path does not exist.");

}).listen(port);

console.log(`Server running on port ${port}`);