const express = require('express');
const FtpSrv = require('ftp-srv');
const path = require('path');

const app = express();
const ftpServer = new FtpSrv({
  url: 'ftp://localhost:3001',
  pasv_url: 'ftp://localhost:3002',
  greeting: ['Welcome to My FTP Server', 'Node.js FTP Server'],
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  // Fetch file list from FTP server
  const fileList = [];
  ftpServer.on('list', (data, callback) => {
    const { connection, path } = data;
    const files = connection.fs.readdirSync(path);
    const formattedFiles = files.map(file => ({
      name: file,
      isDirectory: connection.fs.statSync(path + '/' + file).isDirectory()
    }));
    fileList.push(...formattedFiles);
    callback(null, formattedFiles);
  });

  // Connect to the FTP server
  const client = new FtpSrv.FtpConnection(req.connection);
  client.on('ready', () => {
    client.list('/'); // Trigger the 'list' event to fetch the file list
  });
  ftpServer.emit('login', { connection: client });

  // Render the EJS template once the file list is obtained
  client.on('list', () => {
    res.render('indexs', { fileList });
  });
});

app.get('/download/:file', (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(__dirname, 'ftp', fileName);

  // Download file from FTP server
  res.download(filePath, fileName);
});

ftpServer.listen().then(() => {
  console.log('FTP server listening on port 21');
});

app.listen(3000, () => {
  console.log('Web server listening on port 3000');
});
