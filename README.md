# 现代化留言板系统

一个美观、功能完善的留言板系统，基于Express和SQLite构建，具有现代化UI设计和完整的管理功能。

![留言板预览](https://via.placeholder.com/800x400?text=留言板预览)

## 功能特点

### 前台功能
- ✨ 美观的UI设计，包含毛玻璃效果、渐变色和流畅动画
- 📝 游客发布留言（支持文字和头像上传）
- 👀 查看已审核的留言及管理员回复
- 📱 完全响应式设计，适配各种设备

### 管理功能
- 🔒 安全的管理员登录系统
- ✅ 留言审核（批准/拒绝）
- 💬 回复留言
- 🗑️ 删除不良留言
- 👤 管理员账户管理（超级管理员功能）
- 🔑 密码修改（含密码强度检测）

## 技术栈

- **前端**：HTML, CSS (SCSS), JavaScript
- **后端**：Node.js, Express.js
- **数据库**：SQLite3
- **模板引擎**：EJS
- **样式**：响应式设计, 毛玻璃效果, 动画

## 快速开始

### 环境要求
- Node.js 14.0 或更高版本
- npm 或 pnpm 包管理器

### 安装步骤

1. 克隆仓库到本地
```bash
git clone <仓库地址> 留言板
cd 留言板
```

2. 安装依赖
```bash
npm install
# 或使用 pnpm
pnpm install
```

3. 启动应用
```bash
npm start
# 开发模式启动
npm run dev
```

4. 访问应用
- 前台页面: http://localhost:3000
- 管理后台: http://localhost:3000/admin

### 默认管理员账号
- 用户名: admin
- 密码: admin123

## 项目结构

```
├── app.js                # 应用入口文件
├── db/                   # 数据库相关
│   ├── database.js       # 数据库连接和初始化
│   └── message_board.db  # SQLite数据库文件
├── models/               # 数据模型
│   ├── message.js        # 留言模型
│   └── admin.js          # 管理员模型
├── routes/               # 路由控制
│   ├── index.js          # 前台路由
│   └── admin.js          # 管理后台路由
├── views/                # 视图模板
│   ├── index.ejs         # 前台首页
│   ├── partials/         # 页面组件
│   └── admin/            # 管理后台页面
├── public/               # 静态资源
│   ├── css/              # 样式文件
│   ├── js/               # 脚本文件
│   └── images/           # 图片资源
└── package.json          # 项目配置
```

## 使用指南

### 前台使用
1. 访问首页，可以查看现有留言
2. 填写表单发布新留言（需提供姓名和内容）
3. 可选择上传头像（支持jpg、png、gif等格式，最大2MB）
4. 提交后，留言将等待管理员审核

### 管理后台
1. 访问 `/admin` 路径，使用管理员账号登录
2. 在管理面板中查看所有留言
3. 审核待批准的留言
4. 回复已批准的留言
5. 删除不良留言
6. 可以修改密码或管理管理员账号（超级管理员）

## 开发与定制

### 样式定制
项目使用SCSS预处理器，主要样式文件位于`public/css/style.scss`。您可以通过修改此文件来自定义界面外观。

```bash
# 编译SCSS文件
npm run sass
```

### 添加新功能
1. 修改相应的模型（`models/`目录）
2. 更新路由控制器（`routes/`目录）
3. 创建或修改视图模板（`views/`目录）

## 贡献指南

欢迎提交问题报告和功能建议。如果您想贡献代码：

1. Fork 项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有任何问题或建议，请通过以下方式联系我：

- 电子邮件：[your-email@example.com](mailto:your-email@example.com)
- 项目Issues: [GitHub Issues](https://github.com/yourusername/message-board/issues)

---

感谢使用我们的留言板系统！希望它能为您的网站增添互动性和价值。 