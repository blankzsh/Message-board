const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const ejs = require('ejs');

// 导入路由
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

// 初始化数据库
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'message-board-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1天
}));

// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 使用路由
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// 处理404错误
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - 页面未找到',
    message: '您访问的页面不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - 服务器错误',
    message: '服务器发生错误，请稍后再试'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app; 