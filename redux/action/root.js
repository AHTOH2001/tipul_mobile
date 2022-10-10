export const change_theme = (data) => {
    return {
        type: 'CHANGE_THEME',
        payload: data
    }
}

export const change_language = (data) => {
    return {
        type: 'CHANGE_LANGUAGE',
        payload: data
    }
}

export const change_font_size = (data) => {
    return {
        type: 'CHANGE_FONT_SIZE',
        payload: data
    }
}
