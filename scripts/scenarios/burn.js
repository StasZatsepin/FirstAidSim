// scripts/scenarios/burn.js
// Данные для сценария "Термический ожог"

const burnScenario = {
    id: 'burn',
    name: 'Термический ожог',
    order: [1, 2, 3, 4, 5],
    steps: {
        1: {
            id: 1,
            visualType: 'burn',
            visualState: 'injured',
            description: 'Вы видите человека, который получил термический ожог. На коже видны покраснения и волдыри. Человек испытывает сильную боль. Ваши действия?',
            actions: [
                {
                    text: 'Охладить ожог прохладной водой',
                    isCorrect: true,
                    feedback: 'Верно! Охлаждение водой помогает уменьшить температуру кожи и боль.',
                    nextStepId: 2
                },
                {
                    text: 'Наложить масло или крем на ожог',
                    isCorrect: false,
                    feedback: 'Ошибка! Наложение масла создает пленку и может усугубить ожог, а также затрудняет дальнейшее лечение.',
                    errorStepId: 'error1'
                },
                {
                    text: 'Проколоть волдыри',
                    isCorrect: false,
                    feedback: 'Ошибка! Проколотые волдыри увеличивают риск инфицирования раны.',
                    errorStepId: 'error2'
                }
            ]
        },
        2: {
            id: 2,
            visualType: 'burn',
            visualState: 'treating',
            description: 'Вы охлаждаете ожог прохладной водой. Человек говорит, что боль немного уменьшилась. Что делать дальше?',
            actions: [
                {
                    text: 'Продолжить охлаждение 10-20 минут',
                    isCorrect: true,
                    feedback: 'Правильно! Охлаждение нужно продолжать 10-20 минут для эффективного снижения температуры тканей.',
                    nextStepId: 3
                },
                {
                    text: 'Прекратить охлаждение и наложить повязку',
                    isCorrect: false,
                    feedback: 'Ошибка! Недостаточное охлаждение может привести к более глубокому повреждению тканей.',
                    errorStepId: 'error3'
                },
                {
                    text: 'Использовать лед вместо воды',
                    isCorrect: false,
                    feedback: 'Ошибка! Лед может вызвать дополнительное повреждение тканей из-за слишком низкой температуры.',
                    errorStepId: 'error4'
                }
            ]
        },
        3: {
            id: 3,
            visualType: 'burn',
            visualState: 'treating',
            description: 'Ожог охлажден. Кожа все еще красная, но боль значительно уменьшилась. Как правильно обработать ожог дальше?',
            actions: [
                {
                    text: 'Накрыть ожог стерильной повязкой или чистой тканью',
                    isCorrect: true,
                    feedback: 'Отлично! Стерильная повязка защищает рану от инфицирования.',
                    nextStepId: 4
                },
                {
                    text: 'Оставить ожог открытым',
                    isCorrect: false,
                    feedback: 'Ошибка! Открытый ожог подвержен риску инфицирования.',
                    errorStepId: 'error5'
                },
                {
                    text: 'Наложить тугую повязку',
                    isCorrect: false,
                    feedback: 'Ошибка! Тугая повязка может нарушить кровообращение и усугубить состояние.',
                    errorStepId: 'error6'
                }
            ]
        },
        4: {
            id: 4,
            visualType: 'burn',
            visualState: 'treated',
            description: 'Ожог обработан и защищен повязкой. Человек чувствует себя лучше. Что делать дальше?',
            actions: [
                {
                    text: 'Обратиться за медицинской помощью, особенно при обширных ожогах',
                    isCorrect: true,
                    feedback: 'Правильно! При серьезных ожогах необходима профессиональная медицинская помощь.',
                    nextStepId: 5
                },
                {
                    text: 'Дать обезболивающее и оставить как есть',
                    isCorrect: false,
                    feedback: 'Ошибка! При серьезных ожогах самолечение может быть опасным. Нужна консультация врача.',
                    errorStepId: 'error7'
                },
                {
                    text: 'Снять повязку и проверить состояние',
                    isCorrect: false,
                    feedback: 'Ошибка! Частое снятие повязки может повредить заживающую кожу и увеличить риск инфицирования.',
                    errorStepId: 'error8'
                }
            ]
        },
        5: {
            id: 5,
            visualType: 'burn',
            visualState: 'treated',
            description: 'Вы правильно оказали первую помощь при ожоге. Пострадавший получил необходимую помощь и направлен к врачу.',
            isFinal: true,
            actions: []
        },
        error1: {
            id: 'error1',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Вы наложили масло на ожог. Это может усугубить ситуацию.',
            isError: true,
            actions: []
        },
        error2: {
            id: 'error2',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Вы прокололи волдыри. Это увеличивает риск инфицирования.',
            isError: true,
            actions: []
        },
        error3: {
            id: 'error3',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Недостаточное охлаждение может привести к более глубокому повреждению тканей.',
            isError: true,
            actions: []
        },
        error4: {
            id: 'error4',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Использование льда может вызвать дополнительное повреждение тканей.',
            isError: true,
            actions: []
        },
        error5: {
            id: 'error5',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Открытый ожог подвержен риску инфицирования.',
            isError: true,
            actions: []
        },
        error6: {
            id: 'error6',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Тугая повязка может нарушить кровообращение.',
            isError: true,
            actions: []
        },
        error7: {
            id: 'error7',
            visualType: 'burn',
            visualState: 'critical',
            description: 'При серьезных ожогах необходима консультация врача.',
            isError: true,
            actions: []
        },
        error8: {
            id: 'error8',
            visualType: 'burn',
            visualState: 'critical',
            description: 'Частое снятие повязки может повредить заживающую кожу.',
            isError: true,
            actions: []
        }
    }
};

// Регистрация сценария
registerScenario(burnScenario);

