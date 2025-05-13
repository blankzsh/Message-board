const db = require('../db/database');

class Message {
  // 获取所有留言
  static getAll(callback) {
    const sql = `SELECT * FROM messages ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }

  // 获取已批准的留言
  static getApproved(callback) {
    const sql = `SELECT * FROM messages WHERE is_approved = 1 ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }

  // 获取未批准的留言
  static getPending(callback) {
    const sql = `SELECT * FROM messages WHERE is_approved = 0 ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  }

  // 获取单个留言
  static getById(id, callback) {
    const sql = `SELECT * FROM messages WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  }

  // 添加新留言
  static create(messageData, callback) {
    const { name, email, content, avatar } = messageData;
    const sql = `INSERT INTO messages (name, email, content, avatar) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, content, avatar], function(err) {
      callback(err, this.lastID);
    });
  }

  // 批准留言
  static approve(id, callback) {
    const sql = `UPDATE messages SET is_approved = 1 WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  }

  // 添加回复
  static reply(id, replyText, callback) {
    const sql = `UPDATE messages SET reply = ?, reply_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [replyText, id], function(err) {
      callback(err, this.changes);
    });
  }

  // 删除留言
  static delete(id, callback) {
    const sql = `DELETE FROM messages WHERE id = ?`;
    db.run(sql, [id], function(err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Message; 