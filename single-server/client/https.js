const express = require('express');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem'),
    requestCert: false,  // 关闭对客户端证书的认证
    rejectUnauthorized: false  // 关闭对客户端证书的拒绝
};
const app = express();
// 设置静态文件目录
app.use(express.static('.'));

const server = https.createServer(options, app);

const port = 3000;

server.listen(port, () => {
    console.log(`Server running on https://localhost:${port}/`);
});
