import { loadDraft, renameDraft, copyDraftColors } from './draft-manager.js';

// 显示通知
export function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = 'notification';

    if (type === 'error') {
        notification.style.background = '#ea4335';
    } else {
        notification.style.background = '#34a853';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 渲染草稿UI
export function renderDraftUI() {
    const draftsGrid = document.getElementById('draftsGrid');
    if (!draftsGrid) return;

    draftsGrid.innerHTML = '';

    const drafts = getDrafts();
    const currentDraftId = getCurrentDraftId();

    drafts.forEach(draft => {
        const draftCard = document.createElement('div');
        draftCard.className = `draft-card ${draft.colors ? '' : 'empty'}`;
        draftCard.dataset.draftId = draft.id;

        if (currentDraftId === draft.id) {
            draftCard.classList.add('active');
        }

        if (draft.colors) {
            // 有内容的草稿卡片
            const timeStr = draft.timestamp ? formatTime(draft.timestamp) : '未保存';

            draftCard.innerHTML = `
                <div class="draft-header">
                    <div class="draft-name" title="${draft.name}">${draft.name}</div>
                    <div class="draft-id">#${draft.id}</div>
                </div>
                <div class="draft-timestamp">${timeStr}</div>
                <div class="draft-actions">
                    <button class="draft-action-btn load" data-draft-id="${draft.id}">加载</button>
                    <button class="draft-action-btn delete" data-draft-id="${draft.id}">删除</button>
                </div>
            `;
        } else {
            // 空草稿卡片
            draftCard.innerHTML = `
                <div class="draft-empty-state">
                    <div>空槽位</div>
                    <div class="draft-id">#${draft.id}</div>
                </div>
            `;
        }

        draftsGrid.appendChild(draftCard);
    });

    // 绑定草稿卡片事件
    bindDraftEvents();
    // 增强UI交互
    enhanceDraftUIInteractions();
}

// 绑定草稿事件
function bindDraftEvents() {
    // 加载草稿按钮
    document.querySelectorAll('.draft-action-btn.load').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const draftId = parseInt(e.target.dataset.draftId);
            loadDraft(draftId);
        });
    });

    // 删除草稿按钮
    document.querySelectorAll('.draft-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const draftId = parseInt(e.target.dataset.draftId);
            deleteDraftWithConfirmation(draftId);
        });
    });

    // 草稿卡片点击事件
    document.querySelectorAll('.draft-card:not(.empty)').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('draft-action-btn')) {
                const draftId = parseInt(card.querySelector('.draft-action-btn.load').dataset.draftId);
                loadDraft(draftId);
            }
        });
    });
}

// 增强草稿UI交互
export function enhanceDraftUIInteractions() {
    const draftCards = document.querySelectorAll('.draft-card');

    draftCards.forEach(card => {
        // 添加悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });

        // 添加快捷键提示
        const draftId = card.dataset.draftId;
        if (draftId) {
            card.title = `快捷键: Ctrl+${draftId} (加载) | Alt+${draftId} (从服务器加载)`;
        }

        // 添加右键菜单
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showDraftContextMenu(e, card);
        });
    });

    // 添加快捷键支持
    document.addEventListener('keydown', handleDraftShortcuts);
}

// 草稿右键菜单
function showDraftContextMenu(event, card) {
    const draftId = parseInt(card.dataset.draftId);
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.style.background = 'white';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    menu.style.zIndex = '1000';
    menu.style.minWidth = '160px';

    const menuItems = [
        { label: '从本地加载', action: () => loadDraft(draftId) },
        { label: '从服务器加载', action: () => switchDraft(draftId, 'server') },
        { label: '同步到服务器', action: () => syncDraftToServer(draftId) },
        { label: '重命名', action: () => renameDraft(draftId) },
        { label: '复制颜色值', action: () => copyDraftColors(draftId) }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        menuItem.textContent = item.label;
        menuItem.style.padding = '8px 12px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.borderBottom = '1px solid #eee';

        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#f5f5f5';
        });

        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'white';
        });

        menuItem.addEventListener('click', () => {
            item.action();
            menu.remove();
        });

        menu.appendChild(menuItem);
    });

    // 添加关闭菜单的事件
    const closeMenu = () => {
        menu.remove();
        document.removeEventListener('click', closeMenu);
    };

    document.body.appendChild(menu);
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
}

// 草稿快捷键处理
function handleDraftShortcuts(event) {
    // Ctrl+数字键 (1-6) 加载本地草稿
    if (event.ctrlKey && event.key >= '1' && event.key <= '6') {
        event.preventDefault();
        const draftId = parseInt(event.key);
        loadDraft(draftId);
    }

    // Alt+数字键 (1-6) 从服务器加载草稿
    if (event.altKey && event.key >= '1' && event.key <= '6') {
        event.preventDefault();
        const draftId = parseInt(event.key);
        switchDraft(draftId, 'server');
    }
}

// 初始化草稿UI增强
export function initDraftUIEnhancements() {
    // 监听草稿UI渲染完成
    const observer = new MutationObserver(() => {
        enhanceDraftUIInteractions();
    });

    const draftsGrid = document.getElementById('draftsGrid');
    if (draftsGrid) {
        observer.observe(draftsGrid, { childList: true, subtree: true });
    }

    // 初始增强
    enhanceDraftUIInteractions();
}

// 初始化服务器状态
export async function initServerStatus() {
    const isServerOnline = await checkServerStatus();
    const serverControls = document.querySelector('.server-controls');

    if (serverControls) {
        if (isServerOnline) {
            serverControls.style.opacity = '1';
            showNotification('服务器连接正常', 'success');
        } else {
            serverControls.style.opacity = '0.5';
            serverControls.title = '服务器未连接，请确保 draft-server.js 正在运行';
            showNotification('服务器未连接，草稿将仅保存在本地', 'error');
        }
    }
}

// 辅助函数：从 state.js 导入
import { getDrafts, getCurrentDraftId } from './state.js';
import { deleteDraftWithConfirmation, formatTime } from './draft-manager.js';
import { checkServerStatus } from './server-api.js';