let russian_dictionary = {
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
    'User created': 'Пользователь создан',
    'Patient created': 'Пациент создан',
    'You have been registered, before logging in confirm your email': 'Вы зарегистрировались, перед авторизацией подтвердите свою почту',
    'Username or Password is not correct': 'Неверное имя пользователя или пароль',
    'Registration data is incorrect': 'Неверные данные для регистрации',
    'Visits': 'Визиты',
    'User type': 'Тип пользователя',
    'Patient': 'Пациент',
    'Guardian': 'Опекун',
    'Create': 'Создать',
    'Age': 'Возраст',
    'Phone number': 'Номер телефона',
    'Please, fill in your first name': 'Пожалуйста, введите ваше имя',
    'Please, fill in your last name': 'Пожалуйста, введите вашн фамилию',
    'Please, fill in your age': 'Пожалуйста, введите ваш возраст',
    'Age should be an integer': 'Возраст должен быть числом',
    'Please, fill in your phone': 'Пожалуйста, введите ваш телефон',
    'Phone should be an integer': 'Телефон должен быть числом',
    'Phone length should be from 10 to 12 numbers': 'Длина телефонного номера должна быть между 10 и 12 цифрами',
    'Relationship': 'Взаимоотношение',
    'Please, fill in your relationship': 'Пожалуйста, введите кем вы приходитесь пациенту',
    'Guardian created': 'Опекун создан',
    'Reports': 'Отчёты',
    'Doctor visit': 'Визит к врачу',
    'at': 'в',
    'Create visit': 'Создать визит',
    'Visit date': 'Дата визита',
    'Visit time': 'Время визита',
    'Error': 'Ошибка',
    'You should choose a doctor': 'Вам следует выбрать доктора',
    'Save': 'Сохранить',
    'Take medicine?': 'Принять медикамент?',
    'delete': 'удалить',
    'take': 'принять',
    'cancel': 'отмена',
    'You should not take this medicine': 'Вам не нужно принимать этот медикамент',
    'Medicine taken, thanks for updates': 'Медикамент принят, спасибо за вашу информацию',
    'Medicine taken, but not in time': 'Медикамент принят, но не во время',
    'Statistic date': 'Дата статистики',
    'Statistic': 'Статистика',
    'Report date': 'Дата отчёта',
    'Report': 'Отчёт',
    'Taken meds': 'Принятые медикаменты',
    'No taken meds in this day': 'Нет принятых медикаментов в этот день',
    'Missed meds': 'Пропущенные медикаменты',
    'No missed meds in this day': 'Нет пропущенных медикаментов в этот день',
    'New medicine': 'Новый медикамент',
    'injection': 'Укол',
    'ampule': 'Ампула',
    'pill': 'Таблетка',
    'suspension': 'Суспензия',
    'pcs': 'шт',
    'ml': 'мл',
    'Select a doctor': 'Выбрать доктора',
    'Camera': 'Камера',
    'Medicine not found :(': 'Медикамент не найден :(',
    'Try hold your phone still': 'Постарайтесь держать телефон ровнее',
    'Get my code': 'Получить мой код',
    'Copied secret code': 'Секретный код скопирован',
    'Now you can send this code to your guardian': 'Теперь вы можете отправить Ваш код опекуну',
    'My code': 'Мой код',
    'my id': 'мой id',
    'Code': 'Код',
    'ID': 'ID',
}

const translate = (text, language) => {
    let res = null;
    switch (language) {
        case 'RUSSIAN': res = russian_dictionary[text] || text; break;
        default: res = text
    }

    return res

}

export default translate
