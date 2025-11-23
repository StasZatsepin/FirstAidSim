// ============================================
// Функции визуализации для всех сценариев
// ============================================

/**
 * Создает HTML-структуру для визуализации СЛР
 * @param {string} state - Состояние ('normal', 'critical', 'breathing', 'compressions', 'treated')
 */
function createCPRVisualization(state) {
    return `
        <div class="visualization cpr-visualization ${state} active">
            <div class="cpr-person">
                <div class="cpr-head"></div>
                <div class="cpr-body">
                    <div class="cpr-chest"></div>
                    <div class="cpr-hands"></div>
                </div>
            </div>
            ${state === 'compressions' ? '<div class="cpr-timer"><span class="cpr-timer-count">30:2</span></div>' : ''}
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации кровотечения
 * @param {string} state - Состояние ('normal', 'injured', 'treated', 'critical')
 */
function createBleedingVisualization(state) {
    return `
        <div class="visualization bleeding-visualization ${state} active">
            <div class="bleeding-limb">
                <div class="bleeding-wound">
                    <div class="bleeding-blood"></div>
                </div>
                <div class="bleeding-tourniquet"></div>
                <div class="bleeding-bandage"></div>
            </div>
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации ожога
 * @param {string} state - Состояние ('normal', 'injured', 'treating', 'treated', 'critical')
 */
function createBurnVisualization(state) {
    return `
        <div class="visualization burn-visualization ${state} active">
            <div class="burn-limb">
                <div class="burn-area">
                    <div class="burn-blister"></div>
                    <div class="burn-blister"></div>
                    <div class="burn-blister"></div>
                </div>
                <div class="burn-water">
                    <div class="burn-waves"></div>
                </div>
                <div class="burn-bandage"></div>
            </div>
            ${state === 'injured' || state === 'critical' ? '<div class="burn-severity">Степень: II</div>' : ''}
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации потери сознания
 * @param {string} state - Состояние ('normal', 'critical', 'breathing', 'side-position', 'treated')
 */
function createFaintVisualization(state) {
    return `
        <div class="visualization faint-visualization ${state} active">
            <div class="faint-person">
                <div class="faint-head"></div>
                <div class="faint-body">
                    <div class="faint-breathing"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации анафилактического шока
 * @param {string} state - Состояние ('normal', 'critical', 'treating', 'treated')
 */
function createAnaphylaxisVisualization(state) {
    return `
        <div class="visualization anaphylaxis-visualization ${state} active">
            <div class="anaphylaxis-person">
                <div class="anaphylaxis-head">
                    <div class="anaphylaxis-face">
                        <div class="anaphylaxis-eyes"></div>
                        <div class="anaphylaxis-mouth"></div>
                        <div class="anaphylaxis-swelling-cheeks anaphylaxis-swelling-left"></div>
                        <div class="anaphylaxis-swelling-cheeks anaphylaxis-swelling-right"></div>
                        <div class="anaphylaxis-swelling-lips"></div>
                    </div>
                </div>
                <div class="anaphylaxis-body">
                    <div class="anaphylaxis-rash"></div>
                    <div class="anaphylaxis-rash"></div>
                    <div class="anaphylaxis-rash"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации открытого перелома
 * @param {string} state - Состояние ('normal', 'critical', 'bleeding', 'immobilizing', 'treated')
 */
function createFractureVisualization(state) {
    return `
        <div class="visualization fracture-visualization ${state} active">
            <div class="fracture-limb">
                <div class="fracture-leg">
                    <div class="fracture-bone"></div>
                    <div class="fracture-wound"></div>
                    <div class="fracture-blood"></div>
                    <div class="fracture-splint"></div>
                    <div class="fracture-bandage"></div>
                </div>
                <div class="fracture-deformation"></div>
            </div>
            <div class="fracture-shock-indicator"></div>
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации спасения утопающего
 * @param {string} state - Состояние ('normal', 'critical', 'cpr', 'treated')
 */
function createDrowningVisualization(state) {
    const showWater = state === 'critical' || state === 'cpr';
    const showCPR = state === 'cpr';
    
    return `
        <div class="visualization drowning-visualization ${state} active">
            <div class="drowning-person">
                <div class="drowning-head">
                    <div class="drowning-face">
                        <div class="drowning-eyes"></div>
                        <div class="drowning-mouth">
                            ${showWater ? '<div class="drowning-water"></div>' : ''}
                        </div>
                    </div>
                </div>
                <div class="drowning-body">
                    <div class="drowning-wet-clothes"></div>
                    <div class="drowning-breathing-indicator"></div>
                </div>
            </div>
            ${showCPR ? '<div class="drowning-cpr-indicator">СЛР 30:2</div>' : ''}
        </div>
    `;
}

/**
 * Создает HTML-структуру для визуализации пищевого отравления
 * @param {string} state - Состояние ('normal', 'critical', 'treated')
 */
function createPoisoningVisualization(state) {
    const showGI = state === 'critical' || state === 'treated';
    const showDehydration = state === 'critical';
    const showVomit = state === 'critical';
    
    return `
        <div class="visualization poisoning-visualization ${state} active">
            <div class="poisoning-person">
                <div class="poisoning-head">
                    <div class="poisoning-face">
                        <div class="poisoning-eyes"></div>
                        <div class="poisoning-mouth">
                            ${showVomit ? '<div class="poisoning-vomit"></div>' : ''}
                        </div>
                    </div>
                </div>
                <div class="poisoning-body">
                    ${showGI ? '<div class="poisoning-gi-tract"></div>' : ''}
                    ${showGI ? '<div class="poisoning-pain-zone"></div>' : ''}
                    ${showDehydration ? '<div class="poisoning-dehydration"></div>' : ''}
                </div>
            </div>
            ${state === 'critical' ? '<div class="poisoning-timer">Время с момента отравления: <span id="poisoningTime">0</span> мин</div>' : ''}
        </div>
    `;
}

/**
 * Обновляет визуализацию на основе типа сценария и состояния
 * @param {string} scenarioType - Тип сценария
 * @param {string} visualState - Состояние визуализации
 */
function updateVisualization(scenarioType, visualState) {
    // Получаем элемент визуализации из DOM, если он еще не определен
    const scenarioVisualization = document.getElementById('scenarioVisualization');
    if (!scenarioVisualization) return;
    
    // Очищаем контейнер
    scenarioVisualization.innerHTML = '';
    
    // Создаем соответствующую визуализацию
    let html = '';
    switch(scenarioType) {
        case 'cpr':
            html = createCPRVisualization(visualState);
            break;
        case 'bleeding':
            html = createBleedingVisualization(visualState);
            break;
        case 'burn':
            html = createBurnVisualization(visualState);
            break;
        case 'faint':
            html = createFaintVisualization(visualState);
            break;
        case 'anaphylaxis':
            html = createAnaphylaxisVisualization(visualState);
            break;
        case 'fracture':
            html = createFractureVisualization(visualState);
            break;
        case 'drowning':
            html = createDrowningVisualization(visualState);
            break;
        case 'poisoning':
            html = createPoisoningVisualization(visualState);
            break;
        default:
            return;
    }
    
    scenarioVisualization.innerHTML = html;
}

