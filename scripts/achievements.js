// ============================================
// Система достижений FirstAidSim
// ============================================

/**
 * Управление достижениями, бейджами и наградами
 */

// Типы достижений
const ACHIEVEMENT_TYPES = {
    SCENARIO_COMPLETE: 'scenario_complete',
    PERFECT_SCORE: 'perfect_score',
    LEVEL_UP: 'level_up',
    CERTIFICATE: 'certificate',
    STREAK: 'streak',
    MASTER: 'master'
};

// Определения достижений
const ACHIEVEMENTS = {
    // Завершение сценариев
    'cpr_complete': {
        id: 'cpr_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Спасатель',
        description: 'Завершите сценарий СЛР',
        icon: '🫀',
        points: 50,
        scenarioId: 'cpr'
    },
    'bleeding_complete': {
        id: 'bleeding_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Остановил кровь',
        description: 'Завершите сценарий остановки кровотечения',
        icon: '🩸',
        points: 50,
        scenarioId: 'bleeding'
    },
    'burn_complete': {
        id: 'burn_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Ожоговый специалист',
        description: 'Завершите сценарий помощи при ожоге',
        icon: '🔥',
        points: 50,
        scenarioId: 'burn'
    },
    'faint_complete': {
        id: 'faint_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Врач скорой',
        description: 'Завершите сценарий помощи при потере сознания',
        icon: '😵',
        points: 50,
        scenarioId: 'faint'
    },
    'anaphylaxis_complete': {
        id: 'anaphylaxis_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Аллерголог',
        description: 'Завершите сценарий помощи при анафилаксии',
        icon: '🐝',
        points: 50,
        scenarioId: 'anaphylaxis'
    },
    'fracture_complete': {
        id: 'fracture_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Травматолог',
        description: 'Завершите сценарий помощи при переломе',
        icon: '🦴',
        points: 50,
        scenarioId: 'fracture'
    },
    'drowning_complete': {
        id: 'drowning_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Спасатель на воде',
        description: 'Завершите сценарий спасения утопающего',
        icon: '🌊',
        points: 50,
        scenarioId: 'drowning'
    },
    'poisoning_complete': {
        id: 'poisoning_complete',
        type: ACHIEVEMENT_TYPES.SCENARIO_COMPLETE,
        name: 'Токсиколог',
        description: 'Завершите сценарий помощи при отравлении',
        icon: '🍄',
        points: 50,
        scenarioId: 'poisoning'
    },
    
    // Идеальные результаты
    'perfect_cpr': {
        id: 'perfect_cpr',
        type: ACHIEVEMENT_TYPES.PERFECT_SCORE,
        name: 'Идеальная СЛР',
        description: 'Пройдите СЛР без ошибок',
        icon: '⭐',
        points: 100,
        scenarioId: 'cpr'
    },
    'all_perfect': {
        id: 'all_perfect',
        type: ACHIEVEMENT_TYPES.PERFECT_SCORE,
        name: 'Абсолютное совершенство',
        description: 'Пройдите все сценарии без ошибок',
        icon: '💎',
        points: 500
    },
    
    // Уровни
    'level_5': {
        id: 'level_5',
        type: ACHIEVEMENT_TYPES.LEVEL_UP,
        name: 'Новичок',
        description: 'Достигните 5 уровня',
        icon: '🌱',
        points: 100
    },
    'level_10': {
        id: 'level_10',
        type: ACHIEVEMENT_TYPES.LEVEL_UP,
        name: 'Опытный',
        description: 'Достигните 10 уровня',
        icon: '🌿',
        points: 200
    },
    'level_15': {
        id: 'level_15',
        type: ACHIEVEMENT_TYPES.LEVEL_UP,
        name: 'Мастер',
        description: 'Достигните 15 уровня',
        icon: '🏆',
        points: 300
    },
    'level_20': {
        id: 'level_20',
        type: ACHIEVEMENT_TYPES.LEVEL_UP,
        name: 'Легенда',
        description: 'Достигните 20 уровня',
        icon: '👑',
        points: 500
    },
    
    // Сертификаты
    'first_certificate': {
        id: 'first_certificate',
        type: ACHIEVEMENT_TYPES.CERTIFICATE,
        name: 'Первый сертификат',
        description: 'Получите первый сертификат',
        icon: '📜',
        points: 150
    },
    'all_certificates': {
        id: 'all_certificates',
        type: ACHIEVEMENT_TYPES.CERTIFICATE,
        name: 'Сертифицированный эксперт',
        description: 'Получите все сертификаты',
        icon: '🎓',
        points: 1000
    },
    
    // Серии
    'streak_3': {
        id: 'streak_3',
        type: ACHIEVEMENT_TYPES.STREAK,
        name: 'Начало пути',
        description: 'Пройдите 3 сценария подряд',
        icon: '🔥',
        points: 50
    },
    'streak_5': {
        id: 'streak_5',
        type: ACHIEVEMENT_TYPES.STREAK,
        name: 'В ритме',
        description: 'Пройдите 5 сценариев подряд',
        icon: '⚡',
        points: 100
    },
    
    // Мастерство
    'all_scenarios': {
        id: 'all_scenarios',
        type: ACHIEVEMENT_TYPES.MASTER,
        name: 'Покоритель всех сценариев',
        description: 'Пройдите все 8 сценариев',
        icon: '🌟',
        points: 400
    }
};

