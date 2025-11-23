// scripts/scenarios/anaphylaxis.js
// Данные для сценария "Анафилактический шок"

const anaphylaxisScenario = {
    id: 'anaphylaxis',
    name: 'Анафилактический шок',
    order: [1, 2, 3, 4, 5],
    steps: {
        1: {
            id: 1,
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Человек после укуса пчелы жалуется на затрудненное дыхание, отек лица и сыпь. Вы видите покраснение кожи, отекшие губы и щеки. Ваши действия?',
            actions: [
                {
                    text: 'Распознать симптомы анафилаксии',
                    isCorrect: true,
                    feedback: 'Верно! Затрудненное дыхание, отек лица и сыпь - это классические признаки анафилактической реакции.',
                    nextStepId: 2
                },
                {
                    text: 'Дать антигистаминное средство и подождать',
                    isCorrect: false,
                    feedback: 'Ошибка! При анафилаксии нужна немедленная медицинская помощь. Антигистаминные препараты недостаточны для лечения тяжелой реакции.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Уложить человека и дать воды',
                    isCorrect: false,
                    feedback: 'Ошибка! При затрудненном дыхании нельзя давать воду - человек может захлебнуться. Нужно помочь принять положение, облегчающее дыхание.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Вы распознали симптомы анафилаксии. Отек усиливается, дыхание становится еще более затрудненным. Что делать дальше?',
            actions: [
                {
                    text: 'Вызвать скорую помощь (112)',
                    isCorrect: true,
                    feedback: 'Правильно! Анафилаксия - это неотложное состояние, требующее немедленной медицинской помощи.',
                    nextStepId: 3
                },
                {
                    text: 'Подождать и понаблюдать за состоянием',
                    isCorrect: false,
                    feedback: 'Ошибка! Анафилаксия может быстро прогрессировать и привести к летальному исходу. Нужно немедленно вызвать скорую помощь.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Отвезти человека в больницу самостоятельно',
                    isCorrect: false,
                    feedback: 'Ошибка! При анафилаксии лучше вызвать скорую помощь, так как состояние может ухудшиться в пути, и медики смогут оказать помощь на месте.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Скорая вызвана. У человека есть автоинжектор адреналина (EpiPen). Что делать?',
            actions: [
                {
                    text: 'Использовать автоинжектор адреналина (если есть)',
                    isCorrect: true,
                    feedback: 'Отлично! Адреналин - это основное лекарство при анафилаксии. Автоинжектор нужно ввести в наружную поверхность бедра.',
                    nextStepId: 4
                },
                {
                    text: 'Подождать приезда скорой, не используя инжектор',
                    isCorrect: false,
                    feedback: 'Ошибка! Если есть автоинжектор адреналина, его нужно использовать немедленно, не дожидаясь скорой помощи.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Ввести инжектор в руку',
                    isCorrect: false,
                    feedback: 'Ошибка! Автоинжектор адреналина нужно вводить в наружную поверхность бедра, а не в руку.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'anaphylaxis',
            visualState: 'treating',
            description: 'Адреналин введен. Человек все еще испытывает затруднения с дыханием. Что делать дальше?',
            actions: [
                {
                    text: 'Помочь принять положение, облегчающее дыхание (полусидя или сидя)',
                    isCorrect: true,
                    feedback: 'Правильно! Полусидячее или сидячее положение помогает облегчить дыхание при отеке дыхательных путей.',
                    nextStepId: 5
                },
                {
                    text: 'Уложить человека на спину',
                    isCorrect: false,
                    feedback: 'Ошибка! Лежа на спине при затрудненном дыхании состояние может ухудшиться. Нужно помочь принять положение, облегчающее дыхание.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Дать человеку лечь на живот',
                    isCorrect: false,
                    feedback: 'Ошибка! При затрудненном дыхании нужно помочь принять полусидячее или сидячее положение.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'anaphylaxis',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при анафилактическом шоке. Пострадавший в безопасном положении, адреналин введен, скорую вызвали. Контролируйте состояние до приезда медиков.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'При анафилаксии антигистаминные препараты недостаточны. Нужна немедленная медицинская помощь и адреналин.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'При затрудненном дыхании нельзя давать воду - человек может захлебнуться.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Анафилаксия может быстро прогрессировать. Нужно немедленно вызвать скорую помощь.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'При анафилаксии лучше вызвать скорую помощь, так как состояние может ухудшиться в пути.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Если есть автоинжектор адреналина, его нужно использовать немедленно, не дожидаясь скорой помощи.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Автоинжектор адреналина нужно вводить в наружную поверхность бедра, а не в руку.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'Лежа на спине при затрудненном дыхании состояние может ухудшиться. Нужно помочь принять положение, облегчающее дыхание.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'anaphylaxis',
            visualState: 'critical',
            description: 'При затрудненном дыхании нужно помочь принять полусидячее или сидячее положение.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(anaphylaxisScenario);

