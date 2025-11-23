// ============================================
// Основной JavaScript файл для FirstAidSim
// ============================================

// Получение элементов DOM
const situationText = document.getElementById('situationText');
const actionsContainer = document.getElementById('actionsContainer');
const feedbackContainer = document.getElementById('feedbackContainer');
const feedbackText = document.getElementById('feedbackText');
const scenarioVisualization = document.getElementById('scenarioVisualization');
const progressFill = document.getElementById('progressFill');
const simulatorTitle = document.getElementById('simulatorTitle');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('currentYear');

// Текущий активный сценарий
let currentScenarioId = null;
let currentScenario = null;
let currentStepId = null; // Текущий шаг сценария

// Режим работы (training или exam)
let currentMode = 'training';

// История навигации
let navigationHistory = {
    previousPage: null,
    previousMode: null,
    scrollPosition: {}
};

// Таймер экзамена
let examTimer = null;
let examTimeLeft = 180; // 3 минуты в секундах
let examTimerInterval = null;

// Система обратной связи и подсчета очков
let gameState = {
    score: 100,              // Начальный счет
    correctActions: 0,       // Количество правильных действий
    incorrectActions: 0,    // Количество неправильных действий
    startTime: null,         // Время начала сценария
    endTime: null,           // Время завершения сценария
    actionHistory: [],       // История действий
    completedSteps: [],      // Выполненные шаги в порядке
    isOptimalOrder: true,    // Выполнен ли оптимальный порядок
    examStepsCompleted: 0,   // Количество уникальных правильно выполненных шагов в экзамене
    examCorrectSteps: []     // Массив уникальных правильно выполненных шагов в экзамене
};

// Объект для хранения всех сценариев (будет заполнен из отдельных файлов через scenarios-loader.js)
// Используем глобальный объект scenarios из scenarios-loader.js
var scenarios = window.scenarios || {};

// -------------------------------
// Навигация между страницами
// -------------------------------

/**
 * Переключает активную страницу с плавной анимацией
 * @param {string} pageId - ID страницы для отображения
 * @param {boolean} saveHistory - Сохранять ли историю навигации
 */
