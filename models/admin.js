const db = require('../db/database');
const bcrypt = require('bcrypt');

class Admin {
  // 通过用户名获取管理员
  static getByUsername(username, callback) {
    const sql = `SELECT * FROM admins WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      callback(err, row);
    });
  }

  // 验证登录
  static authenticate(username, password, callback) {
    this.getByUsername(username, (err, admin) => {
      if (err) {
        return callback(err, null);
      }
      if (!admin) {
        return callback(null, false);
      }
      
      // 检查密码是否匹配
      bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err) {
          return callback(err, null);
        }
        if (isMatch) {
          return callback(null, admin);
        } else {
          return callback(null, false);
        }
      });
    });
  }

  // 修改密码
  static changePassword(id, newPassword, callback) {
    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
      if (err) {
        return callback(err);
      }
      const sql = `UPDATE admins SET password = ? WHERE id = ?`;
      db.run(sql, [hash, id], function(err) {
        callback(err, this.changes);
      });
    });
  }
  
  // 创建新管理员
  static createAdmin(username, password, isSuper, callback) {
    // 检查用户名是否已存在
    this.getByUsername(username, (err, admin) => {
      if (err) {
        return callback(err);
      }
      
      if (admin) {
        return callback(new Error('用户名已存在'));
      }
      
      // 哈希密码
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return callback(err);
        }
        
        const sql = `INSERT INTO admins (username, password, is_super) VALUES (?, ?, ?)`;
        db.run(sql, [username, hash, isSuper ? 1 : 0], function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, { id: this.lastID, username, is_super: isSuper ? 1 : 0 });
        });
      });
    });
  }
  
  // 获取所有管理员
  static getAllAdmins(callback) {
    const sql = `SELECT id, username, is_super, created_at FROM admins ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }
  
  // 删除管理员
  static deleteAdmin(id, callback) {
    const sql = `DELETE FROM admins WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Admin; 