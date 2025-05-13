const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Message = require('../models/message');

// 检查是否已登录的中间件
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  res.redirect('/admin/login');
};

// 检查是否是超级管理员的中间件
const isSuperAdmin = (req, res, next) => {
  if (req.session && req.session.admin && req.session.admin.is_super === 1) {
    return next();
  }
  res.status(403).render('error', {
    title: '403 - 权限不足',
    message: '您没有访问此页面的权限'
  });
};

// 登录页面
router.get('/login', (req, res) => {
  res.render('admin/login', {
    title: '管理员登录',
    error: req.query.error
  });
});

// 登录处理
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.redirect('/admin/login?error=请输入用户名和密码');
  }

  Admin.authenticate(username, password, (err, admin) => {
    if (err) {
      console.error('登录错误:', err.message);
      return res.redirect('/admin/login?error=登录失败，请稍后再试');
    }
    
    if (!admin) {
      return res.redirect('/admin/login?error=用户名或密码错误');
    }
    
    // 登录成功，保存会话
    req.session.admin = {
      id: admin.id,
      username: admin.username,
      is_super: admin.is_super
    };
    
    res.redirect('/admin/dashboard');
  });
});

// 管理面板
router.get('/dashboard', isAuthenticated, (req, res) => {
  Message.getAll((err, messages) => {
    if (err) {
      console.error('获取留言失败:', err.message);
      return res.status(500).render('error', {
        title: '错误',
        message: '获取留言失败，请稍后再试'
      });
    }
    
    res.render('admin/dashboard', {
      title: '管理面板',
      admin: req.session.admin,
      messages: messages
    });
  });
});

// 待审核留言
router.get('/pending', isAuthenticated, (req, res) => {
  Message.getPending((err, messages) => {
    if (err) {
      console.error('获取待审核留言失败:', err.message);
      return res.status(500).render('error', {
        title: '错误',
        message: '获取待审核留言失败，请稍后再试'
      });
    }
    
    res.render('admin/pending', {
      title: '待审核留言',
      admin: req.session.admin,
      messages: messages
    });
  });
});

// 批准留言
router.post('/approve/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  
  Message.approve(id, (err, changes) => {
    if (err) {
      console.error('批准留言失败:', err.message);
      return res.status(500).json({ success: false, message: '批准留言失败' });
    }
    
    if (changes === 0) {
      return res.status(404).json({ success: false, message: '找不到该留言' });
    }
    
    res.json({ success: true, message: '留言已批准' });
  });
});

// 删除留言
router.post('/delete/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  
  Message.delete(id, (err, changes) => {
    if (err) {
      console.error('删除留言失败:', err.message);
      return res.status(500).json({ success: false, message: '删除留言失败' });
    }
    
    if (changes === 0) {
      return res.status(404).json({ success: false, message: '找不到该留言' });
    }
    
    res.json({ success: true, message: '留言已删除' });
  });
});

// 回复留言
router.post('/reply/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  const { reply } = req.body;
  
  if (!reply) {
    return res.status(400).json({ success: false, message: '回复内容不能为空' });
  }
  
  Message.reply(id, reply, (err, changes) => {
    if (err) {
      console.error('回复留言失败:', err.message);
      return res.status(500).json({ success: false, message: '回复留言失败' });
    }
    
    if (changes === 0) {
      return res.status(404).json({ success: false, message: '找不到该留言' });
    }
    
    res.json({ success: true, message: '回复已添加' });
  });
});

// 修改密码页面
router.get('/change-password', isAuthenticated, (req, res) => {
  res.render('admin/change-password', {
    title: '修改密码',
    admin: req.session.admin,
    success: req.query.success,
    error: req.query.error
  });
});

// 修改密码处理
router.post('/change-password', isAuthenticated, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.redirect('/admin/change-password?error=所有字段都为必填项');
  }
  
  if (newPassword !== confirmPassword) {
    return res.redirect('/admin/change-password?error=新密码与确认密码不匹配');
  }
  
  Admin.authenticate(req.session.admin.username, currentPassword, (err, admin) => {
    if (err) {
      console.error('验证当前密码失败:', err.message);
      return res.redirect('/admin/change-password?error=验证当前密码失败');
    }
    
    if (!admin) {
      return res.redirect('/admin/change-password?error=当前密码不正确');
    }
    
    Admin.changePassword(admin.id, newPassword, (err, changes) => {
      if (err) {
        console.error('修改密码失败:', err.message);
        return res.redirect('/admin/change-password?error=修改密码失败');
      }
      
      res.redirect('/admin/change-password?success=密码已修改');
    });
  });
});

// 登出
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// 管理员管理页面
router.get('/manage-admins', isAuthenticated, isSuperAdmin, (req, res) => {
  Admin.getAllAdmins((err, admins) => {
    if (err) {
      console.error('获取管理员列表失败:', err.message);
      return res.render('admin/manage-admins', {
        title: '管理员管理',
        admin: req.session.admin,
        admins: [],
        error: '获取管理员列表失败',
        success: req.query.success
      });
    }
    
    res.render('admin/manage-admins', {
      title: '管理员管理',
      admin: req.session.admin,
      admins: admins,
      error: req.query.error,
      success: req.query.success
    });
  });
});

// 添加管理员页面
router.get('/add-admin', isAuthenticated, isSuperAdmin, (req, res) => {
  res.render('admin/add-admin', {
    title: '添加管理员',
    admin: req.session.admin,
    error: req.query.error
  });
});

// 添加管理员处理
router.post('/add-admin', isAuthenticated, isSuperAdmin, (req, res) => {
  const { username, password, confirmPassword, isSuper } = req.body;
  
  if (!username || !password || !confirmPassword) {
    return res.redirect('/admin/add-admin?error=所有字段都为必填项');
  }
  
  if (password !== confirmPassword) {
    return res.redirect('/admin/add-admin?error=两次输入的密码不匹配');
  }
  
  if (username.length < 3) {
    return res.redirect('/admin/add-admin?error=用户名至少需要3个字符');
  }
  
  if (password.length < 6) {
    return res.redirect('/admin/add-admin?error=密码至少需要6个字符');
  }
  
  Admin.createAdmin(username, password, isSuper === 'on', (err, newAdmin) => {
    if (err) {
      console.error('创建管理员失败:', err.message);
      return res.redirect(`/admin/add-admin?error=${encodeURIComponent(err.message)}`);
    }
    
    res.redirect('/admin/manage-admins?success=管理员创建成功');
  });
});

// 删除管理员
router.post('/delete-admin/:id', isAuthenticated, isSuperAdmin, (req, res) => {
  const adminId = req.params.id;
  
  // 不能删除自己
  if (parseInt(adminId) === req.session.admin.id) {
    return res.redirect('/admin/manage-admins?error=不能删除当前登录的管理员账号');
  }
  
  Admin.deleteAdmin(adminId, (err, changes) => {
    if (err) {
      console.error('删除管理员失败:', err.message);
      return res.redirect('/admin/manage-admins?error=删除管理员失败');
    }
    
    if (changes === 0) {
      return res.redirect('/admin/manage-admins?error=未找到该管理员');
    }
    
    res.redirect('/admin/manage-admins?success=管理员已成功删除');
  });
});

module.exports = router; 