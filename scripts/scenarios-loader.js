// scripts/scenarios-loader.js
// Этот файл отвечает за загрузку и управление данными сценариев.
// Каждый сценарий будет экспортировать свой объект, который будет регистрироваться здесь.

// Глобальный объект для хранения всех сценариев
// Создаем глобальный объект scenarios, который будет использоваться во всех модулях
if (typeof window.scenarios === 'undefined') {
    window.scenarios = {};
}
var scenarios = window.scenarios;

/**
 * Регистрирует сценарий в глобальном хранилище.
 * @param {Object} scenarioData - Объект сценария.
 */
function registerScenario(scenarioData) {
    if (scenarioData && scenarioData.id) {
        scenarios[scenarioData.id] = scenarioData;
        console.log(`Сценарий "${scenarioData.name}" (${scenarioData.id}) зарегистрирован.`);
    } else {
        console.error('Попытка зарегистрировать некорректный объект сценария:', scenarioData);
    }
}

/**
 * Получает сценарий по ID
 * @param {string} id - ID сценария
 * @returns {Object|null} Объект сценария или null, если не найден
 */
function getScenario(id) {
    return scenarios[id] || null;
}
