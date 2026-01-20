// 颜色组数据 - 按照Chrome Android Tab Switcher的样式组织
export const colorGroups = [
    {
        id: 'blue',
        label: '蓝色',
        colors: {
            picker: 'tab_group_color_picker_blue',
            card: 'tab_group_card_color_blue',
            text: 'tab_group_card_text_color_blue',
            placeholder: 'tab_group_card_placeholder_color_blue'
        }
    },
    {
        id: 'cyan',
        label: '青色',
        colors: {
            picker: 'tab_group_color_picker_cyan',
            card: 'tab_group_card_color_cyan',
            text: 'tab_group_card_text_color_cyan',
            placeholder: 'tab_group_card_placeholder_color_cyan'
        }
    },
    {
        id: 'green',
        label: '绿色',
        colors: {
            picker: 'tab_group_color_picker_green',
            card: 'tab_group_card_color_green',
            text: 'tab_group_card_text_color_green',
            placeholder: 'tab_group_card_placeholder_color_green'
        }
    },
    {
        id: 'grey',
        label: '灰色',
        colors: {
            picker: 'tab_group_color_picker_grey',
            card: 'tab_group_card_color_grey',
            text: 'tab_group_card_text_color_grey',
            placeholder: 'tab_group_card_placeholder_color_grey'
        }
    },
    {
        id: 'orange',
        label: '橙色',
        colors: {
            picker: 'tab_group_color_picker_orange',
            card: 'tab_group_card_color_orange',
            text: 'tab_group_card_text_color_orange',
            placeholder: 'tab_group_card_placeholder_color_orange'
        }
    },
    {
        id: 'pink',
        label: '粉色',
        colors: {
            picker: 'tab_group_color_picker_pink',
            card: 'tab_group_card_color_pink',
            text: 'tab_group_card_text_color_pink',
            placeholder: 'tab_group_card_placeholder_color_pink'
        }
    },
    {
        id: 'purple',
        label: '紫色',
        colors: {
            picker: 'tab_group_color_picker_purple',
            card: 'tab_group_card_color_purple',
            text: 'tab_group_card_text_color_purple',
            placeholder: 'tab_group_card_placeholder_color_purple'
        }
    },
    {
        id: 'red',
        label: '红色',
        colors: {
            picker: 'tab_group_color_picker_red',
            card: 'tab_group_card_color_red',
            text: 'tab_group_card_text_color_red',
            placeholder: 'tab_group_card_placeholder_color_red'
        }
    },
    {
        id: 'yellow',
        label: '黄色',
        colors: {
            picker: 'tab_group_color_picker_yellow',
            card: 'tab_group_card_color_yellow',
            text: 'tab_group_card_text_color_yellow',
            placeholder: 'tab_group_card_placeholder_color_yellow'
        }
    }
];

// 默认颜色值 - 只使用日间模式
export const defaultColors = {
    // 蓝色组
    tab_group_color_picker_blue: '#1A73E8',
    tab_group_card_color_blue: '#D0E4FF',
    tab_group_card_text_color_blue: '#001944',
    tab_group_card_placeholder_color_blue: '#E7F2FF',

    // 青色组
    tab_group_color_picker_cyan: '#007B83',
    tab_group_card_color_cyan: '#ACEDFF',
    tab_group_card_text_color_cyan: '#001F26',
    tab_group_card_placeholder_color_cyan: '#D8F6FF',

    // 绿色组
    tab_group_color_picker_green: '#188038',
    tab_group_card_color_green: '#BEEFBB',
    tab_group_card_text_color_green: '#002110',
    tab_group_card_placeholder_color_green: '#DDF8D8',

    // 灰色组
    tab_group_color_picker_grey: '#5F6368',
    tab_group_card_color_grey: '#E3E3E3',
    tab_group_card_text_color_grey: '#1B1B1C',
    tab_group_card_placeholder_color_grey: '#F2F2F2',

    // 橙色组
    tab_group_color_picker_orange: '#E8710A',
    tab_group_card_color_orange: '#FFDCC3',
    tab_group_card_text_color_orange: '#321200',
    tab_group_card_placeholder_color_orange: '#FFEDE1',

    // 粉色组
    tab_group_color_picker_pink: '#D01884',
    tab_group_card_color_pink: '#FFD8EF',
    tab_group_card_text_color_pink: '#3D0023',
    tab_group_card_placeholder_color_pink: '#FFECF6',

    // 紫色组
    tab_group_color_picker_purple: '#A142F4',
    tab_group_card_color_purple: '#EEDCFE',
    tab_group_card_text_color_purple: '#280255',
    tab_group_card_placeholder_color_purple: '#F7ECFE',

    // 红色组
    tab_group_color_picker_red: '#D93025',
    tab_group_card_color_red: '#FFDADC',
    tab_group_card_text_color_red: '#3A0907',
    tab_group_card_placeholder_color_red: '#FFECEE',

    // 黄色组
    tab_group_color_picker_yellow: '#F9AB00',
    tab_group_card_color_yellow: '#FFE07C',
    tab_group_card_text_color_yellow: '#2F1400',
    tab_group_card_placeholder_color_yellow: '#FFF2B4'
};

// 草稿最大数量
export const MAX_DRAFTS = 6;

// 服务器URL
export const SERVER_URL = 'http://localhost:3000/api';