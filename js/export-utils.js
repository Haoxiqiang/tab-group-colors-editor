import { colorGroups } from './constants.js';
import { getCurrentColors } from './state.js';
import { showNotification } from './ui-enhancements.js';

// 导出颜色文件
export function exportColors() {
    const currentColors = getCurrentColors();

    // 生成颜色文件内容
    const content = generateXmlContent(currentColors);

    // 显示导出内容
    const exportContent = document.getElementById('exportContent');
    const exportSection = document.getElementById('exportSection');

    if (exportContent && exportSection) {
        exportContent.textContent = content;
        exportSection.style.display = 'block';
        exportSection.scrollIntoView({ behavior: 'smooth' });
        showNotification('颜色文件已生成');
    }
}

// 生成XML文件内容
export function generateXmlContent(colors) {
    let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
    xml += `<!--\n`;
    xml += `Copyright 2025 The Chromium Authors\n`;
    xml += `Use of this source code is governed by a BSD-style license that can be\n`;
    xml += `found in the LICENSE file.\n`;
    xml += `-->\n\n`;
    xml += `<resources>\n`;

    // 添加颜色选择器UI颜色
    xml += `    <!-- Colors used by the tab group color picker UI and for the small color dot indicator on the card. -->\n`;
    colorGroups.forEach(group => {
        xml += `    <color name="${group.colors.picker}">${colors[group.colors.picker]}</color>\n`;
    });

    // 添加卡片背景颜色
    xml += `\n    <!-- Colors that define the main background tint for the entire tab group card. -->\n`;
    colorGroups.forEach(group => {
        xml += `    <color name="${group.colors.card}">${colors[group.colors.card]}</color>\n`;
    });

    // 添加卡片文本颜色
    xml += `\n    <!-- Colors for foreground elements, used for the title, tab counter, and action button on a tab group card. -->\n`;
    colorGroups.forEach(group => {
        xml += `    <color name="${group.colors.text}">${colors[group.colors.text]}</color>\n`;
    });

    // 添加占位符背景颜色
    xml += `\n    <!-- Colors for the background of empty mini-thumbnail slots within a tab group card. -->\n`;
    colorGroups.forEach(group => {
        xml += `    <color name="${group.colors.placeholder}">${colors[group.colors.placeholder]}</color>\n`;
    });

    xml += `</resources>`;

    return xml;
}

// 复制到剪贴板
export function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const text = element.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        showNotification('复制失败，请手动复制', 'error');
    });
}