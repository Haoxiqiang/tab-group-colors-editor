const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DRAFTS_FILE = path.join(__dirname, 'drafts.json');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // 提供静态文件

// 确保草稿文件存在
function ensureDraftsFile() {
    if (!fs.existsSync(DRAFTS_FILE)) {
        fs.writeFileSync(DRAFTS_FILE, JSON.stringify({ drafts: [] }, null, 2));
    }
}

// 获取所有草稿
app.get('/api/drafts', (req, res) => {
    try {
        ensureDraftsFile();
        const data = JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));
        res.json(data);
    } catch (error) {
        console.error('获取草稿失败:', error);
        res.status(500).json({ error: '获取草稿失败' });
    }
});

// 保存草稿
app.post('/api/drafts', (req, res) => {
    try {
        const { drafts } = req.body;

        if (!drafts || !Array.isArray(drafts)) {
            return res.status(400).json({ error: '无效的草稿数据' });
        }

        // 限制最多6个草稿
        const limitedDrafts = drafts.slice(0, 6);

        const data = {
            drafts: limitedDrafts,
            lastUpdated: new Date().toISOString()
        };

        fs.writeFileSync(DRAFTS_FILE, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            message: `已保存 ${limitedDrafts.length} 个草稿`,
            count: limitedDrafts.length
        });
    } catch (error) {
        console.error('保存草稿失败:', error);
        res.status(500).json({ error: '保存草稿失败' });
    }
});

// 备份草稿到文件
app.get('/api/drafts/backup', (req, res) => {
    try {
        ensureDraftsFile();
        const data = JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));

        const backupFile = `drafts-backup-${Date.now()}.json`;
        const backupPath = path.join(__dirname, backupFile);

        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

        res.download(backupPath, backupFile, (err) => {
            if (err) {
                console.error('下载备份文件失败:', err);
            }
            // 下载完成后删除临时文件
            setTimeout(() => {
                if (fs.existsSync(backupPath)) {
                    fs.unlinkSync(backupPath);
                }
            }, 1000);
        });
    } catch (error) {
        console.error('备份草稿失败:', error);
        res.status(500).json({ error: '备份草稿失败' });
    }
});

// 从文件恢复草稿
app.post('/api/drafts/restore', (req, res) => {
    try {
        const { drafts } = req.body;

        if (!drafts || !Array.isArray(drafts)) {
            return res.status(400).json({ error: '无效的恢复数据' });
        }

        const data = {
            drafts: drafts.slice(0, 6),
            restoredAt: new Date().toISOString()
        };

        fs.writeFileSync(DRAFTS_FILE, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            message: `已恢复 ${data.drafts.length} 个草稿`,
            count: data.drafts.length
        });
    } catch (error) {
        console.error('恢复草稿失败:', error);
        res.status(500).json({ error: '恢复草稿失败' });
    }
});

// 清空所有草稿
app.delete('/api/drafts', (req, res) => {
    try {
        const data = {
            drafts: [],
            clearedAt: new Date().toISOString()
        };

        fs.writeFileSync(DRAFTS_FILE, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            message: '所有草稿已清空'
        });
    } catch (error) {
        console.error('清空草稿失败:', error);
        res.status(500).json({ error: '清空草稿失败' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Tab Group Color Drafts API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`草稿服务器运行在 http://localhost:${PORT}`);
    console.log(`API端点:`);
    console.log(`  GET  /api/drafts        - 获取所有草稿`);
    console.log(`  POST /api/drafts        - 保存草稿`);
    console.log(`  GET  /api/drafts/backup - 备份草稿到文件`);
    console.log(`  POST /api/drafts/restore - 从文件恢复草稿`);
    console.log(`  DELETE /api/drafts      - 清空所有草稿`);
    console.log(`  GET  /api/health        - 健康检查`);
    console.log(`\n静态文件服务已启用，可直接访问 index.html`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    process.exit(0);
});