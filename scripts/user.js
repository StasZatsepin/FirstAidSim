// ============================================
// Управление пользователем и профилем
// ============================================

/**
 * Управление данными пользователя, прогрессом и статистикой
 */

// Используем STORAGE_KEYS из auth.js, если он не определен - создаем
if (typeof STORAGE_KEYS === 'undefined') {
    var STORAGE_KEYS = {
        USERS: 'firstAidSim_users',
        CURRENT_USER: 'firstAidSim_currentUser'
    };
}

/**
 * Получение полных данных пользователя
 * @returns {Object|null} Данные пользователя
 */
function getUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    return users[currentUser.email] || null;
}

/**
 * Сохранение данных пользователя
 * @param {Object} userData - Данные пользователя
 */
function saveUserData(userData) {
    if (!userData || !userData.email) return;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    users[userData.email] = userData;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Обновляем текущего пользователя
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.email === userData.email) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
            id: userData.id,
            email: userData.email,
            profile: userData.profile
        }));
    }
}

/**
 * Обновление профиля пользователя
 * @param {Object} updates - Обновления профиля
 */
function updateUserProfile(updates) {
    const userData = getUserData();
    if (!userData) return false;
    
    if (updates.name) {
        userData.profile.name = updates.name;
    }
    
    if (updates.firstName !== undefined) {
        userData.profile.firstName = updates.firstName;
    }
    
    if (updates.lastName !== undefined) {
        userData.profile.lastName = updates.lastName;
    }
    
    if (updates.middleName !== undefined) {
        userData.profile.middleName = updates.middleName;
    }
    
    if (updates.birthDate !== undefined) {
        userData.profile.birthDate = updates.birthDate;
    }
    
    if (updates.phone !== undefined) {
        userData.profile.phone = updates.phone;
    }
    
    if (updates.organization !== undefined) {
        userData.profile.organization = updates.organization;
    }
    
    if (updates.position !== undefined) {
        userData.profile.position = updates.position;
    }
    
    if (updates.avatar !== undefined) {
        userData.profile.avatar = updates.avatar;
    }
    
    if (updates.settings) {
        userData.profile.settings = { ...userData.profile.settings, ...updates.settings };
    }
    
    saveUserData(userData);
    updateAuthUI();
    return true;
}

/**
 * Сохранение результатов прохождения сценария
 * @param {string} scenarioId - ID сценария
 * @param {Object} results - Результаты прохождения
 */
function saveScenarioResults(scenarioId, results) {
    const userData = getUserData();
    if (!userData) return;
    
    const {
        score = 0,
        correctActions = 0,
        incorrectActions = 0,
        timeSpent = 0,
        mode = 'training',
        grade = null
    } = results;
    
    // Обновляем статистику
    userData.statistics.totalScenarios += 1;
    userData.statistics.correctActions += correctActions;
    userData.statistics.incorrectActions += incorrectActions;
    userData.statistics.timeSpent += timeSpent;
    userData.statistics.totalScore += score;
    userData.statistics.averageScore = Math.round(
        userData.statistics.totalScore / userData.statistics.totalScenarios
    );
    
    if (score > userData.statistics.bestScore) {
        userData.statistics.bestScore = score;
    }
    
    // Добавляем запись о прохождении
    const scenarioRecord = {
        scenarioId: scenarioId,
        date: new Date().toISOString(),
        score: score,
        correctActions: correctActions,
        incorrectActions: incorrectActions,
        timeSpent: timeSpent,
        mode: mode,
        grade: grade
    };
    
    // Проверяем, проходил ли пользователь этот сценарий ранее
    const existingIndex = userData.profile.scenariosCompleted.findIndex(
        s => s.scenarioId === scenarioId
    );
    
    if (existingIndex >= 0) {
        // Обновляем существующую запись, если новый результат лучше
        const existing = userData.profile.scenariosCompleted[existingIndex];
        if (score > existing.score || (score === existing.score && correctActions > existing.correctActions)) {
            userData.profile.scenariosCompleted[existingIndex] = scenarioRecord;
        }
    } else {
        // Добавляем новую запись
        userData.profile.scenariosCompleted.push(scenarioRecord);
    }
    
    // Обновляем опыт и уровень
    const experienceGained = calculateExperience(score, correctActions, incorrectActions);
    userData.profile.experience += experienceGained;
    userData.profile.totalScore += score;
    
    // Проверяем повышение уровня
    const newLevel = calculateLevel(userData.profile.experience);
    if (newLevel > userData.profile.level) {
        userData.profile.level = newLevel;
        // Уведомление о повышении уровня будет показано через achievements.js
    }
    
    // Сохраняем сертификат, если экзамен сдан
    if (mode === 'exam' && grade && grade !== 'Не сдал') {
        const certificate = {
            scenarioId: scenarioId,
            date: new Date().toISOString(),
            grade: grade,
            score: score
        };
        
        const certExists = userData.profile.certificates.some(
            c => c.scenarioId === scenarioId && c.grade === grade
        );
        
        if (!certExists) {
            userData.profile.certificates.push(certificate);
        }
    }
    
    saveUserData(userData);
    
    // Проверяем достижения
    if (typeof checkAchievements === 'function') {
        checkAchievements(userData);
    }
}

