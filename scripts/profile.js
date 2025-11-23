// ============================================
// Управление страницей профиля
// ============================================

/**
 * Загрузка и отображение профиля пользователя
 */

// Маппинг ID сценариев на названия
const SCENARIO_NAMES = {
    'cpr': 'Сердечно-легочная реанимация (СЛР)',
    'bleeding': 'Артериальное кровотечение',
    'burn': 'Термический ожог',
    'faint': 'Потеря сознания',
    'anaphylaxis': 'Анафилактический шок',
    'fracture': 'Открытый перелом',
    'drowning': 'Спасение утопающего',
    'poisoning': 'Пищевое отравление'
};

/**
 * Загрузка профиля пользователя
 */
function loadProfile() {
    const profileContent = document.getElementById('profileContent');
    if (!profileContent) {
        console.error('profileContent element not found');
        return;
    }
    
    // Проверяем наличие необходимых функций
    if (typeof getUserData !== 'function') {
        console.error('getUserData function not found');
        profileContent.innerHTML = `
            <div class="profile-empty">
                <div class="empty-icon">⚠️</div>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить функции профиля. Обновите страницу.</p>
            </div>
        `;
        return;
    }
    
    const userData = getUserData();
    if (!userData) {
        profileContent.innerHTML = `
            <div class="profile-empty">
                <div class="empty-icon">👤</div>
                <h3>Вы не авторизованы</h3>
                <p>Войдите в систему, чтобы просмотреть свой профиль</p>
                <button class="btn-primary" onclick="openLoginModal()">Войти</button>
            </div>
        `;
        return;
    }
    
    // Проверяем наличие остальных функций
    if (typeof getUserStatistics !== 'function' || 
        typeof getLevelProgress !== 'function' || 
        typeof getUserAchievements !== 'function' || 
        typeof getAchievementsProgress !== 'function') {
        console.error('Some profile functions are missing');
        profileContent.innerHTML = `
            <div class="profile-empty">
                <div class="empty-icon">⚠️</div>
                <h3>Ошибка загрузки</h3>
                <p>Не все функции профиля загружены. Обновите страницу.</p>
            </div>
        `;
        return;
    }
    
    let stats, levelProgress, achievements, achievementsProgress;
    
    try {
        stats = getUserStatistics();
        levelProgress = getLevelProgress();
        achievements = getUserAchievements();
        achievementsProgress = getAchievementsProgress();
    } catch (error) {
        console.error('Error loading profile data:', error);
        profileContent.innerHTML = `
            <div class="profile-empty">
                <div class="empty-icon">⚠️</div>
                <h3>Ошибка загрузки</h3>
                <p>Произошла ошибка при загрузке данных профиля: ${error.message}</p>
                <button class="btn-primary" onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
        return;
    }
    
    // Проверяем, что данные загружены
    if (!stats || !levelProgress || !achievements || !achievementsProgress) {
        console.error('Profile data is incomplete:', { stats, levelProgress, achievements, achievementsProgress });
        profileContent.innerHTML = `
            <div class="profile-empty">
                <div class="empty-icon">⚠️</div>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить все данные профиля. Обновите страницу.</p>
                <button class="btn-primary" onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
        return;
    }
    
    // Получаем данные из профиля
    const firstName = userData.profile.firstName || '';
    const lastName = userData.profile.lastName || '';
    const middleName = userData.profile.middleName || '';
    const birthDate = userData.profile.birthDate || '';
    const phone = userData.profile.phone || '';
    const organization = userData.profile.organization || '';
    const position = userData.profile.position || '';
    
    // Формируем полное имя для отображения
    let fullName = '';
    if (lastName && firstName) {
        fullName = `${lastName} ${firstName}`;
        if (middleName) {
            fullName += ` ${middleName}`;
        }
    } else if (firstName) {
        fullName = firstName;
    } else if (lastName) {
        fullName = lastName;
    } else {
        fullName = userData.profile.name;
    }
    
    const displayName = fullName;
    const displayInitials = (lastName && firstName) 
        ? `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase()
        : displayName.charAt(0).toUpperCase();
    
    profileContent.innerHTML = `
        <div class="profile-grid">
            <!-- Информация о пользователе с редактированием -->
            <div class="profile-card profile-info">
                <div class="profile-avatar-large">
                    ${userData.profile.avatar || displayInitials}
                </div>
                <h3 class="profile-name">${displayName}</h3>
                <p class="profile-email">${userData.email}</p>
                ${phone ? `<p class="profile-phone">📞 ${phone}</p>` : ''}
                ${organization ? `<p class="profile-org">🏢 ${organization}</p>` : ''}
                ${position ? `<p class="profile-position">💼 ${position}</p>` : ''}
                <div class="profile-level">
                    <div class="level-badge">Уровень ${userData.profile.level}</div>
                    <div class="level-progress">
                        <div class="level-progress-bar">
                            <div class="level-progress-fill" style="width: ${levelProgress.progress}%"></div>
                        </div>
                        <div class="level-progress-text">
                            ${levelProgress.current} / ${levelProgress.next} опыта
                        </div>
                    </div>
                </div>
                
                <!-- Форма редактирования профиля -->
                <div class="profile-edit-section">
                    <h4 class="profile-edit-title">Редактировать профиль</h4>
                    <form id="profileEditForm" class="profile-edit-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="profileLastName" class="required">Фамилия</label>
                                <input type="text" id="profileLastName" name="lastName" value="${lastName}" placeholder="Введите фамилию" required>
                            </div>
                            <div class="form-group">
                                <label for="profileFirstName" class="required">Имя</label>
                                <input type="text" id="profileFirstName" name="firstName" value="${firstName}" placeholder="Введите имя" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="profileMiddleName">Отчество</label>
                            <input type="text" id="profileMiddleName" name="middleName" value="${middleName}" placeholder="Введите отчество">
                        </div>
                        <div class="form-group">
                            <label for="profileBirthDate">Дата рождения</label>
                            <input type="date" id="profileBirthDate" name="birthDate" value="${birthDate}">
                        </div>
                        <div class="form-group">
                            <label for="profilePhone">Телефон</label>
                            <input type="tel" id="profilePhone" name="phone" value="${phone}" placeholder="+7 (999) 123-45-67">
                        </div>
                        <div class="form-group">
                            <label for="profileOrganization">Организация</label>
                            <input type="text" id="profileOrganization" name="organization" value="${organization}" placeholder="Название организации">
                        </div>
                        <div class="form-group">
                            <label for="profilePosition">Должность</label>
                            <input type="text" id="profilePosition" name="position" value="${position}" placeholder="Ваша должность">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Сохранить изменения</button>
                        </div>
                        <div id="profileSaveMessage" class="profile-save-message" style="display: none;"></div>
                    </form>
                </div>
            </div>
            
            <!-- Статистика -->
            <div class="profile-card profile-stats">
                <h3 class="card-title">📊 Статистика</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalScenarios}</div>
                        <div class="stat-label">Пройдено сценариев</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.scenariosCompleted}</div>
                        <div class="stat-label">Уникальных сценариев</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.correctActions}</div>
                        <div class="stat-label">Правильных действий</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.averageScore}</div>
                        <div class="stat-label">Средний счет</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.bestScore}</div>
                        <div class="stat-label">Лучший счет</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.certificates}</div>
                        <div class="stat-label">Сертификатов</div>
                    </div>
                </div>
            </div>
            
            <!-- Достижения -->
            <div class="profile-card profile-achievements">
                <h3 class="card-title">🏆 Достижения</h3>
                <div class="achievements-progress">
                    <div class="achievements-progress-bar">
                        <div class="achievements-progress-fill" style="width: ${achievementsProgress.percentage}%"></div>
                    </div>
                    <div class="achievements-progress-text">
                        ${achievementsProgress.unlocked} / ${achievementsProgress.total} достижений
                    </div>
                </div>
                <div class="achievements-grid" id="achievementsGrid">
                    ${renderAchievements(achievements)}
                </div>
            </div>
            
            <!-- История сценариев -->
            <div class="profile-card profile-history">
                <h3 class="card-title">📜 История прохождений</h3>
                <div class="history-list" id="historyList">
                    ${renderHistory(userData.profile.scenariosCompleted)}
                </div>
            </div>
            
            <!-- Сертификаты -->
            <div class="profile-card profile-certificates">
                <h3 class="card-title">🎓 Сертификаты</h3>
                <div class="certificates-list" id="certificatesList">
                    ${renderCertificates(userData.profile.certificates)}
                </div>
            </div>
        </div>
    `;
    
    // Добавляем обработчик формы редактирования
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', handleProfileSave);
    }
}

/**
 * Обработчик сохранения профиля
 */
function handleProfileSave(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const middleName = document.getElementById('profileMiddleName').value.trim();
    const birthDate = document.getElementById('profileBirthDate').value;
    const phone = document.getElementById('profilePhone').value.trim();
    const organization = document.getElementById('profileOrganization').value.trim();
    const position = document.getElementById('profilePosition').value.trim();
    const saveMessage = document.getElementById('profileSaveMessage');
    
    // Валидация обязательных полей
    if (!firstName || !lastName) {
        if (saveMessage) {
            saveMessage.textContent = 'Пожалуйста, заполните обязательные поля: Имя и Фамилия';
            saveMessage.className = 'profile-save-message error';
            saveMessage.style.display = 'block';
            setTimeout(() => {
                saveMessage.style.display = 'none';
            }, 3000);
        }
        return;
    }
    
    // Сохраняем данные
    const success = updateUserProfile({
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        birthDate: birthDate,
        phone: phone,
        organization: organization,
        position: position
    });
    
    if (success) {
        // Показываем сообщение об успехе
        if (saveMessage) {
            saveMessage.textContent = 'Профиль успешно сохранен!';
            saveMessage.className = 'profile-save-message success';
            saveMessage.style.display = 'block';
            
            // Обновляем отображение данных
            const profileName = document.querySelector('.profile-name');
            if (profileName) {
                let fullName = `${lastName} ${firstName}`;
                if (middleName) {
                    fullName += ` ${middleName}`;
                }
                profileName.textContent = fullName;
            }
            
            // Обновляем дополнительные поля
            const profilePhone = document.querySelector('.profile-phone');
            const profileOrg = document.querySelector('.profile-org');
            const profilePosition = document.querySelector('.profile-position');
            
            if (phone) {
                if (profilePhone) {
                    profilePhone.textContent = `📞 ${phone}`;
                } else {
                    const emailEl = document.querySelector('.profile-email');
                    if (emailEl && emailEl.nextElementSibling?.classList.contains('profile-phone') === false) {
                        const phoneEl = document.createElement('p');
                        phoneEl.className = 'profile-phone';
                        phoneEl.textContent = `📞 ${phone}`;
                        emailEl.after(phoneEl);
                    }
                }
            } else if (profilePhone) {
                profilePhone.remove();
            }
            
            if (organization) {
                if (profileOrg) {
                    profileOrg.textContent = `🏢 ${organization}`;
                } else {
                    const emailEl = document.querySelector('.profile-email');
                    if (emailEl) {
                        const orgEl = document.createElement('p');
                        orgEl.className = 'profile-org';
                        orgEl.textContent = `🏢 ${organization}`;
                        emailEl.after(orgEl);
                    }
                }
            } else if (profileOrg) {
                profileOrg.remove();
            }
            
            if (position) {
                if (profilePosition) {
                    profilePosition.textContent = `💼 ${position}`;
                } else {
                    const emailEl = document.querySelector('.profile-email');
                    if (emailEl) {
                        const posEl = document.createElement('p');
                        posEl.className = 'profile-position';
                        posEl.textContent = `💼 ${position}`;
                        emailEl.after(posEl);
                    }
                }
            } else if (profilePosition) {
                profilePosition.remove();
            }
            
            // Скрываем сообщение через 3 секунды
            setTimeout(() => {
                saveMessage.style.display = 'none';
            }, 3000);
        }
    } else {
        // Показываем сообщение об ошибке
        if (saveMessage) {
            saveMessage.textContent = 'Ошибка при сохранении профиля';
            saveMessage.className = 'profile-save-message error';
            saveMessage.style.display = 'block';
            
            setTimeout(() => {
                saveMessage.style.display = 'none';
            }, 3000);
        }
    }
}

/**
 * Отображение достижений
 */
function renderAchievements(achievements) {
    if (achievements.length === 0) {
        return '<div class="empty-state">Достижения появятся после прохождения сценариев</div>';
    }
    
    return achievements.map(achievement => `
        <div class="achievement-item" title="${achievement.description}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-date">${formatDate(achievement.date)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Отображение истории прохождений
 */
function renderHistory(scenarios) {
    if (scenarios.length === 0) {
        return '<div class="empty-state">История прохождений пуста</div>';
    }
    
    // Сортируем по дате (новые первые)
    const sorted = [...scenarios].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return sorted.slice(0, 10).map(scenario => `
        <div class="history-item">
            <div class="history-scenario">
                <strong>${SCENARIO_NAMES[scenario.scenarioId] || scenario.scenarioId}</strong>
                <span class="history-mode">${scenario.mode === 'exam' ? 'Экзамен' : 'Обучение'}</span>
            </div>
            <div class="history-details">
                <span class="history-score">Счет: ${scenario.score}</span>
                <span class="history-actions">✓ ${scenario.correctActions} / ✗ ${scenario.incorrectActions}</span>
                ${scenario.grade ? `<span class="history-grade grade-${scenario.grade.toLowerCase().replace(' ', '-')}">${scenario.grade}</span>` : ''}
            </div>
            <div class="history-date">${formatDate(scenario.date)}</div>
        </div>
    `).join('');
}

/**
 * Отображение сертификатов
 */
function renderCertificates(certificates) {
    if (certificates.length === 0) {
        return '<div class="empty-state">Сертификаты появятся после сдачи экзаменов</div>';
    }
    
    return certificates.map(cert => `
        <div class="certificate-item">
            <div class="certificate-icon">🎓</div>
            <div class="certificate-info">
                <div class="certificate-scenario">${SCENARIO_NAMES[cert.scenarioId] || cert.scenarioId}</div>
                <div class="certificate-grade grade-${cert.grade.toLowerCase().replace(' ', '-')}">${cert.grade}</div>
                <div class="certificate-date">${formatDate(cert.date)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Делаем функцию loadProfile доступной глобально
window.loadProfile = loadProfile;
window.handleProfileSave = handleProfileSave;

// Обновление профиля при переключении на страницу
document.addEventListener('DOMContentLoaded', function() {
    // Перехватываем переключение на страницу профиля
    const originalShowPage = window.showPage;
    if (originalShowPage) {
        const originalFunction = window.showPage;
        window.showPage = function(pageId, saveHistory) {
            originalFunction(pageId, saveHistory);
            if (pageId === 'profile') {
                setTimeout(() => {
                    loadProfile();
                }, 100);
            }
        };
    }
    
    // Обработчик кнопки профиля
    const profileButton = document.getElementById('profileButton');
    if (profileButton) {
        profileButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof showPage === 'function') {
                showPage('profile');
            }
        });
    }
});

