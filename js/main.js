import { loadDraftsFromStorage, saveDraft } from './draft-manager.js';
import { renderColorCards } from './color-renderer.js';
import { exportColors, copyToClipboard } from './export-utils.js';
import { backupToServer, restoreFromServer, clearServerDrafts, checkServerStatus } from './server-api.js';
import { renderDraftUI, initDraftUIEnhancements, initServerStatus, showNotification } from './ui-enhancements.js';
import { resetToDefaultColors, getCurrentColors, setCurrentColors, getDomElements } from './state.js';

// 设置事件监听器
export function setupEventListeners() {
    const domElements = getDomElements();

    // 重置按钮
    if (domElements.resetBtn) {
        domElements.resetBtn.addEventListener('click', resetColors);
    }

    // 导出按钮
    if (domElements.exportBtn) {
        domElements.exportBtn.addEventListener('click', exportColors);
    }

    // 草稿保存按钮
    if (domElements.saveDraftBtn) {
        domElements.saveDraftBtn.addEventListener('click', handleSaveDraft);
    }

    // 草稿名称输入框 - 支持回车保存
    if (domElements.draftNameInput) {
        domElements.draftNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSaveDraft();
            }
        });
    }

    // 服务器控制按钮
    if (domElements.backupBtn) {
        domElements.backupBtn.addEventListener('click', backupToServer);
    }

    if (domElements.restoreBtn) {
        domElements.restoreBtn.addEventListener('click', restoreFromServer);
    }

    if (domElements.clearServerBtn) {
        domElements.clearServerBtn.addEventListener('click', clearServerDrafts);
    }

    // 全局复制到剪贴板函数
    window.copyToClipboard = copyToClipboard;
}

// 处理保存草稿
function handleSaveDraft() {
    const domElements = getDomElements();
    const draftName = domElements.draftNameInput ? domElements.draftNameInput.value : '';
    if (saveDraft(draftName)) {
        // 清空输入框
        if (domElements.draftNameInput) {
            domElements.draftNameInput.value = '';
        }
        // 更新UI
        renderDraftUI();
    }
}

// 重置颜色
function resetColors() {
    if (confirm('确定要重置所有颜色为默认值吗？')) {
        resetToDefaultColors();
        renderColorCards();
        renderDraftUI(); // 更新草稿UI
        showNotification('颜色已重置为默认值');
    }
}

// 初始化页面
export async function init() {
    try {
        loadDraftsFromStorage();
        renderColorCards();
        setupEventListeners();
        renderDraftUI();
        initDraftUIEnhancements(); // 初始化草稿UI增强

        // 尝试初始化服务器状态，但不让失败阻止页面渲染
        try {
            await initServerStatus();
        } catch (serverError) {
            console.warn('服务器状态初始化失败:', serverError);
            // 继续执行，页面仍然可以工作
        }
    } catch (error) {
        console.error('页面初始化失败:', error);
        // 显示错误信息给用户
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'background: #ffebee; color: #c62828; padding: 15px; margin: 20px; border-radius: 4px; border: 1px solid #ffcdd2;';
        errorMsg.textContent = `页面初始化错误: ${error.message}`;
        document.body.prepend(errorMsg);
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);