function showPage(pageId, saveHistory = true) {
    // Проверяем доступ к странице профиля
    if (pageId === 'profile') {
        const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!currentUser) {
            // Если пользователь не авторизован, показываем модальное окно входа
            if (typeof openLoginModal === 'function') {
                openLoginModal();
            }
            // Показываем уведомление
            if (typeof showNotification === 'function') {
                showNotification('Для просмотра профиля необходимо войти в систему', 'info');
            }
            return;
        }
    }
    
    // Сохраняем текущую позицию прокрутки
    const currentPage = document.querySelector('.page-section.active');
    if (currentPage && saveHistory) {
        navigationHistory.scrollPosition[currentPage.id] = window.scrollY;
    }
    
    // Сохраняем предыдущую страницу
    if (saveHistory && currentPage) {
        navigationHistory.previousPage = currentPage.id;
        navigationHistory.previousMode = currentMode;
    }
    
    // Скрываем все страницы
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => {
        page.classList.remove('active');
        // Убираем inline стили, которые могут мешать
        page.style.display = '';
        page.style.opacity = '';
        page.style.transform = '';
        page.style.visibility = '';
    });
    
    // Показываем выбранную страницу
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        // Сначала добавляем класс active для показа страницы
        targetPage.classList.add('active');
        
        // Восстанавливаем позицию прокрутки, если есть
        const savedPosition = navigationHistory.scrollPosition[pageId];
        if (savedPosition !== undefined) {
            window.scrollTo({ top: savedPosition, behavior: 'auto' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Анимация появления через requestAnimationFrame
        requestAnimationFrame(() => {
            targetPage.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        });
        
        // Загружаем профиль, если переключились на страницу профиля
        if (pageId === 'profile' && typeof loadProfile === 'function') {
            setTimeout(() => {
                loadProfile();
            }, 200);
        }
    }
    
    // Обновляем активную ссылку в навигации
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Закрываем мобильное меню
    if (mainNav) {
        mainNav.classList.remove('open');
    }
    
    // Обновляем видимость кнопки теории
    updateTheoryButtonVisibility();
}

// -------------------------------
// Функции симулятора
// -------------------------------

/**
 * Загружает сценарий по ID
 * @param {string} scenarioId - ID сценария
 */
function loadScenario(scenarioId) {
    const scenario = scenarios[scenarioId];
    
    if (!scenario) {
        console.error('Сценарий не найден:', scenarioId);
        return;
    }
    
    // Устанавливаем текущий сценарий
    currentScenarioId = scenarioId;
    currentScenario = scenario;
    
    // Сбрасываем состояние игры
    resetGameState();
    
    // Обновляем заголовок
    if (simulatorTitle) {
        simulatorTitle.textContent = `Сценарий: ${scenario.name}`;
    }
    
    // Обновляем видимость кнопки теории
    updateTheoryButtonVisibility();
    
    // Загружаем первый шаг
    loadStep(1);
}

/**
 * Обновляет видимость кнопки "Открыть теорию"
 */
function updateTheoryButtonVisibility() {
    const theoryButton = document.getElementById('theoryButton');
    if (theoryButton) {
        if (currentScenarioId) {
            theoryButton.style.display = 'inline-flex';
        } else {
            theoryButton.style.display = 'none';
        }
    }
}

/**
 * Открывает страницу теории для текущего сценария
 */
function openTheoryForScenario() {
    if (!currentScenarioId) return;
    
    // Маппинг ID сценариев на файлы теории
    const theoryMap = {
        'cpr': 'theory/cpr.html',
        'bleeding': 'theory/bleeding.html',
        'burn': 'theory/burn.html',
        'faint': 'theory/faint.html',
        'anaphylaxis': 'theory/anaphylaxis.html',
        'fracture': 'theory/fracture.html',
        'drowning': 'theory/drowning.html',
        'poisoning': 'theory/poisoning.html'
    };
    
    const theoryPath = theoryMap[currentScenarioId];
    if (theoryPath) {
        // Сохраняем состояние симулятора
        const simulatorState = {
            scenarioId: currentScenarioId,
            stepId: currentStepId,
            mode: currentMode,
            gameState: JSON.parse(JSON.stringify(gameState))
        };
        sessionStorage.setItem('simulatorState', JSON.stringify(simulatorState));
        
        // Открываем теорию в новой вкладке
        window.open(theoryPath, '_blank');
    }
}

/**
 * Сбрасывает состояние игры при начале нового сценария
 */
function resetGameState() {
    gameState.score = 100;
    gameState.correctActions = 0;
    gameState.incorrectActions = 0;
    gameState.startTime = Date.now();
    gameState.endTime = null;
    gameState.actionHistory = [];
    gameState.completedSteps = [];
    gameState.isOptimalOrder = true;
    gameState.examStepsCompleted = 0;
    gameState.examCorrectSteps = [];
    
    // Останавливаем таймер экзамена, если он был запущен
    stopExamTimer();
    
    // Настраиваем интерфейс в зависимости от режима
    if (currentMode === 'exam') {
        // Скрываем счет и прогресс, показываем экзаменационную панель
        const scoreProgressContainer = document.getElementById('scoreProgressContainer');
        const examPanel = document.getElementById('examPanel');
        if (scoreProgressContainer) scoreProgressContainer.classList.add('hidden');
        if (examPanel) {
            examPanel.classList.remove('hidden');
            updateExamSteps();
        }
        // Запускаем таймер экзамена
        startExamTimer();
    } else {
        // Показываем счет и прогресс, скрываем экзаменационную панель
        const scoreProgressContainer = document.getElementById('scoreProgressContainer');
        const examPanel = document.getElementById('examPanel');
        if (scoreProgressContainer) scoreProgressContainer.classList.remove('hidden');
        if (examPanel) examPanel.classList.add('hidden');
    }
    
    // Обновляем отображение счета
    updateScoreDisplay();
    
    // Скрываем отчет и сертификат
    hideFinalReport();
    hideCertificate();
}

/**
 * Запускает таймер экзамена
 */
function startExamTimer() {
    examTimeLeft = 180; // 3 минуты
    updateExamTimerDisplay();
    
    examTimerInterval = setInterval(() => {
        examTimeLeft--;
        updateExamTimerDisplay();
        
        if (examTimeLeft <= 0) {
            stopExamTimer();
            finishExam('timeout');
        }
    }, 1000);
}

/**
 * Останавливает таймер экзамена
 */
function stopExamTimer() {
    if (examTimerInterval) {
        clearInterval(examTimerInterval);
        examTimerInterval = null;
    }
}

/**
 * Обновляет отображение таймера экзамена
 */
function updateExamTimerDisplay() {
    const timerElement = document.getElementById('examTimer');
    if (!timerElement) return;
    
    const minutes = Math.floor(examTimeLeft / 60);
    const seconds = examTimeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timerElement.textContent = timeString;
    
    // Краснеет при малом времени (менее 30 секунд)
    if (examTimeLeft <= 30) {
        timerElement.classList.add('timer-warning');
    } else {
        timerElement.classList.remove('timer-warning');
    }
}

/**
 * Обновляет отображение количества выполненных шагов в экзамене
 */
function updateExamSteps() {
    const stepsElement = document.getElementById('examSteps');
    if (stepsElement) {
        stepsElement.textContent = gameState.examStepsCompleted;
    }
}

/**
 * Завершает экзамен досрочно или по истечении времени
 */
function finishExam(reason = 'manual') {
    stopExamTimer();
    gameState.endTime = Date.now();
    
    // Если завершено по таймауту, показываем сообщение
    if (reason === 'timeout') {
        alert('Время вышло! Экзамен завершен.');
    }
    
    // Показываем финальный отчет
    showFinalReport();
}

/**
 * Обновляет прогресс-бар
 * @param {number|string} stepId - ID текущего шага
 */
function updateProgress(stepId) {
    if (!progressFill || !currentScenario) return;
    
    const index = currentScenario.order.indexOf(Number(stepId));
    if (index === -1) {
        progressFill.style.width = '0%';
        return;
    }
    
    const progressPercent = currentScenario.order.length > 1
        ? (index / (currentScenario.order.length - 1)) * 100
        : 100;
    
    progressFill.style.width = `${progressPercent}%`;
}

/**
 * Загружает и отображает шаг сценария
 * @param {number|string} stepId - ID шага для загрузки
 */
function loadStep(stepId) {
    if (!currentScenario) {
        console.error('Сценарий не загружен');
        return;
    }
    
    const step = currentScenario.steps[stepId];
    
    if (!step) {
        console.error('Шаг не найден:', stepId);
        return;
    }
    
    // Сохраняем текущий шаг
    currentStepId = stepId;
    
    // Переключаемся на страницу симулятора
    showPage('simulator');
    
    // Обновляем визуализацию
    if (step.visualType && step.visualState) {
        updateVisualization(step.visualType, step.visualState);
    }
    
    // Обновляем описание ситуации
    updateSituationText(step.description);
    
    // Обновляем прогресс
    updateProgress(stepId);
    
    // Очищаем контейнеры
    clearActions();
    hideFeedback();
    
    // Восстанавливаем кнопки действий сразу
    if (actionsContainer) {
        actionsContainer.innerHTML = '';
    }
    
    // Используем requestAnimationFrame для плавного обновления
    requestAnimationFrame(() => {
        
        // Если это финальный шаг (успешное завершение)
        if (step.isFinal) {
            gameState.endTime = Date.now();
            stopExamTimer();
            
            // Проверяем оптимальный порядок и добавляем бонус (только в режиме обучения)
            if (currentMode === 'training' && gameState.isOptimalOrder && gameState.incorrectActions === 0) {
                gameState.score += 20;
                updateScoreDisplay();
            }
            
            // В режиме обучения показываем обратную связь
            if (currentMode === 'training') {
                showFeedback(`Поздравляем! Вы успешно прошли сценарий "${currentScenario.name}". Вы правильно оказали первую помощь.`, 'success');
            }
            
            // Показываем финальный отчет
            setTimeout(() => {
                showFinalReport();
                
                // В режиме экзамена показываем сертификат, если экзамен сдан
                if (currentMode === 'exam') {
                    const grade = calculateExamGrade();
                    if (grade && grade !== 'Не сдал') {
                        setTimeout(() => {
                            showCertificate(grade);
                        }, 1000);
                    }
                }
            }, currentMode === 'exam' ? 0 : 2000);
            
            addActionButton('Начать заново', () => {
                loadStep(1);
            });
            return;
        }
        
        // Если это состояние ошибки
        if (step.isError) {
            showFeedback('К сожалению, вы допустили ошибку. Попробуйте еще раз.', 'error');
            addActionButton('Начать заново', () => {
                loadStep(1);
            });
            return;
        }
        
        // Создаем кнопки для каждого действия (без указания правильности)
        // Перемешиваем варианты ответов для случайного порядка
        const shuffledActions = shuffleArray([...step.actions]);
        shuffledActions.forEach(action => {
            addActionButton(action.text, () => {
                handleActionClick(action, stepId);
            });
        });
    });
}

/**
 * Обрабатывает клик по действию
 * @param {Object} action - Объект действия
 * @param {number|string} currentStepId - ID текущего шага
 */
function handleActionClick(action, currentStepId) {
    // Находим кнопку, по которой кликнули, и добавляем визуальную обратную связь
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach(btn => {
        btn.disabled = true; // Отключаем все кнопки после клика
        if (btn.textContent === action.text) {
            // Подсвечиваем нажатую кнопку
            if (action.isCorrect) {
                btn.classList.add('action-button-clicked-correct');
            } else {
                btn.classList.add('action-button-clicked-incorrect');
            }
        }
    });
    
    // Обновляем состояние игры
    let pointsEarned = 0;
    let isOptimalStep = false;
    
    if (action.isCorrect) {
        // Правильное действие
        gameState.correctActions++;
        pointsEarned = 5;
        gameState.score += pointsEarned;
        
        // Проверяем оптимальный порядок
        if (typeof currentStepId === 'number' && !currentStepId.toString().startsWith('error')) {
            const expectedStep = currentScenario.order[gameState.completedSteps.length];
            if (currentStepId === expectedStep) {
                isOptimalStep = true;
            } else {
                gameState.isOptimalOrder = false;
            }
            // Добавляем шаг только если его еще нет в списке
            if (!gameState.completedSteps.includes(currentStepId)) {
                gameState.completedSteps.push(currentStepId);
            }
        }
        
        // В экзаменационном режиме отслеживаем уникальные правильно выполненные шаги
        if (currentMode === 'exam') {
            // Добавляем шаг только если его еще нет в списке правильно выполненных
            if (typeof currentStepId === 'number' && !currentStepId.toString().startsWith('error')) {
                if (!gameState.examCorrectSteps.includes(currentStepId)) {
                    gameState.examCorrectSteps.push(currentStepId);
                    gameState.examStepsCompleted = gameState.examCorrectSteps.length;
                    updateExamSteps();
                }
            }
        }
        
        // Показываем мгновенную обратную связь только в режиме обучения
        if (currentMode === 'training') {
            showInstantFeedback(action.feedback, true, pointsEarned, isOptimalStep);
        } else {
            // В экзамене скрываем обратную связь
            hideFeedback();
        }
        
        // Переходим к следующему шагу после задержки для показа обратной связи
        const delay = currentMode === 'exam' ? 500 : 5000;
        setTimeout(() => {
            if (action.nextStepId) {
                loadStep(action.nextStepId);
            }
        }, delay);
    } else {
        // Неправильное действие
        gameState.incorrectActions++;
        pointsEarned = -10;
        gameState.score += pointsEarned;
        gameState.isOptimalOrder = false;
        
        // В экзаменационном режиме неправильные действия не засчитываются как выполненные шаги
        
        // Показываем мгновенную обратную связь только в режиме обучения
        if (currentMode === 'training') {
            showInstantFeedback(action.feedback, false, pointsEarned, false);
        } else {
            // В экзамене скрываем обратную связь
            hideFeedback();
        }
        
        // Если есть специальный шаг ошибки, переходим к нему
        const delay = currentMode === 'exam' ? 500 : 5000;
        if (action.errorStepId) {
            setTimeout(() => {
                loadStep(action.errorStepId);
            }, delay);
        } else {
            // Иначе просто показываем ошибку и предлагаем начать заново
            setTimeout(() => {
                clearActions();
                addActionButton('Начать заново', () => {
                    loadStep(1);
                });
            }, delay);
        }
    }
    
    // Сохраняем действие в историю
    gameState.actionHistory.push({
        stepId: currentStepId,
        action: action.text,
        isCorrect: action.isCorrect,
        points: pointsEarned,
        timestamp: Date.now()
    });
    
    // Обновляем отображение счета
    updateScoreDisplay();
}

// -------------------------------
// Вспомогательные функции
// -------------------------------
/**
 * Обновляет текст описания ситуации
 * @param {string} text - Текст описания
 */
function updateSituationText(text) {
    if (situationText) {
        situationText.textContent = text;
    }
}

/**
 * Очищает контейнер с кнопками действий
 */
function clearActions() {
    if (actionsContainer) {
        actionsContainer.innerHTML = '';
    }
}

/**
 * Добавляет кнопку действия в контейнер
 * @param {string} text - Текст кнопки
 * @param {Function} onClick - Функция обработчик клика
 */
function addActionButton(text, onClick) {
    if (!actionsContainer) return;

    const button = document.createElement('button');
    button.className = 'action-button';
    button.textContent = text;
    button.addEventListener('click', onClick);
    actionsContainer.appendChild(button);
}

/**
 * Показывает обратную связь
 * @param {string} message - Текст обратной связи
 * @param {string} type - Тип обратной связи ('success' или 'error')
 */
function showFeedback(message, type = 'success') {
    if (!feedbackContainer || !feedbackText) return;

    feedbackContainer.classList.remove('hidden', 'success', 'error');
    feedbackContainer.classList.add(type);
    feedbackText.textContent = message;
}

/**
 * Показывает мгновенную обратную связь с баллами
 * @param {string} message - Текст обратной связи
 * @param {boolean} isCorrect - Правильно ли действие
 * @param {number} points - Баллы за действие
 * @param {boolean} isOptimal - Оптимальный ли порядок шага
 */
function showInstantFeedback(message, isCorrect, points, isOptimal) {
    if (!feedbackContainer || !feedbackText) return;
    
    const icon = isCorrect ? '✅' : '❌';
    const pointsText = points > 0 ? `+${points}` : `${points}`;
    const optimalBonus = isOptimal ? ' (Оптимальный порядок!)' : '';
    
    feedbackContainer.classList.remove('hidden', 'success', 'error');
    feedbackContainer.classList.add(isCorrect ? 'success' : 'error');
    
    feedbackText.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span class="feedback-icon">${icon}</span>
            <span class="feedback-message">${message}</span>
        </div>
        <div class="feedback-points ${isCorrect ? 'points-positive' : 'points-negative'}">${pointsText} баллов${optimalBonus}</div>
    `;
}

/**
 * Обновляет отображение текущего счета
 */
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = gameState.score;
        
        // Добавляем анимацию изменения
        scoreDisplay.classList.add('score-updated');
        setTimeout(() => {
            scoreDisplay.classList.remove('score-updated');
        }, 500);
    }
}

/**
 * Показывает финальный отчет
 */
function showFinalReport() {
    const reportContainer = document.getElementById('finalReport');
    if (!reportContainer) return;
    
    const timeElapsed = gameState.endTime - gameState.startTime;
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = Math.floor((timeElapsed % 60000) / 1000);
    const timeString = `${minutes} мин ${seconds} сек`;
    
    const totalActions = gameState.correctActions + gameState.incorrectActions;
    const accuracy = totalActions > 0 ? Math.round((gameState.correctActions / totalActions) * 100) : 0;
    
    // В режиме экзамена показываем оценку
    let examGradeHtml = '';
    let grade = null;
    if (currentMode === 'exam') {
        grade = calculateExamGrade();
        examGradeHtml = `
            <div class="report-grade">
                <div class="stat-label">Оценка</div>
                <div class="stat-value grade-${grade.toLowerCase().replace(' ', '-')}">${grade}</div>
            </div>
        `;
    }
    
    // Определяем рекомендации
    const recommendations = generateRecommendations();
    
    reportContainer.innerHTML = `
        <div class="report-header">
            <h3>📊 Итоговый отчет${currentMode === 'exam' ? ' (Экзамен)' : ''}</h3>
        </div>
        <div class="report-content">
            ${currentMode === 'training' ? `
            <div class="report-stat">
                <div class="stat-label">Общий счет</div>
                <div class="stat-value score-value">${gameState.score} баллов</div>
            </div>
            ` : ''}
            <div class="report-stats-grid">
                ${currentMode === 'exam' ? examGradeHtml : ''}
                <div class="report-stat">
                    <div class="stat-label">Правильных действий</div>
                    <div class="stat-value stat-correct">${gameState.correctActions}</div>
                </div>
                <div class="report-stat">
                    <div class="stat-label">Неправильных действий</div>
                    <div class="stat-value stat-incorrect">${gameState.incorrectActions}</div>
                </div>
                <div class="report-stat">
                    <div class="stat-label">Точность</div>
                    <div class="stat-value">${accuracy}%</div>
                </div>
                <div class="report-stat">
                    <div class="stat-label">Время прохождения</div>
                    <div class="stat-value">${timeString}</div>
                </div>
                ${currentMode === 'exam' ? `
                <div class="report-stat">
                    <div class="stat-label">Выполнено шагов</div>
                    <div class="stat-value">${gameState.examStepsCompleted}</div>
                </div>
                ` : ''}
            </div>
            ${currentMode === 'training' && gameState.isOptimalOrder && gameState.incorrectActions === 0 ? 
                '<div class="report-bonus">🎯 Бонус за оптимальный порядок: +20 баллов</div>' : ''}
            ${currentMode === 'training' ? `
            <div class="report-recommendations">
                <h4>💡 Рекомендации для улучшения:</h4>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `;
    
    reportContainer.classList.remove('hidden');
    
    // Сохраняем результаты в профиль пользователя, если авторизован
    if (currentScenarioId && typeof saveScenarioResults === 'function') {
        const timeSpent = Math.floor(timeElapsed / 1000); // в секундах
        saveScenarioResults(currentScenarioId, {
            score: gameState.score,
            correctActions: gameState.correctActions,
            incorrectActions: gameState.incorrectActions,
            timeSpent: timeSpent,
            mode: currentMode,
            grade: grade
        });
    }
    
    // Прокручиваем к отчету
    setTimeout(() => {
        reportContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Вычисляет оценку за экзамен (ПЕРЕДЕЛАННАЯ СИСТЕМА - по фактическим действиям)
 * @returns {string} Оценка: "Не сдал", "Удовлетворительно", "Хорошо", "Отлично"
 */
function calculateExamGrade() {
    // Базовые проверки
    if (!currentScenario) {
        return 'Не сдал';
    }
    
    // Вычисляем общее количество действий
    const totalActions = gameState.correctActions + gameState.incorrectActions;
    
    // Если нет действий вообще, экзамен не сдан
    if (totalActions === 0) {
        return 'Не сдал';
    }
    
    // Вычисляем точность (процент правильных действий от всех действий)
    const accuracy = totalActions > 0 ? (gameState.correctActions / totalActions) * 100 : 0;
    
    // Подсчитываем количество уникальных правильно выполненных шагов
    const uniqueCorrectSteps = gameState.examCorrectSteps.length;
    
    // НОВАЯ СИСТЕМА ОЦЕНКИ - основана на фактических действиях:
    // Оцениваем по количеству правильных действий, точности и отсутствию ошибок
    // Не используем order из теории, так как в сценариях действия могут быть объединены
    
    // ОТЛИЧНО:
    // - Все действия правильные (100% точность)
    // - Нет неправильных действий (0 ошибок)
    // - Выполнено минимум 3 правильных действия (показывает понимание алгоритма)
    if (accuracy === 100 && gameState.incorrectActions === 0 && gameState.correctActions >= 3) {
        return 'Отлично';
    }
    
    // ХОРОШО:
    // - Точность >= 85%
    // - Не более 1 неправильного действия
    // - Выполнено минимум 3 правильных действия
    if (accuracy >= 85 && gameState.incorrectActions <= 1 && gameState.correctActions >= 3) {
        return 'Хорошо';
    }
    
    // УДОВЛЕТВОРИТЕЛЬНО:
    // - Точность >= 70%
    // - Не более 2 неправильных действий
    // - Выполнено минимум 2 правильных действия
    if (accuracy >= 70 && gameState.incorrectActions <= 2 && gameState.correctActions >= 2) {
        return 'Удовлетворительно';
    }
    
    // НЕ СДАЛ:
    // - Точность < 70% ИЛИ
    // - Более 2 неправильных действий ИЛИ
    // - Меньше 2 правильных действий
    return 'Не сдал';
}

/**
 * Показывает сертификат после успешной сдачи экзамена
 * @param {string} grade - Оценка за экзамен
 */
function showCertificate(grade) {
    const certificateContainer = document.getElementById('certificateContainer');
    if (!certificateContainer) return;
    
    const today = new Date();
    const dateString = today.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Получаем данные пользователя для сертификата
    let participantName = 'Участник экзамена';
    if (typeof getUserData === 'function') {
        const userData = getUserData();
        if (userData && userData.profile) {
            const firstName = userData.profile.firstName || '';
            const lastName = userData.profile.lastName || '';
            const middleName = userData.profile.middleName || '';
            
            // Формируем полное имя: Фамилия Имя Отчество
            if (lastName && firstName) {
                participantName = `${lastName} ${firstName}`;
                if (middleName) {
                    participantName += ` ${middleName}`;
                }
            } else if (firstName) {
                participantName = firstName;
            } else if (lastName) {
                participantName = lastName;
            } else if (userData.profile.name) {
                participantName = userData.profile.name;
            }
        }
    }
    
    const totalActions = gameState.correctActions + gameState.incorrectActions;
    const accuracy = totalActions > 0 ? Math.round((gameState.correctActions / totalActions) * 100) : 0;
    
    certificateContainer.innerHTML = `
        <div class="certificate">
            <div class="certificate-header">
                <h2>🎓 СЕРТИФИКАТ</h2>
                <p class="certificate-subtitle">О прохождении экзамена по оказанию первой помощи</p>
            </div>
            <div class="certificate-body">
                <p class="certificate-text">
                    Настоящим подтверждается, что
                </p>
                <p class="certificate-name">
                    ${participantName}
                </p>
                <p class="certificate-text">
                    успешно прошел экзамен по сценарию
                </p>
                <p class="certificate-scenario">
                    "${currentScenario.name}"
                </p>
                <p class="certificate-grade">
                    с оценкой <span class="grade-badge grade-${grade.toLowerCase().replace(' ', '-')}">${grade}</span>
                </p>
            </div>
            <div class="certificate-footer">
                <div class="certificate-date">
                    Дата: ${dateString}
                </div>
                <div class="certificate-stats">
                    <div>Правильных действий: ${gameState.correctActions}</div>
                    <div>Точность: ${accuracy}%</div>
                </div>
            </div>
            <button class="certificate-print-button" onclick="window.print()">🖨️ Печать сертификата</button>
        </div>
    `;
    
    certificateContainer.classList.remove('hidden');
    
    // Прокручиваем к сертификату
    setTimeout(() => {
        certificateContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Скрывает сертификат
 */
function hideCertificate() {
    const certificateContainer = document.getElementById('certificateContainer');
    if (certificateContainer) {
        certificateContainer.classList.add('hidden');
    }
}

/**
 * Генерирует рекомендации на основе результатов
 */
function generateRecommendations() {
    const recommendations = [];
    
    if (gameState.incorrectActions > 0) {
        recommendations.push('Повторите теорию по алгоритмам оказания первой помощи');
    }
    
    if (gameState.incorrectActions > gameState.correctActions) {
        recommendations.push('Рекомендуем пройти сценарий еще раз для закрепления навыков');
    }
    
    if (!gameState.isOptimalOrder) {
        recommendations.push('Обратите внимание на правильную последовательность действий');
    }
    
    if (gameState.score < 100) {
        recommendations.push('Старайтесь избегать ошибок - каждая ошибка снижает ваш счет');
    }
    
    if (gameState.correctActions === 0 && gameState.incorrectActions > 0) {
        recommendations.push('Изучите раздел "Теория" перед прохождением сценария');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Отличная работа! Вы показали превосходные знания');
        recommendations.push('Попробуйте пройти другие сценарии для расширения навыков');
    }
    
    return recommendations;
}

/**
 * Скрывает финальный отчет
 */
function hideFinalReport() {
    const reportContainer = document.getElementById('finalReport');
    if (reportContainer) {
        reportContainer.classList.add('hidden');
    }
}

/**
 * Скрывает обратную связь
 */
function hideFeedback() {
    if (feedbackContainer) {
        feedbackContainer.classList.add('hidden');
    }
}

// -------------------------------
// Управление режимами
// -------------------------------

/**
 * Переключает режим работы (обучение/экзамен)
 * @param {string} mode - Режим: 'training' или 'exam'
 */
function setMode(mode) {
    currentMode = mode;
    
    // Обновляем визуальное состояние переключателя
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        if (option.getAttribute('data-mode') === mode) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

/**
 * Инициализирует переключатель режимов
 */
function initModeSelector() {
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.getAttribute('data-mode');
            setMode(mode);
        });
    });
}

// -------------------------------
// Вспомогательные функции
// -------------------------------

/**
 * Перемешивает массив в случайном порядке (алгоритм Фишера-Йетса)
 * @param {Array} array - Массив для перемешивания
 * @returns {Array} Перемешанный массив
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Обновляет текст описания ситуации
 * @param {string} text - Текст описания
 */
function updateSituationText(text) {
    if (situationText) {
        situationText.textContent = text;
    }
}

// -------------------------------
// Инициализация приложения
// -------------------------------

document.addEventListener('DOMContentLoaded', function() {
    console.log('FirstAidSim инициализирован');
    
    // Устанавливаем текущий год
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Устанавливаем год в футере
    const currentYearFooter = document.getElementById('currentYearFooter');
    if (currentYearFooter) {
        currentYearFooter.textContent = new Date().getFullYear();
    }
    
    // Инициализация переключателя режимов
    initModeSelector();
    
    // Инициализация навигации
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });
    
    // Гамбургер-меню
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
        
        // Закрываем меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
            });
        });
    }
    
    // Кнопки навигации (CTA, сценарии)
    const ctaButtons = document.querySelectorAll('[data-page]');
    ctaButtons.forEach(button => {
        if (button.tagName === 'BUTTON') {
            button.addEventListener('click', () => {
                const pageId = button.getAttribute('data-page');
                if (pageId) {
                    showPage(pageId);
                }
            });
        }
    });
    
    // Кнопки "Начать" для всех сценариев
    const startButtons = document.querySelectorAll('[data-start-scenario]');
    startButtons.forEach(button => {
        button.addEventListener('click', () => {
            const scenarioId = button.getAttribute('data-start-scenario');
            if (scenarioId) {
                loadScenario(scenarioId);
            }
        });
    });
    
    // Кнопка "Завершить досрочно" в экзамене
    const examFinishButton = document.getElementById('examFinishButton');
    if (examFinishButton) {
        examFinishButton.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите завершить экзамен досрочно?')) {
                finishExam('manual');
            }
        });
    }
    
    // Кнопка "Открыть теорию"
    const theoryButton = document.getElementById('theoryButton');
    if (theoryButton) {
        theoryButton.addEventListener('click', () => {
            openTheoryForScenario();
        });
    }
    
    // Кнопка "Вернуться к сценариям" с сохранением режима
    const backToScenariosButton = document.getElementById('backToScenariosButton');
    if (backToScenariosButton) {
        backToScenariosButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Сохраняем текущий режим
            const savedMode = currentMode;
            showPage('scenarios');
            // Восстанавливаем режим после небольшой задержки
            setTimeout(() => {
                setMode(savedMode);
            }, 100);
        });
    }
    
    // Горячие клавиши для навигации
    document.addEventListener('keydown', (e) => {
        // Escape - вернуться к сценариям из симулятора
        if (e.key === 'Escape' && currentScenarioId) {
            const backButton = document.getElementById('backToScenariosButton');
            if (backButton) {
                backButton.click();
            }
        }
        // T - открыть теорию (если в симуляторе)
        if ((e.key === 't' || e.key === 'T') && e.ctrlKey && currentScenarioId) {
            e.preventDefault();
            openTheoryForScenario();
        }
    });
    
    // Восстанавливаем состояние симулятора из sessionStorage при возврате
    window.addEventListener('focus', () => {
        const savedState = sessionStorage.getItem('simulatorState');
        if (savedState && !currentScenarioId) {
            try {
                const state = JSON.parse(savedState);
                // Можно предложить пользователю вернуться к прерванному сценарию
                // Пока просто очищаем сохраненное состояние
                sessionStorage.removeItem('simulatorState');
            } catch (e) {
                console.error('Ошибка восстановления состояния:', e);
            }
        }
    });
    
    // Инициализация системы аутентификации
    initAuthHandlers();
    
    // Обновляем UI авторизации (с небольшой задержкой для гарантии загрузки DOM)
    setTimeout(() => {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    }, 100);
    
    // Показываем главную страницу по умолчанию
    // Проверяем, есть ли уже активная страница
    const activePage = document.querySelector('.page-section.active');
    if (!activePage || activePage.id !== 'home') {
        showPage('home', false);
    } else {
        // Если главная страница уже активна, просто обновляем навигацию
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === 'home') {
                link.classList.add('active');
            }
        });
    }
    
    // Проверяем хеш в URL для автоматического перехода
    const hash = window.location.hash.replace('#', '');
    if (hash === 'theory') {
        setTimeout(() => {
            showPage('theory', false);
        }, 100);
    }
    
    // Проверяем, нужно ли автоматически открыть страницу теории
    const openTheoryPage = sessionStorage.getItem('openTheoryPage');
    if (openTheoryPage) {
        sessionStorage.removeItem('openTheoryPage');
        // Переключаемся на страницу теории
        setTimeout(() => {
            showPage('theory', false);
        }, 100);
    }
    
    // Проверяем, нужно ли автоматически запустить сценарий (из теории)
    const autoStartScenario = sessionStorage.getItem('autoStartScenario');
    if (autoStartScenario) {
        sessionStorage.removeItem('autoStartScenario');
        // Переключаемся на страницу сценариев
        showPage('scenarios', false);
        // Небольшая задержка для плавного перехода
        setTimeout(() => {
            loadScenario(autoStartScenario);
        }, 300);
    }
});

