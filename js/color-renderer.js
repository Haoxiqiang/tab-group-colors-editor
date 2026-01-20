import { colorGroups } from './constants.js';
import { getCurrentColors, setCurrentColors, isValidColor } from './state.js';
import { showNotification } from './ui-enhancements.js';

// 渲染颜色组卡片
export function renderColorCards() {
    const colorsGrid = document.getElementById('colorsGrid');
    if (!colorsGrid) return;

    colorsGrid.innerHTML = '';

    const currentColors = getCurrentColors();

    colorGroups.forEach(group => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.innerHTML = `
            <div class="color-header">
                <span class="color-name">${group.label}</span>
            </div>

            <!-- 卡片样式预览 -->
            <div class="card-preview-container">
                <div class="card-preview-label">Tab Group 卡片预览</div>
                <div class="tab-group-card-preview" style="background-color: ${currentColors[group.colors.card]}; color: ${currentColors[group.colors.text]};">
                    <div class="tab-group-card-header">
                        <div class="tab-group-color-dot" style="background-color: ${currentColors[group.colors.picker]};" data-color="${group.colors.picker}"></div>
                        <div class="tab-group-title">${group.label} 标签组</div>
                        <div class="tab-group-count">3</div>
                    </div>
                    <div class="tab-group-thumbnails">
                        <div class="tab-group-thumbnail" style="background-color: ${currentColors[group.colors.placeholder]};"></div>
                        <div class="tab-group-thumbnail" style="background-color: ${currentColors[group.colors.placeholder]};"></div>
                    </div>
                    <div class="tab-group-actions">
                        <button class="tab-group-action-btn">⋮</button>
                    </div>
                </div>
            </div>

            <!-- 颜色控制 -->
            <div class="color-group-preview">
                <div class="preview-item">
                    <div class="preview-label">颜色选择器</div>
                    <div class="preview-swatch" style="background-color: ${currentColors[group.colors.picker]};"
                         data-color="${group.colors.picker}"></div>
                    <div class="preview-controls">
                        <input type="text" class="color-input" value="${currentColors[group.colors.picker]}"
                               data-color="${group.colors.picker}" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$">
                        <input type="color" class="color-picker" value="${currentColors[group.colors.picker]}"
                               data-color="${group.colors.picker}">
                    </div>
                </div>
                <div class="preview-item">
                    <div class="preview-label">卡片背景</div>
                    <div class="preview-swatch" style="background-color: ${currentColors[group.colors.card]};"
                         data-color="${group.colors.card}"></div>
                    <div class="preview-controls">
                        <input type="text" class="color-input" value="${currentColors[group.colors.card]}"
                               data-color="${group.colors.card}" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$">
                        <input type="color" class="color-picker" value="${currentColors[group.colors.card]}"
                               data-color="${group.colors.card}">
                    </div>
                </div>
                <div class="preview-item">
                    <div class="preview-label">卡片文本</div>
                    <div class="preview-swatch" style="background-color: ${currentColors[group.colors.text]};"
                         data-color="${group.colors.text}"></div>
                    <div class="preview-controls">
                        <input type="text" class="color-input" value="${currentColors[group.colors.text]}"
                               data-color="${group.colors.text}" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$">
                        <input type="color" class="color-picker" value="${currentColors[group.colors.text]}"
                               data-color="${group.colors.text}">
                    </div>
                </div>
                <div class="preview-item">
                    <div class="preview-label">占位符背景</div>
                    <div class="preview-swatch" style="background-color: ${currentColors[group.colors.placeholder]};"
                         data-color="${group.colors.placeholder}"></div>
                    <div class="preview-controls">
                        <input type="text" class="color-input" value="${currentColors[group.colors.placeholder]}"
                               data-color="${group.colors.placeholder}" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$">
                        <input type="color" class="color-picker" value="${currentColors[group.colors.placeholder]}"
                               data-color="${group.colors.placeholder}">
                    </div>
                </div>
            </div>
        `;

        colorsGrid.appendChild(card);
    });

    // 重新绑定事件
    bindColorEvents();
}

// 绑定颜色相关事件
function bindColorEvents() {
    // 颜色输入框事件
    document.querySelectorAll('.color-input').forEach(input => {
        input.addEventListener('input', handleColorInput);
        input.addEventListener('change', handleColorChange);
        input.addEventListener('keydown', handleColorKeydown);
    });

    // 颜色选择器事件
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.addEventListener('input', handleColorPickerInput);
    });

    // 颜色色块点击事件
    document.querySelectorAll('.preview-swatch').forEach(swatch => {
        swatch.addEventListener('click', handleSwatchClick);
    });

    // tab-group-color-dot 点击事件 - 打开颜色选择器
    document.querySelectorAll('.tab-group-color-dot').forEach(dot => {
        dot.addEventListener('click', handleColorDotClick);
    });
}

