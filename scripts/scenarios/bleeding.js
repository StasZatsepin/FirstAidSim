// scripts/scenarios/bleeding.js
// Данные для сценария "Артериальное кровотечение"

const bleedingScenario = {
    id: 'bleeding',
    name: 'Артериальное кровотечение',
    order: [1, 2, 3, 4, 5],
    steps: {
        1: {
            id: 1,
            visualType: 'bleeding',
            visualState: 'injured',
            description: 'Вы видите человека с сильным кровотечением из руки. Кровь ярко-красная и вытекает пульсирующей струей. Ваши действия?',
            actions: [
                {
                    text: 'Надеть перчатки и надавить на рану',
                    isCorrect: true,
                    feedback: 'Верно! Защита себя и прямое давление на рану - первые шаги при кровотечении.',
                    nextStepId: 2
                },
                {
                    text: 'Наложить жгут сразу, без перчаток',
                    isCorrect: false,
                    feedback: 'Ошибка! Сначала нужно надеть перчатки для защиты и попробовать остановить кровь прямым давлением.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Промыть рану водой',
                    isCorrect: false,
                    feedback: 'Ошибка! При артериальном кровотечении нельзя промывать рану - это усилит кровопотерю.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'bleeding',
            visualState: 'injured',
            description: 'Вы надавливаете на рану, но кровотечение продолжается. Что делать дальше?',
            actions: [
                {
                    text: 'Продолжить давление и наложить жгут выше раны',
                    isCorrect: true,
                    feedback: 'Правильно! Если прямое давление не помогает, нужно наложить жгут выше места ранения.',
                    nextStepId: 3
                },
                {
                    text: 'Ослабить давление и проверить рану',
                    isCorrect: false,
                    feedback: 'Ошибка! Ослабление давления усилит кровотечение. Нужно продолжать давление.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Наложить жгут ниже раны',
                    isCorrect: false,
                    feedback: 'Ошибка! Жгут накладывается ВЫШЕ места ранения, чтобы пережать артерию.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'bleeding',
            visualState: 'treated',
            description: 'Жгут наложен. Кровотечение остановилось. Что важно сделать дальше?',
            actions: [
                {
                    text: 'Отметить время наложения жгута и вызвать скорую',
                    isCorrect: true,
                    feedback: 'Отлично! Отметка времени критически важна, так как жгут нельзя держать слишком долго.',
                    nextStepId: 4
                },
                {
                    text: 'Снять жгут через 5 минут',
                    isCorrect: false,
                    feedback: 'Ошибка! Жгут нельзя снимать самостоятельно. Это должен делать врач.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Оставить как есть и не вызывать скорую',
                    isCorrect: false,
                    feedback: 'Ошибка! При артериальном кровотечении обязательно нужна медицинская помощь.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'bleeding',
            visualState: 'treated',
            description: 'Скорая вызвана. Жгут на месте, время отмечено. Как обеспечить дальнейшую помощь?',
            actions: [
                {
                    text: 'Поддерживать пострадавшего, контролировать состояние до приезда медиков',
                    isCorrect: true,
                    feedback: 'Правильно! Важно поддерживать пострадавшего и следить за его состоянием.',
                    nextStepId: 5
                },
                {
                    text: 'Ослабить жгут, чтобы проверить кровотечение',
                    isCorrect: false,
                    feedback: 'Ошибка! Жгут нельзя ослаблять самостоятельно - это может возобновить кровотечение.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Дать обезболивающее',
                    isCorrect: false,
                    feedback: 'Ошибка! При кровотечении нельзя давать обезболивающее без консультации врача.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'bleeding',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при артериальном кровотечении. Пострадавший получил необходимую помощь.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'Сначала нужно защитить себя перчатками и попробовать остановить кровь прямым давлением.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'При артериальном кровотечении нельзя промывать рану - это усилит кровопотерю.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'Ослабление давления усилит кровотечение. Нужно продолжать давление.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'Жгут накладывается ВЫШЕ места ранения, чтобы пережать артерию.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'Жгут нельзя снимать самостоятельно. Это должен делать врач.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'При артериальном кровотечении обязательно нужна медицинская помощь.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'Жгут нельзя ослаблять самостоятельно - это может возобновить кровотечение.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'bleeding',
            visualState: 'critical',
            description: 'При кровотечении нельзя давать обезболивающее без консультации врача.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(bleedingScenario);