// ============================================
// Обработчики аутентификации
// ============================================

/**
 * Инициализация обработчиков форм аутентификации
 */
function initAuthHandlers() {
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Закрытие модальных окон по клику вне их
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Обработка входа
 */
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Очистка предыдущих ошибок
    clearFormErrors('loginForm');
    
    const result = loginUser(email, password);
    
    if (result.success) {
        closeLoginModal();
        // Обновляем UI с небольшой задержкой для гарантии обновления
        setTimeout(() => {
            if (typeof updateAuthUI === 'function') {
                updateAuthUI();
            }
        }, 100);
        showNotification('Вход выполнен успешно!', 'success');
    } else {
        showFormError('loginEmailError', result.message);
    }
}

/**
 * Обработка регистрации
 */
function handleRegister() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Очистка предыдущих ошибок
    clearFormErrors('registerForm');
    
    const result = registerUser(email, password, confirmPassword);
    
    if (result.success) {
        closeRegisterModal();
        // Автоматически входим после регистрации
        const loginResult = loginUser(email, password);
        if (loginResult.success) {
            // Обновляем UI с небольшой задержкой для гарантии обновления
            setTimeout(() => {
                if (typeof updateAuthUI === 'function') {
                    updateAuthUI();
                }
            }, 100);
            showNotification('Регистрация успешна! Добро пожаловать!', 'success');
        } else {
            // Обновляем UI даже если автовход не удался
            setTimeout(() => {
                if (typeof updateAuthUI === 'function') {
                    updateAuthUI();
                }
            }, 100);
            showNotification('Регистрация успешна! Теперь войдите в систему.', 'info');
        }
    } else {
        // Определяем, в каком поле показать ошибку
        if (result.message.includes('email') || result.message.includes('Email')) {
            showFormError('registerEmailError', result.message);
        } else if (result.message.includes('парол')) {
            showFormError('registerPasswordError', result.message);
        } else {
            showFormError('registerConfirmPasswordError', result.message);
        }
    }
}

