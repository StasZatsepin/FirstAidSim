// scripts/scenarios/poisoning.js
// Данные для сценария "Пищевое отравление"

const poisoningScenario = {
    id: 'poisoning',
    name: 'Пищевое отравление',
    order: [1, 2, 3, 4, 5, 6],
    steps: {
        1: {
            id: 1,
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Человек жалуется на сильные боли в животе, тошноту после еды. Выглядит бледным, слабым. Ваши действия?',
            actions: [
                {
                    text: 'Оценить симптомы и возможную причину отравления',
                    isCorrect: true,
                    feedback: 'Верно! Оценка симптомов и выяснение возможной причины поможет определить дальнейшие действия.',
                    nextStepId: 2
                },
                {
                    text: 'Сразу вызвать рвоту',
                    isCorrect: false,
                    feedback: 'Ошибка! Не вызывайте рвоту без консультации врача - при некоторых отравлениях это может быть опасно.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Дать обезболивающее',
                    isCorrect: false,
                    feedback: 'Ошибка! При отравлении нельзя давать обезболивающее без консультации врача - это может скрыть симптомы.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Симптомы указывают на пищевое отравление. Боль усиливается, появляется рвота. Что делать?',
            actions: [
                {
                    text: 'Вызвать скорую помощь при тяжелых симптомах (сильная боль, рвота, диарея)',
                    isCorrect: true,
                    feedback: 'Правильно! При тяжелых симптомах пищевого отравления необходима медицинская помощь.',
                    nextStepId: 3
                },
                {
                    text: 'Подождать и понаблюдать',
                    isCorrect: false,
                    feedback: 'Ошибка! При тяжелых симптомах пищевого отравления нужно вызвать скорую помощь.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Дать активированный уголь и подождать',
                    isCorrect: false,
                    feedback: 'Ошибка! При тяжелых симптомах сначала нужно вызвать скорую помощь, а не заниматься самолечением.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Скорая вызвана. Человек хочет вызвать рвоту. Что делать?',
            actions: [
                {
                    text: 'Не вызывать рвоту самостоятельно (при некоторых отравлениях это опасно)',
                    isCorrect: true,
                    feedback: 'Отлично! При некоторых отравлениях (кислоты, щелочи, нефтепродукты) вызывать рвоту опасно.',
                    nextStepId: 4
                },
                {
                    text: 'Помочь вызвать рвоту',
                    isCorrect: false,
                    feedback: 'Ошибка! Не вызывайте рвоту без консультации врача - при некоторых отравлениях это может быть опасно.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Дать слабительное',
                    isCorrect: false,
                    feedback: 'Ошибка! При отравлении нельзя давать слабительное без консультации врача.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Рвоту вызывать не нужно. Рядом есть остатки еды, которые могли вызвать отравление. Что делать?',
            actions: [
                {
                    text: 'Сохранить образец отравляющего вещества для медиков',
                    isCorrect: true,
                    feedback: 'Правильно! Образец поможет медикам определить причину отравления и назначить правильное лечение.',
                    nextStepId: 5
                },
                {
                    text: 'Выбросить остатки еды',
                    isCorrect: false,
                    feedback: 'Ошибка! Образец отравляющего вещества может помочь медикам в диагностике и лечении.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Попытаться дать человеку съесть еще немного для анализа',
                    isCorrect: false,
                    feedback: 'Ошибка! Не давайте человеку есть отравляющее вещество. Сохраните только образец для медиков.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Образец сохранен. Человек становится слабее, может потерять сознание. Что делать?',
            actions: [
                {
                    text: 'Контролировать сознание и дыхание, уложить в безопасное положение',
                    isCorrect: true,
                    feedback: 'Отлично! Контроль жизненных функций критически важен при отравлении.',
                    nextStepId: 6
                },
                {
                    text: 'Попытаться дать воды',
                    isCorrect: false,
                    feedback: 'Ошибка! При возможной потере сознания нельзя давать воду - человек может захлебнуться.',
                    errorStepId: 'error9'
                },
                {
                    text: 'Оставить одного и подождать скорую',
                    isCorrect: false,
                    feedback: 'Ошибка! При отравлении нужно постоянно контролировать состояние пострадавшего.',
                    errorStepId: 'error10'
                }
            ]
        },
        6: {
            id: 6,
            visualType: 'poisoning',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при пищевом отравлении. Состояние контролируется, образец сохранен. Подготовьте информацию для медиков: время отравления, симптомы, что было съедено.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Не вызывайте рвоту без консультации врача - при некоторых отравлениях это может быть опасно.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При отравлении нельзя давать обезболивающее без консультации врача - это может скрыть симптомы.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При тяжелых симптомах пищевого отравления нужно вызвать скорую помощь.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При тяжелых симптомах сначала нужно вызвать скорую помощь, а не заниматься самолечением.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Не вызывайте рвоту без консультации врача - при некоторых отравлениях это может быть опасно.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При отравлении нельзя давать слабительное без консультации врача.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Образец отравляющего вещества может помочь медикам в диагностике и лечении.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'Не давайте человеку есть отравляющее вещество. Сохраните только образец для медиков.',
            isError: true,
            actions: []
        },
        error9: {
            id: 'error9',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При возможной потере сознания нельзя давать воду - человек может захлебнуться.',
            isError: true,
            actions: []
        },
        error10: {
            id: 'error10',
            visualType: 'poisoning',
            visualState: 'critical',
            description: 'При отравлении нужно постоянно контролировать состояние пострадавшего.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(poisoningScenario);