// 颜色输入框输入事件
function handleColorInput(e) {
    const colorName = e.target.dataset.color;
    let value = e.target.value.toUpperCase();

    // 自动添加 # 前缀
    if (value && !value.startsWith('#')) {
        value = '#' + value;
        e.target.value = value;
    }

    // 支持3位简写颜色扩展为6位
    if (value.length === 4 && value.startsWith('#')) {
        value = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
        e.target.value = value;
    }

    if (isValidColor(value)) {
        const currentColors = getCurrentColors();
        currentColors[colorName] = value;
        setCurrentColors(currentColors);
        updateColorSwatch(colorName, value);
        updateColorPicker(colorName, value);
    }
}

// 颜色输入框变化事件
function handleColorChange(e) {
    const colorName = e.target.dataset.color;
    const value = e.target.value.toUpperCase();

    if (!isValidColor(value)) {
        const currentColors = getCurrentColors();
        e.target.value = currentColors[colorName];
        showNotification('请输入有效的颜色值（如 #FF0000 或 #FFF）', 'error');
    }
}

// 颜色输入框键盘事件
function handleColorKeydown(e) {
    if (e.key === 'Enter') {
        e.target.blur();
    }
}

// 颜色选择器输入事件
function handleColorPickerInput(e) {
    const colorName = e.target.dataset.color;
    const value = e.target.value.toUpperCase();

    const currentColors = getCurrentColors();
    currentColors[colorName] = value;
    setCurrentColors(currentColors);
    updateColorSwatch(colorName, value);
    updateColorInput(colorName, value);
}

// 颜色色块点击事件
function handleSwatchClick(e) {
    const colorName = e.target.dataset.color;

    // 高亮显示对应的输入框
    const input = document.querySelector(`.color-input[data-color="${colorName}"]`);
    if (input) {
        input.focus();
        input.select();
    }
}

// 更新颜色色块
function updateColorSwatch(colorName, value) {
    const swatch = document.querySelector(`.preview-swatch[data-color="${colorName}"]`);
    if (swatch) {
        swatch.style.backgroundColor = value;
    }

    // 同时更新卡片预览
    updateCardPreview(colorName, value);
}

// 更新颜色输入框
function updateColorInput(colorName, value) {
    const input = document.querySelector(`.color-input[data-color="${colorName}"]`);
    if (input) {
        input.value = value;
    }
}

// 更新颜色选择器
function updateColorPicker(colorName, value) {
    const picker = document.querySelector(`.color-picker[data-color="${colorName}"]`);
    if (picker) {
        picker.value = value;
    }
}

// 更新卡片预览
function updateCardPreview(colorName, value) {
    // 找到对应的颜色组
    const group = colorGroups.find(g =>
        g.colors.picker === colorName ||
        g.colors.card === colorName ||
        g.colors.text === colorName ||
        g.colors.placeholder === colorName
    );

    if (!group) return;

    // 找到对应的卡片预览元素
    const colorCards = document.querySelectorAll('.color-card');
    let targetCard = null;

    // 遍历所有卡片，找到匹配的标签
    for (const card of colorCards) {
        const colorNameElement = card.querySelector('.color-name');
        if (colorNameElement && colorNameElement.textContent === group.label) {
            targetCard = card;
            break;
        }
    }

    if (!targetCard) return;

    const cardPreview = targetCard.querySelector('.tab-group-card-preview');
    if (!cardPreview) return;

    // 根据颜色类型更新对应的样式
    if (colorName === group.colors.picker) {
        // 更新颜色点
        const colorDot = cardPreview.querySelector('.tab-group-color-dot');
        if (colorDot) {
            colorDot.style.backgroundColor = value;
        }
    } else if (colorName === group.colors.card) {
        // 更新卡片背景
        cardPreview.style.backgroundColor = value;
    } else if (colorName === group.colors.text) {
        // 更新文本颜色
        cardPreview.style.color = value;
    } else if (colorName === group.colors.placeholder) {
        // 更新缩略图背景
        const thumbnails = cardPreview.querySelectorAll('.tab-group-thumbnail');
        thumbnails.forEach(thumbnail => {
            thumbnail.style.backgroundColor = value;
        });
    }
}

// tab-group-color-dot 点击事件处理
function handleColorDotClick(e) {
    const colorName = e.target.dataset.color;
    if (!colorName) return;

    // 找到对应的颜色选择器
    const colorPicker = document.querySelector(`.color-picker[data-color="${colorName}"]`);
    if (colorPicker) {
        // 触发颜色选择器点击
        colorPicker.click();
    }
}