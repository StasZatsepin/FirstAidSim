// scripts/scenarios/drowning.js
// Данные для сценария "Спасение утопающего"

const drowningScenario = {
    id: 'drowning',
    name: 'Спасение утопающего',
    order: [1, 2, 3, 4, 5, 6],
    steps: {
        1: {
            id: 1,
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Человек без сознания извлечен из воды. Он мокрый, не двигается. Ваши действия?',
            actions: [
                {
                    text: 'Проверить безопасность (убрать из воды, убедиться в безопасности места)',
                    isCorrect: true,
                    feedback: 'Верно! Первым делом нужно обеспечить безопасность - убрать человека из воды и убедиться, что место безопасно.',
                    nextStepId: 2
                },
                {
                    text: 'Сразу начать делать искусственное дыхание',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно проверить сознание и дыхание, а также убедиться в безопасности.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Попытаться разбудить человека',
                    isCorrect: false,
                    feedback: 'Ошибка! При потере сознания нужно сначала проверить дыхание, а не пытаться разбудить.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Человек в безопасности, убран из воды. Он не реагирует на ваши обращения. Что делать дальше?',
            actions: [
                {
                    text: 'Проверить сознание и дыхание, наклонившись к лицу',
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
                    text: 'Попытаться удалить воду из легких',
                    isCorrect: false,
                    feedback: 'Ошибка! Не пытайтесь удалять воду из легких - это неэффективно и может задержать начало СЛР.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Вы проверили дыхание - человек не дышит. Вокруг рта видна вода. Что делать дальше?',
            actions: [
                {
                    text: 'Вызвать скорую помощь (112) и начать СЛР',
                    isCorrect: true,
                    feedback: 'Отлично! Вызов скорой помощи и начало СЛР - правильная последовательность действий при утоплении.',
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
            visualType: 'drowning',
            visualState: 'cpr',
            description: 'Скорая вызвана. Вы начинаете СЛР. При утоплении важно учитывать особенности. Как правильно выполнять СЛР?',
            actions: [
                {
                    text: '30 компрессий на глубину 5-6 см, затем 2 вдоха (стандартная СЛР)',
                    isCorrect: true,
                    feedback: 'Правильно! При утоплении используется стандартная СЛР 30:2, но важно быть готовым к рвоте.',
                    nextStepId: 5
                },
                {
                    text: 'Сначала сделать 5 вдохов, затем компрессии',
                    isCorrect: false,
                    feedback: 'Ошибка! При утоплении используется стандартная СЛР 30:2, а не 5 вдохов в начале.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Только компрессии без вдохов',
                    isCorrect: false,
                    feedback: 'Ошибка! Хотя компрессии важны, вдохи также необходимы для эффективной СЛР при утоплении.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'drowning',
            visualState: 'cpr',
            description: 'Вы выполняете СЛР. У человека началась рвота. Что делать?',
            actions: [
                {
                    text: 'Повернуть человека на бок, очистить рот, затем продолжить СЛР',
                    isCorrect: true,
                    feedback: 'Отлично! При рвоте нужно повернуть на бок, очистить рот, затем продолжить СЛР.',
                    nextStepId: 6
                },
                {
                    text: 'Продолжить СЛР, игнорируя рвоту',
                    isCorrect: false,
                    feedback: 'Ошибка! Рвота может заблокировать дыхательные пути. Нужно очистить рот перед продолжением СЛР.',
                    errorStepId: 'error9'
                },
                {
                    text: 'Прекратить СЛР и подождать',
                    isCorrect: false,
                    feedback: 'Ошибка! СЛР нужно продолжать, но сначала очистить рот от рвотных масс.',
                    errorStepId: 'error10'
                }
            ]
        },
        6: {
            id: 6,
            visualType: 'drowning',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при утоплении. СЛР продолжается, рот очищен. Продолжайте СЛР до приезда медиков или восстановления дыхания.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Сначала нужно проверить сознание и дыхание, а также убедиться в безопасности.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'При потере сознания нужно сначала проверить дыхание, а не пытаться разбудить.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'СЛР нужна только если человек не дышит. Сначала проверьте дыхание.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Не пытайтесь удалять воду из легких - это неэффективно и может задержать начало СЛР.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Скорую помощь нужно вызвать немедленно, параллельно с началом СЛР.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Без СЛР шансы на выживание критически снижаются. Нужно действовать немедленно.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'При утоплении используется стандартная СЛР 30:2, а не 5 вдохов в начале.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Хотя компрессии важны, вдохи также необходимы для эффективной СЛР при утоплении.',
            isError: true,
            actions: []
        },
        error9: {
            id: 'error9',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'Рвота может заблокировать дыхательные пути. Нужно очистить рот перед продолжением СЛР.',
            isError: true,
            actions: []
        },
        error10: {
            id: 'error10',
            visualType: 'drowning',
            visualState: 'critical',
            description: 'СЛР нужно продолжать, но сначала очистить рот от рвотных масс.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(drowningScenario);