/**
 * Показ ошибки в форме
 */
function showFormError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Очистка ошибок формы
 */
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const errors = form.querySelectorAll('.form-error');
        errors.forEach(error => {
            error.textContent = '';
        });
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
}

/**
 * Показ уведомления
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Открытие модального окна входа
 */
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Фокус на первое поле
        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }
}

// Делаем функцию доступной глобально
window.openLoginModal = openLoginModal;

/**
 * Закрытие модального окна входа
 */
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
            clearFormErrors('loginForm');
        }
    }
}

// Делаем функцию доступной глобально
window.closeLoginModal = closeLoginModal;

/**
 * Открытие модального окна регистрации
 */
function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Фокус на первое поле
        setTimeout(() => {
            const emailInput = document.getElementById('registerEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }
}

// Делаем функцию доступной глобально
window.openRegisterModal = openRegisterModal;

/**
 * Закрытие модального окна регистрации
 */
function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        const form = document.getElementById('registerForm');
        if (form) {
            form.reset();
            clearFormErrors('registerForm');
        }
    }
}

// Делаем функцию доступной глобально
window.closeRegisterModal = closeRegisterModal;

/**
 * Закрытие всех модальных окон
 */
function closeAllModals() {
    closeLoginModal();
    closeRegisterModal();
}
