/**
 * 岚图客户点单需求导出脚本
 * 功能：
 *   1. 自动登入 https://scop.voyah.cn
 *   2. 从"预告管理/周滚动预告"页面导出数据
 *   3. 从"预告管理/日消耗预告"页面导出数据
 * 
 * 用法：
 *   node scripts/export_voyah_orders.js [--output-dir <path>]
 * 
 * 依赖：
 *   npm install playwright
 *   npx playwright install chromium
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ============ 配置 ============
const CONFIG = {
  url: 'https://scop.voyah.cn',
  username: 'DPBE8A1',
  password: 'Apple@123',
  defaultOutputDir: path.join(process.cwd(), 'voyah_exports'),
  timeouts: {
    login: 30000,
    navigation: 15000,
    download: 120000,
    menuExpand: 2000,
    pageLoad: 5000,
    gotoLoad: 60000,
  }
};

// ============ 主流程 ============
async function main() {
  // 解析命令行参数
  const args = process.argv.slice(2);
  let outputDir = CONFIG.defaultOutputDir;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output-dir' && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    }
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[INFO] 输出目录: ${outputDir}`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200,
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  const results = {};

  try {
    // ====== Step 1: 登录 ======
    console.log('[STEP 1] 正在登录岚图供应协同平台...');
    await login(page);

    // ====== Step 2: 导出周滚动预告 ======
    console.log('[STEP 2] 正在导出周滚动预告...');
    try {
      await navigateToMenu(page, '周滚动预告');
      const weeklyFile = await exportData(page, outputDir, '周滚动预告');
      results['周滚动预告'] = weeklyFile;
      console.log(`[STEP 2] 周滚动预告已导出: ${weeklyFile}`);
    } catch (err) {
      console.error(`[STEP 2] 周滚动预告导出失败: ${err.message}`);
      results['周滚动预告'] = null;
      // 关闭可能残留的弹窗
      await dismissDialog(page);
    }

    // ====== Step 3: 导出日消耗预告 ======
    console.log('[STEP 3] 正在导出日消耗预告...');
    try {
      await navigateToMenu(page, '日消耗预告');
      const dailyFile = await exportData(page, outputDir, '日消耗预告');
      results['日消耗预告'] = dailyFile;
      console.log(`[STEP 3] 日消耗预告已导出: ${dailyFile}`);
    } catch (err) {
      console.error(`[STEP 3] 日消耗预告导出失败: ${err.message}`);
      results['日消耗预告'] = null;
      await dismissDialog(page);
    }

    console.log('\n========== 导出结果 ==========');
    for (const [key, val] of Object.entries(results)) {
      console.log(`${key}: ${val || '(导出失败)'}`);
    }

  } catch (err) {
    console.error('[ERROR]', err.message);
    const screenshotPath = path.join(outputDir, 'error_screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    console.error(`[ERROR] 错误截图已保存: ${screenshotPath}`);
    throw err;
  } finally {
    await browser.close();
  }
}

// ============ 登录 ============
async function login(page) {
  await page.goto(CONFIG.url, { waitUntil: 'load', timeout: CONFIG.timeouts.gotoLoad });
  
  // SPA 应用初次加载需要更长时间，等待登录表单出现
  console.log('[STEP 1] 等待页面资源加载...');
  await page.waitForSelector('.el-input__inner', { timeout: CONFIG.timeouts.login });
  
  // 填写账号 - 使用 Vue 兼容的输入方式
  const inputs = await page.locator('.el-input__inner');
  const usernameInput = inputs.nth(0);
  const passwordInput = inputs.nth(1);
  
  // 清空并输入账号
  await usernameInput.click();
  await usernameInput.fill('');
  await usernameInput.type(CONFIG.username, { delay: 50 });
  
  // 清空并输入密码
  await passwordInput.click();
  await passwordInput.fill('');
  await passwordInput.type(CONFIG.password, { delay: 50 });
  
  // 点击登录按钮
  await page.click('.el-button');
  
  // 等待登录完成 - 检测首页特征元素
  await page.waitForSelector('.el-menu', { timeout: CONFIG.timeouts.login });
  await page.waitForTimeout(CONFIG.timeouts.pageLoad);
  
  console.log('[STEP 1] 登录成功');
}

// ============ 通过菜单导航 ============
async function navigateToMenu(page, menuName) {
  // 先确保"预告管理"菜单是展开的
  const submenuTitles = await page.locator('.el-submenu__title');
  const subCount = await submenuTitles.count();
  
  let forecastMenuClicked = false;
  for (let i = 0; i < subCount; i++) {
    const text = await submenuTitles.nth(i).textContent();
    if (text && text.includes('预告管理')) {
      // 检查是否已经展开
      const isExpanded = await submenuTitles.nth(i).evaluate(el => {
        const parent = el.closest('.el-submenu');
        return parent && parent.classList.contains('is-opened');
      });
      if (!isExpanded) {
        await submenuTitles.nth(i).click();
      }
      forecastMenuClicked = true;
      break;
    }
  }
  
  if (!forecastMenuClicked) {
    throw new Error('未找到"预告管理"菜单');
  }
  
  // 等待子菜单展开
  await page.waitForTimeout(CONFIG.timeouts.menuExpand);
  
  // 点击目标子菜单项
  const subMenuItems = await page.locator('.el-menu-item');
  const menuItemCount = await subMenuItems.count();
  
  let subMenuClicked = false;
  for (let i = 0; i < menuItemCount; i++) {
    const text = await subMenuItems.nth(i).textContent();
    if (text && text.includes(menuName)) {
      await subMenuItems.nth(i).click();
      subMenuClicked = true;
      break;
    }
  }
  
  if (!subMenuClicked) {
    throw new Error(`未找到"${menuName}"子菜单`);
  }
  
  // 等待页面加载
  await page.waitForTimeout(CONFIG.timeouts.pageLoad);
  await page.waitForLoadState('domcontentloaded', { timeout: CONFIG.timeouts.navigation }).catch(() => {});
  
  // 额外等待表格渲染
  await page.waitForTimeout(2000);
  
  console.log(`[NAV] 已导航到: ${menuName}`);
}

// ============ 关闭 Element UI 对话框 ============
async function dismissDialog(page) {
  try {
    const dialog = page.locator('.el-message-box__wrapper');
    if (await dialog.isVisible({ timeout: 1000 }).catch(() => false)) {
      // 尝试点击"确定"按钮
      const confirmBtn = dialog.locator('.el-button--primary');
      if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
        return;
      }
      // 尝试点击关闭按钮
      const closeBtn = dialog.locator('.el-message-box__close');
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(500);
        return;
      }
      // 通过 ESC 关闭
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // 忽略关闭弹窗的错误
  }
}

// ============ 导出数据 ============
async function exportData(page, outputDir, label) {
  // 查找"导出"按钮
  const exportBtn = page.locator('button:has-text("导出")');
  
  // 等待导出按钮可用
  await exportBtn.waitFor({ state: 'visible', timeout: CONFIG.timeouts.navigation });
  
  // 点击导出按钮 - 可能弹出确认对话框
  await exportBtn.click();
  await page.waitForTimeout(1000);
  
  // 处理确认对话框 - 点击"确定"按钮
  const confirmDialog = page.locator('.el-message-box__wrapper');
  if (await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('[EXPORT] 检测到确认对话框，点击确定...');
    const confirmBtn = confirmDialog.locator('.el-button--primary');
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    
    // 点击确定的同时监听下载事件
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: CONFIG.timeouts.download }).catch(() => null),
      confirmBtn.click(),
    ]);
    
    if (download) {
      // 生成文件名（含时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const originalName = download.suggestedFilename();
      const ext = path.extname(originalName) || '.xlsx';
      const safeLabel = label.replace(/[\/\\:*?"<>|]/g, '_');
      const fileName = `${safeLabel}_${timestamp}${ext}`;
      const filePath = path.join(outputDir, fileName);
      await download.saveAs(filePath);
      return filePath;
    }
  } else {
    // 没有确认对话框，直接监听下载
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: CONFIG.timeouts.download }).catch(() => null),
      exportBtn.click(),
    ]);
    
    if (download) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const originalName = download.suggestedFilename();
      const ext = path.extname(originalName) || '.xlsx';
      const safeLabel = label.replace(/[\/\\:*?"<>|]/g, '_');
      const fileName = `${safeLabel}_${timestamp}${ext}`;
      const filePath = path.join(outputDir, fileName);
      await download.saveAs(filePath);
      return filePath;
    }
  }
  
  // 方式2: 拦截网络请求获取导出文件
  console.log('[EXPORT] 浏览器下载事件未触发，尝试API拦截方式...');
  let exportResponseData = null;
  
  const responseHandler = async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (
      (contentType.includes('application/vnd') || 
       contentType.includes('application/octet-stream') ||
       contentType.includes('spreadsheet') ||
       url.includes('export') || 
       url.includes('download') ||
       url.includes('Export') ||
       url.includes('excel')) &&
      response.status() === 200
    ) {
      try {
        const body = await response.body();
        if (body.length > 100) {
          exportResponseData = body;
          console.log(`[EXPORT] 拦截到导出响应: ${url} (${body.length} bytes, ${contentType})`);
        }
      } catch (e) {}
    }
  };
  
  page.on('response', responseHandler);
  
  // 如果还没点击导出，再次点击
  try {
    await exportBtn.click();
    await page.waitForTimeout(1000);
    
    // 检查确认对话框
    if (await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
      const confirmBtn2 = confirmDialog.locator('.el-button--primary');
      await confirmBtn2.click();
    }
  } catch (e) {}
  
  // 等待响应数据
  const maxWait = CONFIG.timeouts.download;
  const startTime = Date.now();
  while (!exportResponseData && (Date.now() - startTime) < maxWait) {
    await page.waitForTimeout(1000);
  }
  
  page.off('response', responseHandler);
  
  if (exportResponseData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeLabel = label.replace(/[\/\\:*?"<>|]/g, '_');
    const fileName = `${safeLabel}_${timestamp}.xlsx`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, exportResponseData);
    return filePath;
  }
  
  // 方式3: 检查浏览器默认下载目录
  console.log('[EXPORT] API拦截未获取到数据，检查下载目录...');
  await page.waitForTimeout(5000);
  
  const downloadDirs = [
    path.join(process.env.USERPROFILE || '', 'Downloads'),
    path.join(process.env.USERPROFILE || '', '下载'),
    outputDir,
  ];
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  for (const dir of downloadDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => 
      f.endsWith('.xlsx') || f.endsWith('.xls') || f.endsWith('.csv')
    ).sort((a, b) => {
      const statA = fs.statSync(path.join(dir, a));
      const statB = fs.statSync(path.join(dir, b));
      return statB.mtimeMs - statA.mtimeMs;
    });
    
    for (const file of files) {
      const srcPath = path.join(dir, file);
      const stat = fs.statSync(srcPath);
      if (Date.now() - stat.mtimeMs < 60000) {
        const safeLabel = label.replace(/[\/\\:*?"<>|]/g, '_');
        const fileName = `${safeLabel}_${timestamp}${path.extname(file) || '.xlsx'}`;
        const destPath = path.join(outputDir, fileName);
        fs.copyFileSync(srcPath, destPath);
        return destPath;
      }
    }
  }
  
  throw new Error(`导出"${label}"失败：无法获取下载文件。`);
}

// ============ 运行 ============
main().catch(err => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
