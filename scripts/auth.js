// ============================================
// Система аутентификации FirstAidSim
// ============================================

/**
 * Управление аутентификацией пользователей
 * Использует localStorage для демо-версии
 */

// Ключи для localStorage (глобальная константа для всех модулей)
var STORAGE_KEYS = {
    USERS: 'firstAidSim_users',
    CURRENT_USER: 'firstAidSim_currentUser',
    SESSION: 'firstAidSim_session'
};

// Инициализация хранилища пользователей
function initAuthStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify({}));
    }
}

// Простое хеширование пароля (для демо)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация пароля
function validatePassword(password) {
    // Минимум 6 символов
    return password.length >= 6;
}

/**
 * Регистрация нового пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @param {string} confirmPassword - Подтверждение пароля
 * @returns {Object} Результат регистрации {success: boolean, message: string, user: Object}
 */
function registerUser(email, password, confirmPassword) {
    // Валидация
    if (!email || !password || !confirmPassword) {
        return { success: false, message: 'Все поля обязательны для заполнения' };
    }
    
    if (!validateEmail(email)) {
        return { success: false, message: 'Некорректный формат email' };
    }
    
    if (!validatePassword(password)) {
        return { success: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    
    if (password !== confirmPassword) {
        return { success: false, message: 'Пароли не совпадают' };
    }
    
    // Проверка существования пользователя
    initAuthStorage();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    
    if (users[email]) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }
    
    // Создание нового пользователя
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const hashedPassword = hashPassword(password);
    
    const newUser = {
        id: userId,
        email: email,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
        profile: {
            name: email.split('@')[0],
            firstName: '',
            lastName: '',
            middleName: '',
            birthDate: '',
            phone: '',
            organization: '',
            position: '',
            avatar: null,
            level: 1,
            experience: 0,
            totalScore: 0,
            scenariosCompleted: [],
            certificates: [],
            achievements: [],
            settings: {
                notifications: true,
                theme: 'light'
            }
        },
        statistics: {
            totalScenarios: 0,
            correctActions: 0,
            incorrectActions: 0,
            averageScore: 0,
            bestScore: 0,
            timeSpent: 0
        }
    };
    
    users[email] = newUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return { 
        success: true, 
        message: 'Регистрация успешна!',
        user: {
            id: newUser.id,
            email: newUser.email,
            profile: newUser.profile
        }
    };
}

/**
 * Вход пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @returns {Object} Результат входа {success: boolean, message: string, user: Object}
 */
function loginUser(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Введите email и пароль' };
    }
    
    initAuthStorage();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    
    if (!users[email]) {
        return { success: false, message: 'Пользователь не найден' };
    }
    
    const user = users[email];
    const hashedPassword = hashPassword(password);
    
    if (user.passwordHash !== hashedPassword) {
        return { success: false, message: 'Неверный пароль' };
    }
    
    // Создание сессии
    const session = {
        userId: user.id,
        email: user.email,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 дней
    };
    
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        id: user.id,
        email: user.email,
        profile: user.profile
    }));
    
    return { 
        success: true, 
        message: 'Вход выполнен успешно!',
        user: {
            id: user.id,
            email: user.email,
            profile: user.profile
        }
    };
}

/**
 * Выход пользователя
 */
function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    updateAuthUI();
    // Показываем уведомление о выходе
    if (typeof showNotification === 'function') {
        showNotification('Вы вышли из системы', 'info');
    }
    // Если мы на странице профиля, переключаемся на главную
    if (typeof showPage === 'function') {
        const currentPage = document.querySelector('.page-section.active');
        if (currentPage && currentPage.id === 'profile') {
            showPage('home');
        }
    }
}

// Делаем функцию доступной глобально
window.logoutUser = logoutUser;

/**
 * Проверка текущей сессии
 * @returns {Object|null} Текущий пользователь или null
 */
function getCurrentUser() {
    const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionStr) return null;
    
    try {
        const session = JSON.parse(sessionStr);
        const expiresAt = new Date(session.expiresAt);
        
        if (expiresAt < new Date()) {
            logoutUser();
            return null;
        }
        
        const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (userStr) {
            return JSON.parse(userStr);
        }
        
        return null;
    } catch (e) {
        console.error('Ошибка чтения сессии:', e);
        return null;
    }
}

/**
 * Проверка авторизации
 * @returns {boolean} Авторизован ли пользователь
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Обновление UI в зависимости от статуса авторизации
 */
function updateAuthUI() {
    // Проверяем, что DOM загружен
    if (document.readyState === 'loading') {
        return;
    }
    const currentUser = getCurrentUser();
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');
    const userMenu = document.getElementById('userMenu');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    // userMenu всегда должен быть виден
    if (userMenu) {
        userMenu.style.display = 'flex';
    }
    
    if (currentUser) {
        // Пользователь авторизован - скрываем кнопки входа/регистрации, показываем профиль
        if (loginButton) {
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
        }
        if (registerButton) {
            registerButton.style.display = 'none';
            registerButton.style.visibility = 'hidden';
        }
        if (profileButton) {
            profileButton.style.display = 'inline-flex';
            profileButton.style.visibility = 'visible';
            // Обновляем аватар и имя
            if (userAvatar) {
                userAvatar.textContent = currentUser.profile.name.charAt(0).toUpperCase();
            }
            if (userName) {
                userName.textContent = currentUser.profile.name;
            }
        }
        if (logoutButton) {
            logoutButton.style.display = 'inline-flex';
            logoutButton.style.visibility = 'visible';
        }
    } else {
        // Пользователь не авторизован - показываем кнопки входа/регистрации, скрываем профиль
        if (loginButton) {
            loginButton.style.display = 'inline-flex';
            loginButton.style.visibility = 'visible';
        }
        if (registerButton) {
            registerButton.style.display = 'inline-flex';
            registerButton.style.visibility = 'visible';
        }
        if (profileButton) {
            profileButton.style.display = 'none';
            profileButton.style.visibility = 'hidden';
        }
        if (logoutButton) {
            logoutButton.style.display = 'none';
            logoutButton.style.visibility = 'hidden';
        }
    }
}

// Делаем функцию доступной глобально
window.updateAuthUI = updateAuthUI;

// Инициализация при загрузке
if (typeof window !== 'undefined') {
    initAuthStorage();
    
    // Обновляем UI при загрузке страницы
    function initAuthUI() {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initAuthUI, 100);
        });
    } else {
        // Небольшая задержка для гарантии, что все элементы загружены
        setTimeout(initAuthUI, 100);
    }
}

