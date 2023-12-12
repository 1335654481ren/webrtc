const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 指定要分享的目录路径
const sharedDirectory = path.join(__dirname, 'shared');

// 设置模板引擎为 ejs，用于渲染目录列表
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件中间件，用于提供目录浏览和文件下载
app.use(express.static(sharedDirectory));

// 路由：渲染目录列表
app.get('/', (req, res) => {
  // 读取目录内容
  fs.readdir(sharedDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(files);
    // 渲染目录列表
    res.render('index', { files });
  });
});

// 路由：下载文件
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(sharedDirectory, filename);

  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    // 设置响应头，提示浏览器下载文件
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // 创建可读流并将文件内容发送到响应
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('File Not Found');
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
