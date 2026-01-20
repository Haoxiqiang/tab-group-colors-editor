import { getDrafts, setDraft, deleteDraft, getCurrentDraftId, setCurrentDraftId, getFirstEmptyDraftSlot, getCurrentColors, setCurrentColors } from './state.js';
import { showNotification, renderDraftUI } from './ui-enhancements.js';
import { renderColorCards } from './color-renderer.js';

// 从LocalStorage加载草稿
export function loadDraftsFromStorage() {
    try {
        const savedDrafts = localStorage.getItem('tabGroupColorDrafts');
        if (savedDrafts) {
            const parsedDrafts = JSON.parse(savedDrafts);
            const drafts = getDrafts();

            // 合并保存的草稿数据
            parsedDrafts.forEach((savedDraft, index) => {
                if (index < drafts.length && savedDraft) {
                    setDraft(savedDraft.id, savedDraft);
                }
            });
        }
    } catch (error) {
        console.error('加载草稿失败:', error);
        showNotification('加载草稿失败', 'error');
    }
}

// 保存草稿到LocalStorage
export function saveDraftsToStorage() {
    try {
        const drafts = getDrafts();
        const draftsToSave = drafts.map(draft => ({
            id: draft.id,
            name: draft.name,
            colors: draft.colors,
            timestamp: draft.timestamp
        }));
        localStorage.setItem('tabGroupColorDrafts', JSON.stringify(draftsToSave));
    } catch (error) {
        console.error('保存草稿失败:', error);
        showNotification('保存草稿失败', 'error');
    }
}

// 格式化时间
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 保存草稿
export function saveDraft(draftName) {
    const name = draftName.trim() || `草稿 ${new Date().toLocaleTimeString('zh-CN')}`;

    // 查找第一个空槽位或让用户选择覆盖
    let targetIndex = getFirstEmptyDraftSlot();

    if (targetIndex === -1) {
        // 没有空槽位，让用户选择覆盖
        if (!confirm('所有草稿槽位已满。是否覆盖第一个草稿？')) {
            return false;
        }
        targetIndex = 0;
    }

    // 保存草稿
    const success = setDraft(targetIndex + 1, {
        name: name,
        colors: JSON.parse(JSON.stringify(getCurrentColors())),
        timestamp: Date.now()
    });

    if (success) {
        setCurrentDraftId(targetIndex + 1);
        saveDraftsToStorage();
        showNotification(`草稿已保存到槽位 #${targetIndex + 1}`);

        // 更新UI
        renderDraftUI();

        return true;
    }

    return false;
}

// 加载草稿
export function loadDraft(draftId) {
    const drafts = getDrafts();
    const draftIndex = drafts.findIndex(d => d.id === draftId);

    if (draftIndex === -1 || !drafts[draftIndex].colors) {
        showNotification('草稿不存在或为空', 'error');
        return false;
    }

    // 更新当前颜色
    setCurrentColors(drafts[draftIndex].colors);
    setCurrentDraftId(draftId);

    // 更新UI
    renderColorCards();

    showNotification(`已加载草稿: ${drafts[draftIndex].name}`);
    return true;
}

// 删除草稿
export function deleteDraftWithConfirmation(draftId) {
    const drafts = getDrafts();
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    if (draftIndex === -1) return false;

    if (!confirm(`确定要删除草稿 "${drafts[draftIndex].name}" 吗？`)) {
        return false;
    }

    const success = deleteDraft(draftId);
    if (success) {
        saveDraftsToStorage();
        showNotification('草稿已删除');

        // 更新UI
        renderDraftUI();

        return true;
    }

    return false;
}

// 重命名草稿
export function renameDraft(draftId) {
    const drafts = getDrafts();
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    if (draftIndex === -1) return false;

    const newName = prompt('请输入新的草稿名称:', drafts[draftIndex].name || '');
    if (newName !== null && newName.trim() !== '') {
        const success = setDraft(draftId, { name: newName.trim() });
        if (success) {
            saveDraftsToStorage();
            showNotification('草稿已重命名');

            // 更新UI
            renderDraftUI();

            return true;
        }
    }

    return false;
}

// 复制草稿颜色值
export function copyDraftColors(draftId) {
    const drafts = getDrafts();
    const draftIndex = drafts.findIndex(d => d.id === draftId);

    if (draftIndex === -1 || !drafts[draftIndex].colors) {
        showNotification('草稿不存在或为空', 'error');
        return;
    }

    const colors = drafts[draftIndex].colors;
    const colorText = Object.entries(colors)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    navigator.clipboard.writeText(colorText)
        .then(() => showNotification('颜色值已复制到剪贴板'))
        .catch(err => showNotification('复制失败: ' + err.message, 'error'));
}