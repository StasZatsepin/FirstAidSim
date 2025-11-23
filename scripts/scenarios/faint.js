// scripts/scenarios/faint.js
// Данные для сценария "Потеря сознания"

const faintScenario = {
    id: 'faint',
    name: 'Потеря сознания',
    order: [1, 2, 3, 4],
    steps: {
        1: {
            id: 1,
            visualType: 'faint',
            visualState: 'critical',
            description: 'Вы видите человека, который внезапно упал и не двигается. Ваши действия?',
            actions: [
                {
                    text: 'Проверить безопасность и подойти к пострадавшему',
                    isCorrect: true,
                    feedback: 'Верно! Сначала убедитесь в безопасности, затем подойдите к пострадавшему.',
                    nextStepId: 2
                },
                {
                    text: 'Сразу начать делать искусственное дыхание',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно проверить сознание и дыхание пострадавшего.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Попытаться посадить человека',
                    isCorrect: false,
                    feedback: 'Ошибка! Нельзя перемещать человека без сознания без проверки состояния.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'faint',
            visualState: 'critical',
            description: 'Вы подошли к человеку. Он не реагирует на ваши обращения. Что делать дальше?',
            actions: [
                {
                    text: 'Проверить дыхание, наклонившись к лицу',
                    isCorrect: true,
                    feedback: 'Правильно! Проверка дыхания - критически важный шаг для определения дальнейших действий.',
                    nextStepId: 3
                },
                {
                    text: 'Сразу перевернуть на бок',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно проверить дыхание, чтобы понять, нужна ли СЛР.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Дать воды или лекарство',
                    isCorrect: false,
                    feedback: 'Ошибка! Нельзя давать что-либо человеку без сознания - он может захлебнуться.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'faint',
            visualState: 'side-position',
            description: 'Человек дышит, но без сознания. Что делать дальше?',
            actions: [
                {
                    text: 'Уложить в стабильное боковое положение и вызвать скорую',
                    isCorrect: true,
                    feedback: 'Отлично! Стабильное боковое положение предотвращает западение языка и аспирацию.',
                    nextStepId: 4
                },
                {
                    text: 'Оставить лежать на спине',
                    isCorrect: false,
                    feedback: 'Ошибка! Лежа на спине язык может перекрыть дыхательные пути. Нужно боковое положение.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Попытаться разбудить, тряся и крича',
                    isCorrect: false,
                    feedback: 'Ошибка! При потере сознания нужно обеспечить безопасное положение, а не пытаться разбудить.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'faint',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь. Пострадавший в безопасном положении, скорую вызвали. Контролируйте дыхание до приезда медиков.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'faint',
            visualState: 'critical',
            description: 'Сначала нужно проверить сознание и дыхание пострадавшего.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'faint',
            visualState: 'critical',
            description: 'Нельзя перемещать человека без сознания без проверки состояния.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'faint',
            visualState: 'critical',
            description: 'Сначала нужно проверить дыхание, чтобы понять, нужна ли СЛР.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'faint',
            visualState: 'critical',
            description: 'Нельзя давать что-либо человеку без сознания - он может захлебнуться.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'faint',
            visualState: 'critical',
            description: 'Лежа на спине язык может перекрыть дыхательные пути. Нужно боковое положение.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'faint',
            visualState: 'critical',
            description: 'При потере сознания нужно обеспечить безопасное положение, а не пытаться разбудить.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(faintScenario);

