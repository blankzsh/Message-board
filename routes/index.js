const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Message = require('../models/message');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/avatars'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 限制2MB
  fileFilter: function(req, file, cb) {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 首页 - 显示留言列表
router.get('/', (req, res) => {
  Message.getApproved((err, messages) => {
    if (err) {
      console.error('获取留言失败:', err.message);
      return res.status(500).render('error', {
        title: '错误',
        message: '获取留言失败，请稍后再试'
      });
    }
    res.render('index', {
      title: '留言板',
      messages: messages
    });
  });
});

// 提交留言
router.post('/submit', upload.single('avatar'), (req, res) => {
  const { name, email, content } = req.body;
  
  if (!name || !content) {
    return res.status(400).render('error', {
      title: '提交失败',
      message: '姓名和留言内容为必填项'
    });
  }

  const messageData = {
    name,
    email,
    content,
    avatar: req.file ? '/images/avatars/' + req.file.filename : null
  };

  Message.create(messageData, (err, messageId) => {
    if (err) {
      console.error('创建留言失败:', err.message);
      return res.status(500).render('error', {
        title: '提交失败',
        message: '创建留言失败，请稍后再试'
      });
    }
    res.render('success', {
      title: '提交成功',
      message: '留言提交成功，等待管理员审核后将会显示',
      redirectUrl: '/',
      redirectTime: 3
    });
  });
});

module.exports = router; 