/**
 * Расчет опыта за прохождение сценария
 * @param {number} score - Счет
 * @param {number} correctActions - Правильные действия
 * @param {number} incorrectActions - Неправильные действия
 * @returns {number} Опыт
 */
function calculateExperience(score, correctActions, incorrectActions) {
    let exp = Math.floor(score / 10); // Базовый опыт от счета
    exp += correctActions * 5; // +5 за каждое правильное действие
    exp -= incorrectActions * 2; // -2 за каждое неправильное действие
    return Math.max(0, exp); // Минимум 0
}

/**
 * Расчет уровня на основе опыта
 * @param {number} experience - Опыт
 * @returns {number} Уровень
 */
function calculateLevel(experience) {
    // Формула: уровень = sqrt(опыт / 100) + 1
    return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Получение прогресса до следующего уровня
 * @returns {Object} {current: number, next: number, progress: number}
 */
function getLevelProgress() {
    const userData = getUserData();
    if (!userData) return { current: 0, next: 0, progress: 0 };
    
    const currentLevel = userData.profile.level;
    const currentExp = userData.profile.experience;
    
    // Опыт для текущего уровня
    const expForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    // Опыт для следующего уровня
    const expForNextLevel = Math.pow(currentLevel, 2) * 100;
    
    const expInCurrentLevel = currentExp - expForCurrentLevel;
    const expNeededForNextLevel = expForNextLevel - expForCurrentLevel;
    
    const progress = Math.min(100, Math.round((expInCurrentLevel / expNeededForNextLevel) * 100));
    
    return {
        current: expInCurrentLevel,
        next: expNeededForNextLevel,
        progress: progress
    };
}

/**
 * Получение статистики пользователя
 * @returns {Object} Статистика
 */
function getUserStatistics() {
    const userData = getUserData();
    if (!userData) {
        return {
            totalScenarios: 0,
            scenariosCompleted: 0,
            correctActions: 0,
            averageScore: 0,
            bestScore: 0,
            certificates: 0,
            level: 1,
            experience: 0,
            achievements: 0
        };
    }
    
    return {
        ...userData.statistics,
        level: userData.profile.level,
        experience: userData.profile.experience,
        scenariosCompleted: userData.profile.scenariosCompleted.length,
        certificates: userData.profile.certificates.length,
        achievements: userData.profile.achievements.length
    };
}

// Делаем функции доступными глобально
if (typeof window !== 'undefined') {
    window.getUserData = getUserData;
    window.getUserStatistics = getUserStatistics;
    window.getLevelProgress = getLevelProgress;
    window.updateUserProfile = updateUserProfile;
}

