// ============================================
// Защита от копирования и просмотра кода
// ============================================

(function() {
    'use strict';
    
    // Защита от открытия DevTools
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Можно добавить редирект или предупреждение
                console.clear();
                console.log('%cСТОП!', 'font-size: 50px; font-weight: bold; color: red;');
                console.log('%cЭто функция браузера, предназначенная для разработчиков.', 'font-size: 16px;');
                console.log('%cЕсли кто-то сказал вам скопировать и вставить что-то здесь, чтобы включить функцию или "взломать" чужой аккаунт, это мошенничество.', 'font-size: 16px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Защита от копирования текста
    document.addEventListener('copy', function(e) {
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', 'Копирование запрещено');
        }
        e.preventDefault();
        return false;
    });
    
    // Защита от вырезания
    document.addEventListener('cut', function(e) {
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', '');
        }
        e.preventDefault();
        return false;
    });
    
    // Защита от выделения текста (можно отключить для удобства пользователей)
    // document.addEventListener('selectstart', function(e) {
    //     e.preventDefault();
    // });
    
    // Защита от правой кнопки мыши
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Защита от горячих клавиш
    document.addEventListener('keydown', function(e) {
        // Блокировка F12
        if (e.keyCode === 123 || e.key === 'F12') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+Shift+I (DevTools)
        if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+Shift+J (Console)
        if ((e.ctrlKey && e.shiftKey && e.keyCode === 74) || (e.ctrlKey && e.shiftKey && e.key === 'J')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+Shift+C (Element Inspector)
        if ((e.ctrlKey && e.shiftKey && e.keyCode === 67) || (e.ctrlKey && e.shiftKey && e.key === 'C')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+U (просмотр исходного кода)
        if ((e.ctrlKey && e.keyCode === 85) || (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+S (сохранение страницы)
        if ((e.ctrlKey && e.keyCode === 83) || (e.ctrlKey && e.key === 's')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Блокировка Ctrl+P (печать)
        if ((e.ctrlKey && e.keyCode === 80) || (e.ctrlKey && e.key === 'p')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    // Защита от перетаскивания изображений
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Защита от перетаскивания файлов
    window.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    window.addEventListener('drop', function(e) {
        e.preventDefault();
    });
    
    // Предупреждение при попытке закрыть страницу
    window.addEventListener('beforeunload', function(e) {
        // Можно добавить предупреждение
        // e.preventDefault();
        // e.returnValue = '';
    });
    
    // Защита от iframe
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
    
    // Очистка консоли при открытии
    console.clear();
    
    // Предупреждение в консоли
    console.log('%c⚠️ ВНИМАНИЕ!', 'font-size: 20px; font-weight: bold; color: red;');
    console.log('%cЭто консоль браузера. Если вы не разработчик, не вводите здесь никакой код.', 'font-size: 14px; color: #333;');
    console.log('%cЛюбые попытки "взлома" через консоль могут привести к блокировке.', 'font-size: 14px; color: #333;');
    
})();

