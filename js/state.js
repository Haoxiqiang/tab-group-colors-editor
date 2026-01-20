import { defaultColors, MAX_DRAFTS } from './constants.js';

// 当前颜色状态
let currentColors = JSON.parse(JSON.stringify(defaultColors));

// 草稿管理
let drafts = Array(MAX_DRAFTS).fill(null).map((_, index) => ({
    id: index + 1,
    name: `草稿 ${index + 1}`,
    colors: null,
    timestamp: null
}));

let currentDraftId = null;

// DOM 元素引用 - 延迟获取
export function getDomElements() {
    return {
        colorsGrid: document.getElementById('colorsGrid'),
        resetBtn: document.getElementById('resetBtn'),
        exportBtn: document.getElementById('exportBtn'),
        exportSection: document.getElementById('exportSection'),
        exportContent: document.getElementById('exportContent'),
        notification: document.getElementById('notification'),
        saveDraftBtn: document.getElementById('saveDraftBtn'),
        draftNameInput: document.getElementById('draftNameInput'),
        backupBtn: document.getElementById('backupBtn'),
        restoreBtn: document.getElementById('restoreBtn'),
        clearServerBtn: document.getElementById('clearServerBtn'),
        draftsGrid: document.getElementById('draftsGrid')
    };
}

// 获取当前颜色
export function getCurrentColors() {
    return { ...currentColors };
}

// 设置当前颜色
export function setCurrentColors(colors) {
    currentColors = JSON.parse(JSON.stringify(colors));
}

// 重置为默认颜色
export function resetToDefaultColors() {
    currentColors = JSON.parse(JSON.stringify(defaultColors));
    currentDraftId = null;
}

// 获取草稿列表
export function getDrafts() {
    return [...drafts];
}

// 获取指定草稿
export function getDraft(draftId) {
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    return draftIndex !== -1 ? { ...drafts[draftIndex] } : null;
}

// 设置草稿
export function setDraft(draftId, draftData) {
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    if (draftIndex !== -1) {
        drafts[draftIndex] = { ...drafts[draftIndex], ...draftData };
        return true;
    }
    return false;
}

// 删除草稿
export function deleteDraft(draftId) {
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    if (draftIndex !== -1) {
        drafts[draftIndex] = {
            id: draftId,
            name: `草稿 ${draftId}`,
            colors: null,
            timestamp: null
        };

        // 如果删除的是当前加载的草稿，清除当前草稿ID
        if (currentDraftId === draftId) {
            currentDraftId = null;
        }
        return true;
    }
    return false;
}

// 获取当前草稿ID
export function getCurrentDraftId() {
    return currentDraftId;
}

// 设置当前草稿ID
export function setCurrentDraftId(draftId) {
    currentDraftId = draftId;
}

// 获取第一个空草稿槽位
export function getFirstEmptyDraftSlot() {
    return drafts.findIndex(draft => !draft.colors);
}

// 验证颜色值（支持6位和3位简写）
export function isValidColor(color) {
    return /^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(color);
}