/**
 * Проверка и выдача достижений
 * @param {Object} userData - Данные пользователя
 * @returns {Array} Новые достижения
 */
function checkAchievements(userData) {
    if (!userData) return [];
    
    const newAchievements = [];
    const existingAchievementIds = userData.profile.achievements.map(a => a.id);
    
    // Проверка завершения сценариев
    const completedScenarios = userData.profile.scenariosCompleted.map(s => s.scenarioId);
    const scenarioAchievements = [
        'cpr_complete', 'bleeding_complete', 'burn_complete', 'faint_complete',
        'anaphylaxis_complete', 'fracture_complete', 'drowning_complete', 'poisoning_complete'
    ];
    
    scenarioAchievements.forEach(achievementId => {
        if (existingAchievementIds.includes(achievementId)) return;
        
        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) return;
        
        const scenarioId = achievement.scenarioId;
        if (completedScenarios.includes(scenarioId)) {
            awardAchievement(userData, achievement);
            newAchievements.push(achievement);
        }
    });
    
    // Проверка идеальных результатов
    const perfectScenarios = userData.profile.scenariosCompleted.filter(
        s => s.incorrectActions === 0 && s.score >= 100
    );
    
    perfectScenarios.forEach(scenario => {
        const achievementId = `perfect_${scenario.scenarioId}`;
        if (!existingAchievementIds.includes(achievementId) && ACHIEVEMENTS[achievementId]) {
            const achievement = ACHIEVEMENTS[achievementId];
            awardAchievement(userData, achievement);
            newAchievements.push(achievement);
        }
    });
    
    // Проверка всех идеальных результатов
    if (perfectScenarios.length >= 8 && !existingAchievementIds.includes('all_perfect')) {
        const achievement = ACHIEVEMENTS['all_perfect'];
        awardAchievement(userData, achievement);
        newAchievements.push(achievement);
    }
    
    // Проверка уровней
    const level = userData.profile.level;
    [5, 10, 15, 20].forEach(levelThreshold => {
        const achievementId = `level_${levelThreshold}`;
        if (level >= levelThreshold && !existingAchievementIds.includes(achievementId)) {
            const achievement = ACHIEVEMENTS[achievementId];
            if (achievement) {
                awardAchievement(userData, achievement);
                newAchievements.push(achievement);
            }
        }
    });
    
    // Проверка сертификатов
    const certificates = userData.profile.certificates;
    if (certificates.length > 0 && !existingAchievementIds.includes('first_certificate')) {
        const achievement = ACHIEVEMENTS['first_certificate'];
        awardAchievement(userData, achievement);
        newAchievements.push(achievement);
    }
    
    if (certificates.length >= 8 && !existingAchievementIds.includes('all_certificates')) {
        const achievement = ACHIEVEMENTS['all_certificates'];
        awardAchievement(userData, achievement);
        newAchievements.push(achievement);
    }
    
    // Проверка всех сценариев
    if (completedScenarios.length >= 8 && !existingAchievementIds.includes('all_scenarios')) {
        const achievement = ACHIEVEMENTS['all_scenarios'];
        awardAchievement(userData, achievement);
        newAchievements.push(achievement);
    }
    
    // Сохраняем обновленные данные
    if (newAchievements.length > 0) {
        saveUserData(userData);
    }
    
    return newAchievements;
}

/**
 * Выдача достижения пользователю
 * @param {Object} userData - Данные пользователя
 * @param {Object} achievement - Достижение
 */
function awardAchievement(userData, achievement) {
    const achievementRecord = {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        date: new Date().toISOString()
    };
    
    userData.profile.achievements.push(achievementRecord);
    userData.profile.experience += achievement.points;
    
    // Показываем уведомление
    showAchievementNotification(achievement);
}

/**
 * Показ уведомления о достижении
 * @param {Object} achievement - Достижение
 */
function showAchievementNotification(achievement) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Достижение разблокировано!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} опыта</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Удаление через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Получение всех достижений пользователя
 * @returns {Array} Достижения
 */
function getUserAchievements() {
    const userData = getUserData();
    if (!userData) return [];
    
    return userData.profile.achievements.map(a => ({
        ...a,
        achievement: ACHIEVEMENTS[a.id]
    }));
}

/**
 * Получение прогресса по достижениям
 * @returns {Object} Прогресс
 */
function getAchievementsProgress() {
    const userData = getUserData();
    if (!userData) return { unlocked: 0, total: Object.keys(ACHIEVEMENTS).length, percentage: 0 };
    
    const unlocked = userData.profile.achievements.length;
    const total = Object.keys(ACHIEVEMENTS).length;
    const percentage = Math.round((unlocked / total) * 100);
    
    return { unlocked, total, percentage };
}

// Делаем функции доступными глобально
if (typeof window !== 'undefined') {
    window.getUserAchievements = getUserAchievements;
    window.getAchievementsProgress = getAchievementsProgress;
}

