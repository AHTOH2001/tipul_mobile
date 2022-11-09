
const initialState = {
    theme: '',
    language: '',
    font_size: 0
}


export default root = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_THEME':
            return {
                ...state,
                theme: action.payload
            }
        case 'CHANGE_LANGUAGE':
            return {
                ...state,
                language: action.payload
            }
        case 'CHANGE_FONT_SIZE':
            return {
                ...state,
                font_size: action.payload
            }
        default:
            return state;
    }
}