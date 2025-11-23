// scripts/scenarios/fracture.js
// Данные для сценария "Открытый перелом"

const fractureScenario = {
    id: 'fracture',
    name: 'Открытый перелом',
    order: [1, 2, 3, 4, 5, 6],
    steps: {
        1: {
            id: 1,
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Человек упал с высоты. Видна кость, выступающая из раны на ноге. Сильная боль, человек не может двигать ногой. Ваши действия?',
            actions: [
                {
                    text: 'Оценить безопасность места происшествия',
                    isCorrect: true,
                    feedback: 'Верно! Первым делом нужно убедиться, что вам и пострадавшему ничего не угрожает.',
                    nextStepId: 2
                },
                {
                    text: 'Немедленно попытаться вправить кость',
                    isCorrect: false,
                    feedback: 'Ошибка! Никогда не пытайтесь вправлять кость самостоятельно - это может усугубить травму и вызвать дополнительное повреждение.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Попытаться переместить пострадавшего',
                    isCorrect: false,
                    feedback: 'Ошибка! При переломе нельзя перемещать пострадавшего без иммобилизации - это может усугубить травму.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Место безопасно. У человека открытый перелом ноги с видимой костью. Что делать дальше?',
            actions: [
                {
                    text: 'Вызвать скорую помощь (112)',
                    isCorrect: true,
                    feedback: 'Правильно! При открытом переломе необходима немедленная медицинская помощь.',
                    nextStepId: 3
                },
                {
                    text: 'Подождать и понаблюдать',
                    isCorrect: false,
                    feedback: 'Ошибка! Открытый перелом - это неотложное состояние, требующее немедленной медицинской помощи.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Отвезти в больницу самостоятельно',
                    isCorrect: false,
                    feedback: 'Ошибка! При открытом переломе лучше вызвать скорую помощь, так как транспортировка без иммобилизации опасна.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'fracture',
            visualState: 'bleeding',
            description: 'Скорая вызвана. Из раны идет кровь. Что делать?',
            actions: [
                {
                    text: 'Остановить кровотечение, надавив на рану чистой тканью',
                    isCorrect: true,
                    feedback: 'Отлично! Остановка кровотечения - приоритет при открытом переломе.',
                    nextStepId: 4
                },
                {
                    text: 'Промыть рану водой',
                    isCorrect: false,
                    feedback: 'Ошибка! При открытом переломе нельзя промывать рану - это может усилить кровотечение и занести инфекцию.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Попытаться вправить кость в рану',
                    isCorrect: false,
                    feedback: 'Ошибка! Никогда не пытайтесь вправлять кость - это должен делать только врач.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'fracture',
            visualState: 'immobilizing',
            description: 'Кровотечение остановлено. Кость все еще видна. Что делать дальше?',
            actions: [
                {
                    text: 'Иммобилизовать конечность с помощью шины',
                    isCorrect: true,
                    feedback: 'Правильно! Иммобилизация предотвращает дальнейшее повреждение и уменьшает боль.',
                    nextStepId: 5
                },
                {
                    text: 'Оставить ногу как есть',
                    isCorrect: false,
                    feedback: 'Ошибка! Без иммобилизации любое движение может усугубить перелом и вызвать дополнительное повреждение.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Попытаться выровнять ногу перед иммобилизацией',
                    isCorrect: false,
                    feedback: 'Ошибка! Не пытайтесь выравнивать конечность - фиксируйте ее в том положении, в котором она находится.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'fracture',
            visualState: 'immobilizing',
            description: 'Шина наложена. Рана все еще открыта. Что делать с раной?',
            actions: [
                {
                    text: 'Накрыть рану стерильной повязкой, не надавливая на кость',
                    isCorrect: true,
                    feedback: 'Отлично! Стерильная повязка защищает рану от инфицирования, но не должна давить на выступающую кость.',
                    nextStepId: 6
                },
                {
                    text: 'Оставить рану открытой',
                    isCorrect: false,
                    feedback: 'Ошибка! Открытая рана подвержена риску инфицирования. Нужно накрыть стерильной повязкой.',
                    errorStepId: 'error9'
                },
                {
                    text: 'Туго забинтовать рану',
                    isCorrect: false,
                    feedback: 'Ошибка! Тугая повязка может давить на кость и усугубить травму. Повязка должна быть свободной.',
                    errorStepId: 'error10'
                }
            ]
        },
        6: {
            id: 6,
            visualType: 'fracture',
            visualState: 'treated',
            description: 'Рана обработана и защищена. Человек бледный, может быть в шоке. Что делать дальше?',
            actions: [
                {
                    text: 'Контролировать состояние, уложить, приподнять ноги, согреть',
                    isCorrect: true,
                    feedback: 'Правильно! Контроль шока и поддержание жизненных функций критически важны до приезда медиков.',
                    nextStepId: 7
                },
                {
                    text: 'Дать обезболивающее',
                    isCorrect: false,
                    feedback: 'Ошибка! При открытом переломе нельзя давать обезболивающее без консультации врача - это может скрыть симптомы.',
                    errorStepId: 'error11'
                },
                {
                    text: 'Попытаться дать воды',
                    isCorrect: false,
                    feedback: 'Ошибка! При шоке и возможной потере сознания нельзя давать воду - человек может захлебнуться.',
                    errorStepId: 'error12'
                }
            ]
        },
        7: {
            id: 7,
            visualType: 'fracture',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при открытом переломе. Пострадавший иммобилизован, рана обработана, состояние контролируется. Ожидайте приезда медиков.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Никогда не пытайтесь вправлять кость самостоятельно - это может усугубить травму.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'При переломе нельзя перемещать пострадавшего без иммобилизации.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Открытый перелом - это неотложное состояние, требующее немедленной медицинской помощи.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'При открытом переломе лучше вызвать скорую помощь, так как транспортировка без иммобилизации опасна.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'При открытом переломе нельзя промывать рану - это может усилить кровотечение.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Никогда не пытайтесь вправлять кость - это должен делать только врач.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Без иммобилизации любое движение может усугубить перелом.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Не пытайтесь выравнивать конечность - фиксируйте ее в том положении, в котором она находится.',
            isError: true,
            actions: []
        },
        error9: {
            id: 'error9',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Открытая рана подвержена риску инфицирования. Нужно накрыть стерильной повязкой.',
            isError: true,
            actions: []
        },
        error10: {
            id: 'error10',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'Тугая повязка может давить на кость и усугубить травму. Повязка должна быть свободной.',
            isError: true,
            actions: []
        },
        error11: {
            id: 'error11',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'При открытом переломе нельзя давать обезболивающее без консультации врача.',
            isError: true,
            actions: []
        },
        error12: {
            id: 'error12',
            visualType: 'fracture',
            visualState: 'critical',
            description: 'При шоке и возможной потере сознания нельзя давать воду - человек может захлебнуться.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(fractureScenario);

