import { SERVER_URL } from './constants.js';
import { getDrafts, setDraft } from './state.js';
import { showNotification, renderDraftUI } from './ui-enhancements.js';
import { saveDraftsToStorage } from './draft-manager.js';
import { renderColorCards } from './color-renderer.js';

// 从服务器加载草稿
export async function loadDraftFromServer(draftId) {
    try {
        const response = await fetch(`${SERVER_URL}/drafts`);

        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        const result = await response.json();

        if (!result.drafts || result.drafts.length === 0) {
            showNotification('服务器上没有草稿数据', 'error');
            return null;
        }

        // 查找特定草稿
        const serverDraft = result.drafts.find(draft => draft.id === draftId);

        if (!serverDraft) {
            showNotification(`未找到ID为 ${draftId} 的草稿`, 'error');
            return null;
        }

        return serverDraft;
    } catch (error) {
        console.error('加载草稿失败:', error);
        showNotification(`加载草稿失败: ${error.message}`, 'error');
        return null;
    }
}

// 在本地和服务器草稿之间切换
export async function switchDraft(draftId, source = 'local') {
    try {
        if (source === 'server') {
            // 从服务器加载
            const draftData = await loadDraftFromServer(draftId);
            if (!draftData) return false;

            // 更新本地草稿
            const success = setDraft(draftId, draftData);
            if (success) {
                showNotification(`已从服务器加载草稿: ${draftData.name || '未命名草稿'}`);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('切换草稿失败:', error);
        showNotification(`切换草稿失败: ${error.message}`, 'error');
        return false;
    }
}

// 同步草稿到服务器
export async function syncDraftToServer(draftId) {
    try {
        const drafts = getDrafts();
        const draftIndex = drafts.findIndex(d => d.id === draftId);
        if (draftIndex === -1 || !drafts[draftIndex].colors) {
            showNotification('草稿不存在或为空', 'error');
            return false;
        }

        const draft = drafts[draftIndex];
        const response = await fetch(`${SERVER_URL}/drafts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                drafts: [{
                    id: draft.id,
                    name: draft.name,
                    colors: draft.colors,
                    timestamp: draft.timestamp
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        const result = await response.json();
        showNotification(`草稿已同步到服务器: ${draft.name || '未命名草稿'}`);
        return true;
    } catch (error) {
        console.error('同步草稿失败:', error);
        showNotification(`同步草稿失败: ${error.message}`, 'error');
        return false;
    }
}

// 备份到服务器
export async function backupToServer() {
    try {
        const drafts = getDrafts();
        const nonEmptyDrafts = drafts.filter(draft => draft.colors);

        if (nonEmptyDrafts.length === 0) {
            showNotification('没有可备份的草稿', 'error');
            return;
        }

        const response = await fetch(`${SERVER_URL}/drafts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                drafts: nonEmptyDrafts.map(draft => ({
                    id: draft.id,
                    name: draft.name,
                    colors: draft.colors,
                    timestamp: draft.timestamp
                }))
            })
        });

        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        const result = await response.json();
        showNotification(`已备份 ${result.count} 个草稿到服务器`);
    } catch (error) {
        console.error('备份失败:', error);
        showNotification(`备份失败: ${error.message}`, 'error');
    }
}

// 从服务器恢复
export async function restoreFromServer() {
    try {
        if (!confirm('从服务器恢复将覆盖当前的草稿数据。确定要继续吗？')) {
            return;
        }

        const response = await fetch(`${SERVER_URL}/drafts`);

        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        const result = await response.json();

        if (!result.drafts || result.drafts.length === 0) {
            showNotification('服务器上没有草稿数据', 'error');
            return;
        }

        // 更新本地草稿数据
        const drafts = getDrafts();
        result.drafts.forEach((serverDraft, index) => {
            if (index < drafts.length) {
                setDraft(serverDraft.id, serverDraft);
            }
        });

        // 保存到本地存储
        saveDraftsToStorage();

        // 更新UI
        renderDraftUI();
        renderColorCards();

        showNotification(`已从服务器恢复 ${result.drafts.length} 个草稿`);
    } catch (error) {
        console.error('恢复失败:', error);
        showNotification(`恢复失败: ${error.message}`, 'error');
    }
}

// 清空服务器草稿
export async function clearServerDrafts() {
    try {
        if (!confirm('确定要清空服务器上的所有草稿吗？此操作不可撤销。')) {
            return;
        }

        const response = await fetch(`${SERVER_URL}/drafts`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        const result = await response.json();
        showNotification(result.message);
    } catch (error) {
        console.error('清空失败:', error);
        showNotification(`清空失败: ${error.message}`, 'error');
    }
}

// 检查服务器状态
export async function checkServerStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}