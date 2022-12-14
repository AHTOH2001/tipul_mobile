russian_dictionary = {
    'Select language': 'Выбрать язык',
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
    'Doctors': 'Доктора',
    'Doctor': 'Доктор',
    'endocrinologist': 'Эндокринолог',
    'neurologist': 'Невролог',
    'therapist': 'Терапевт',
    'cardiologist': 'Кардиолог',
    'ophthalmologist': 'Офтальмолог',
    'nutritionist': 'Диетолог',
    'surgeon': 'Хирург',
    'injection': 'Укол',
    'ampule': 'Ампула',
    'pill': 'Таблетка',
    'SUSPENSION': 'Суспензия',
    'New': 'Новый',
    'First name': 'Имя',
    'Last name': 'Фамилия',
    'Specialty': 'Специальность',
    'Log out': 'Выйти',
    'Patient created': 'Пациент создан',
    'You have been registered, now log in': 'Вы зарегистрировались, теперь войдите',
    'Username or Password is not correct': 'Неверное имя пользователя или пароль',
}

export default translate = (text, language) => {
    let res = null;
    switch (language) {
        case 'русский': res = russian_dictionary[text] || text; break;
        default: res = text
    }

    return res

}
