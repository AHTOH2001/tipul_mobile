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
    'Duration': 'Длительность',
    'Phone': 'Телефон',
}

export default translate = (text, language) => {
    let res = null;
    console.log(text)
    console.log(res)
    switch (language) {
        case 'русский': res = russian_dictionary[text]
        default: res = text
    }
    console.log(res)
    if (res === null) {
        res = text
    }
    return res

}
