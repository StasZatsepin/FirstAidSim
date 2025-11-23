// scripts/scenarios/cpr.js
// Данные для сценария "Сердечно-легочная реанимация (СЛР)"

const cprScenario = {
    id: 'cpr',
    name: 'Сердечно-легочная реанимация (СЛР)',
    order: [1, 2, 3, 4, 5],
    steps: {
        1: {
            id: 1,
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Вы видите человека, лежащего на земле. Он не двигается и не реагирует на ваши обращения. Ваши действия?',
            actions: [
                {
                    text: 'Проверить безопасность места происшествия',
                    isCorrect: true,
                    feedback: 'Верно! Первым делом нужно убедиться, что вам и пострадавшему ничего не угрожает.',
                    nextStepId: 2
                },
                {
                    text: 'Немедленно начать массаж сердца',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно проверить сознание и дыхание, а также убедиться в безопасности.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Попытаться разбудить человека, тряся его',
                    isCorrect: false,
                    feedback: 'Ошибка! При потере сознания нужно сначала проверить дыхание, а не пытаться разбудить.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Место безопасно. Вы подошли к человеку и видите, что он не реагирует. Что делать дальше?',
            actions: [
                {
                    text: 'Проверить дыхание, наклонившись к лицу и прислушиваясь',
                    isCorrect: true,
                    feedback: 'Правильно! Проверка дыхания - критически важный шаг для определения необходимости СЛР.',
                    nextStepId: 3
                },
                {
                    text: 'Сразу начать компрессии грудной клетки',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно проверить дыхание. СЛР нужна только если человек не дышит.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Попытаться дать воды',
                    isCorrect: false,
                    feedback: 'Ошибка! Нельзя давать воду человеку без сознания - он может захлебнуться.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Вы проверили дыхание - человек не дышит. Что делать дальше?',
            actions: [
                {
                    text: 'Вызвать скорую помощь (112) и начать СЛР',
                    isCorrect: true,
                    feedback: 'Отлично! Вызов скорой помощи и начало СЛР - правильная последовательность действий.',
                    nextStepId: 4
                },
                {
                    text: 'Начать СЛР, не вызывая скорую',
                    isCorrect: false,
                    feedback: 'Ошибка! Скорую помощь нужно вызвать немедленно, параллельно с началом СЛР.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Подождать приезда скорой, не делая ничего',
                    isCorrect: false,
                    feedback: 'Ошибка! Без СЛР шансы на выживание критически снижаются. Нужно действовать немедленно.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'cpr',
            visualState: 'compressions',
            description: 'Скорая вызвана. Вы начинаете СЛР. Как правильно выполнять компрессии грудной клетки?',
            actions: [
                {
                    text: '30 компрессий на глубину 5-6 см, затем 2 вдоха',
                    isCorrect: true,
                    feedback: 'Правильно! Соотношение 30:2 - стандартный алгоритм СЛР для взрослых.',
                    nextStepId: 5
                },
                {
                    text: '15 компрессий, затем 2 вдоха',
                    isCorrect: false,
                    feedback: 'Ошибка! Для взрослых используется соотношение 30:2, а не 15:2.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Только компрессии без вдохов',
                    isCorrect: false,
                    feedback: 'Ошибка! Хотя компрессии важны, вдохи также необходимы для эффективной СЛР.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'cpr',
            visualState: 'treated',
            description: 'Вы правильно выполнили СЛР. Пострадавший получил необходимую помощь до приезда медиков.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Начало СЛР без проверки безопасности и состояния может быть опасным.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Попытка разбудить человека без проверки дыхания - неправильный подход.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'СЛР нужна только если человек не дышит. Сначала проверьте дыхание.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Нельзя давать воду человеку без сознания - он может захлебнуться.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Скорую помощь нужно вызвать немедленно, параллельно с началом СЛР.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Без СЛР шансы на выживание критически снижаются. Нужно действовать немедленно.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Для взрослых используется соотношение 30:2, а не 15:2.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'cpr',
            visualState: 'critical',
            description: 'Хотя компрессии важны, вдохи также необходимы для эффективной СЛР.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(cprScenario);

