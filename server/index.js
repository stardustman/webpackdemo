// 服务器端 ssr 没有 window
if (typeof window === 'undefined') {
    global.window = {}
}

const express = require('express');

const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname,'../dist/search.html'),'utf-8');
const data = require('./data.json');

const server = (port) => {
    const app = express();

    app.use(express.static('dist'));
    app.get('/search', (req, res) => {
        res.status(200).send(renderMarkup(renderToString(SSR)));
    });

    
    app.listen(port, () => {
        console.log("server is running on port" + port);
    })


};

server(process.env.PORT || 3000);
const renderMarkup = (str)=>{
    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <meta http-equiv="X-UA-Compatible" content="ie=edge">
    //     <title>Document</title>
    // </head>
    // <body>
    //     ${str}
    // </body>
    // </html>
    // `;

    const dataStr = JSON.stringify(data);
    return template.replace('<!--HTML_PLACEHOLDER-->', str).
        replace('<!--INIT_HTML_PLACEHOLDER-->',`<script>window.__init_data=${dataStr}</script>`);
}
    
 
