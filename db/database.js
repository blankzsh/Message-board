const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// 数据库文件路径
const dbPath = path.join(__dirname, 'message_board.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
  } else {
    console.log('已连接到SQLite数据库');
    initializeDatabase();
  }
});

// 初始化数据库表结构
function initializeDatabase() {
  // 创建留言表
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_approved INTEGER DEFAULT 0,
    avatar TEXT DEFAULT NULL,
    reply TEXT DEFAULT NULL,
    reply_at DATETIME DEFAULT NULL
  )`);

  // 创建管理员表
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, function(err) {
    if (err) {
      console.error('创建管理员表失败:', err.message);
    } else {
      // 检查是否有管理员账户，如果没有则创建默认管理员
      db.get('SELECT COUNT(*) as count FROM admins', [], (err, row) => {
        if (err) {
          console.error('检查管理员账户失败:', err.message);
        } else if (row.count === 0) {
          // 创建默认管理员账户 admin/admin123
          const saltRounds = 10;
          bcrypt.hash('admin123', saltRounds, (err, hash) => {
            if (err) {
              console.error('加密密码失败:', err.message);
            } else {
              db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash], function(err) {
                if (err) {
                  console.error('创建默认管理员失败:', err.message);
                } else {
                  console.log('已创建默认管理员账户 (admin/admin123)');
                }
              });
            }
          });
        }
      });
    }
  });
}

module.exports = db; 