russian_dictionary = {
    'Select language': 'Выбрать язык',
    'Select theme': 'Выбрать тему',
    'light': 'светлая',
    'dark': 'темная',
    'Font size': 'Размер шрифта',
    'Name': 'Название',
    'Rest': 'Отдых',
    'Workout': 'Работа',
    'Warm-up': 'Разминка',
    'Cooldown': 'Передышка',
    'Duration': 'Длительность'
}

export default translate = (text, language) => {
    switch (language) {
        case 'русский': return russian_dictionary[text]
        default: return text
    }

}
