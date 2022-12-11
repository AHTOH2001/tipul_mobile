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
    'Username': 'Имя пользователя',
    'Password': 'Пароль',
    'Log in': 'Войти',
    'Register': 'Регистрация',
    'Email': 'Электронная почта',
    'Not registered yet?': 'Еще не зарегистрировались?',
    'Already registered?': 'Уже зарегистрировались?',
    'Please, fill in your email': 'Пожалуйста, введите вашу почту',
    'Please, fill in your username': 'Пожалуйста, введите ваше имя пользователя',
    'Please, fill in your password': 'Пожалуйста, введите ваш пароль',
    'Enter valid email': 'Введите правильную почту',
    'Authorisation': 'Авторизация',
    'Registration': 'Регистрация',
    'Main screen': 'Главный экран',
    'Settings': 'Настройки',
    'Medicines': 'Медикаменты',
    'Medicine': 'Медикамент',
    'Title': 'Заголовок',
    'Dose': 'Доза',
    'Reception frequency': 'Частота приёма',
    'Cycle start': 'Дата начала',
    'Cycle end': 'Дата окончания',
    'Add': 'Добавить',
    'Type': 'Тип',
}

export default translate = (text, language) => {
    let res = null;
    switch (language) {
        case 'русский': res = russian_dictionary[text] || text; break;
        default: res = text
    }

    return res

}
