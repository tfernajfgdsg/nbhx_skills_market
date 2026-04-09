---
name: voyah-order-export
description: This skill should be used when the user needs to fetch Voyah (岚图) customer order data from the Voyah Supply Chain Collaboration Platform (scop.voyah.cn). It automates login, navigation, and data export for "周滚动预告" (weekly rolling forecast) and "日消耗预告" (daily consumption forecast) reports. Trigger when the user mentions 岚图, voyah, 点单, 预告, 周滚动, 日消耗, or asks to export order data from the Voyah platform.
---

# 岚图客户点单需求导出

## Overview

自动化岚图供应协同平台 (scop.voyah.cn) 的数据导出流程。自动登录系统，从"预告管理"模块导出周滚动预告和日消耗预告数据，保存到本地文件夹。

## Prerequisites

运行脚本前需确保已安装依赖：

```bash
cd <skill-path>/scripts
npm install
npx playwright install chromium
```

## Workflow

### Step 1: 执行导出脚本

运行自动化脚本导出数据：

```bash
node <skill-path>/scripts/export_voyah_orders.js [--output-dir <输出目录>]
```

参数说明：
- `--output-dir`: 可选，指定导出文件保存目录，默认为当前工作目录下的 `voyah_exports/`

### Step 2: 脚本执行流程

脚本自动完成以下操作：

1. **登录** - 打开 scop.voyah.cn，自动填入账号密码并登录
2. **导出周滚动预告** - 通过侧边栏菜单"预告管理 → 周滚动预告"，点击"导出"按钮下载文件
3. **导出日消耗预告** - 通过侧边栏菜单"预告管理 → 日消耗预告"，点击"导出"按钮下载文件

### Step 3: 获取导出结果

导出的文件保存在输出目录中，文件命名格式：
- `周滚动预告_<时间戳>.xlsx`
- `日消耗预告_<时间戳>.xlsx`

## Troubleshooting

- **登录失败**: 检查账号密码是否正确，确认网络可访问 scop.voyah.cn
- **菜单找不到**: 页面结构可能更新，需检查 `.el-submenu__title` 和 `.el-menu-item` 选择器
- **导出超时**: 网络较慢时可在脚本 CONFIG.timeouts.download 中增加超时时间
- **浏览器启动失败**: 运行 `npx playwright install chromium` 安装浏览器
- **错误截图**: 脚本出错时会自动在输出目录生成 `error_screenshot.png`

## Technical Notes

- 网站基于 Element UI (Vue) 框架构建
- 登录后不能直接通过 hash URL 导航（会404），必须通过菜单点击导航
- 菜单结构：首页 → 预告管理(子菜单) → 日消耗预告 / 周滚动预告
- 导出按钮选择器：`button:has-text("导出")`
- 输入框选择器：`.el-input__inner`
- 登录按钮选择器：`.el-button`
- **关键**: 点击"导出"按钮后会弹出 Element UI 确认对话框（`el-message-box__wrapper`），需点击"确定"按钮（`.el-button--primary`）后才会触发下载
- 导出文件格式为 `.xls`
- SPA 应用初次加载较慢，需等待 `.el-input__inner` 出现

## Resources

### scripts/

- `export_voyah_orders.js` - 主自动化脚本，基于 Playwright 实现登录、导航、导出全流程
- `package.json` - Node.js 依赖配置
