/*
 * AZ ALMAZ - Судебная экспертиза ювелирных изделий
 * ФИНАЛЬНАЯ ВЕРСИЯ - Все исправления включены
 */

'use strict';

// ===================================================================
// TELEGRAM CONFIGURATION - ВАЖНО НАСТРОИТЬ!
// ===================================================================

const TELEGRAM_CONFIG = {
    botToken: '---',
    chatId: '---'
};

// Проверка конфигурации при загрузке
const isBotConfigured = TELEGRAM_CONFIG.botToken !== 'YOUR_BOT_TOKEN_HERE' && 
                        TELEGRAM_CONFIG.chatId !== 'YOUR_CHAT_ID_HERE';

// ===================================================================
// MOBILE MENU - Единое определение без дублирования
// ===================================================================
function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !toggle) return;
    
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
    
    // Блокировка скролла при открытом меню
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !toggle) return;
    
    nav.classList.remove('active');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && nav.classList.contains('active')) {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            closeMobileMenu();
        }
    }
});

// ===================================================================
// SMOOTH SCROLL FUNCTIONS
// ===================================================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===================================================================
// FAQ TOGGLE
// ===================================================================
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;
    
    const allItems = document.querySelectorAll('.faq-item');
    
    // Закрываем все остальные FAQ
    allItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    // Переключаем текущий FAQ
    faqItem.classList.toggle('active');
}

// ===================================================================
// MODAL WINDOW
// ===================================================================
function openModal(imageSrc) {
    const modal = document.getElementById('documentModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(event) {
    const modal = document.getElementById('documentModal');
    
    if (!modal) return;
    
    // Закрываем только при клике на overlay или кнопку закрытия
    if (event.target === modal || event.target.classList.contains('modal-close')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Закрытие модального окна по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('documentModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===================================================================
// STATISTICS COUNTER ANIMATION
// ===================================================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 секунды
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer для анимации счетчиков
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-value');
            counters.forEach(counter => {
                const currentValue = parseInt(counter.textContent);
                if (currentValue === 0) {
                    animateCounter(counter);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// ===================================================================
// PHONE INPUT FORMATTING
// ===================================================================
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Убираем начальные 8 или 7
    if (value.length > 0 && (value[0] === '8' || value[0] === '7')) {
        value = value.substring(1);
    }
    
    // Ограничиваем длину
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    // Форматируем
    let formatted = '+7';
    if (value.length > 0) {
        formatted += ' (' + value.substring(0, 3);
    }
    if (value.length >= 3) {
        formatted += ') ' + value.substring(3, 6);
    }
    if (value.length >= 6) {
        formatted += '-' + value.substring(6, 8);
    }
    if (value.length >= 8) {
        formatted += '-' + value.substring(8, 10);
    }
    
    input.value = formatted;
}

// ===================================================================
// NOTIFICATION SYSTEM
// ===================================================================
function showNotification(title, message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===================================================================
// TELEGRAM BOT INTEGRATION
// ===================================================================
async function sendToTelegram(formData) {
    if (!isBotConfigured) {
        console.error('Telegram bot не настроен!');
        showNotification(
            'Ошибка конфигурации',
            'Владелец сайта не настроил Telegram бота. Пожалуйста, свяжитесь по телефону.',
            'error'
        );
        return false;
    }
    
    const message = `
🔔 <b>Новая заявка с сайта</b>

👤 <b>Имя:</b> ${formData.name}
📞 <b>Телефон:</b> ${formData.phone}
🛠 <b>Услуга:</b> ${formData.service}
💬 <b>Сообщение:</b> ${formData.message || 'Не указано'}

📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}
    `;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка отправки в Telegram');
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// ===================================================================
// FORM SUBMISSION
// ===================================================================
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Получаем данные формы
    const formData = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.options[form.service.selectedIndex].text,
        message: form.message?.value.trim() || ''
    };
    
    // Валидация
    if (!formData.name || !formData.phone || !form.service.value) {
        showNotification(
            'Ошибка',
            'Пожалуйста, заполните все обязательные поля',
            'error'
        );
        return;
    }
    
    // Блокируем кнопку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    // Отправляем в Telegram
    const success = await sendToTelegram(formData);
    
    if (success) {
        showNotification(
            'Заявка отправлена!',
            'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
            'success'
        );
        form.reset();
        
        // Яндекс.Метрика - цель
        if (typeof ym !== 'undefined') {
            ym(104537472, 'reachGoal', 'form_submit');
        }
        
        // Google Analytics - событие
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': 'contact_form'
            });
        }
    } else {
        showNotification(
            'Ошибка отправки',
            'Не удалось отправить заявку. Пожалуйста, позвоните нам по телефону +7 (812) 923-20-07',
            'error'
        );
    }
    
    // Разблокируем кнопку
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
}

// ===================================================================
// HEADER SCROLL BEHAVIOR
// ===================================================================
let lastScroll = 0;

function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const currentScroll = window.pageYOffset;
    
    // Скрываем/показываем хедер
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    // Добавляем тень при скролле
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

// ===================================================================
// FLOATING BUTTON VISIBILITY
// ===================================================================
function handleFloatingButtons() {
    const scrollTopBtn = document.querySelector('.floating-top-btn');
    if (!scrollTopBtn) return;
    
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// ===================================================================
// SCROLL EVENT HANDLER
// ===================================================================
function handleScroll() {
    handleHeaderScroll();
    handleFloatingButtons();
}

// ===================================================================
// ARTICLE TOGGLE
// ===================================================================
function toggleArticle() {
    const article = document.getElementById('fullArticle');
    const button = event.target;
    
    if (!article || !button) return;
    
    if (article.classList.contains('active')) {
        article.classList.remove('active');
        button.textContent = 'Читать полную статью';
        button.classList.remove('active');
    } else {
        article.classList.add('active');
        button.textContent = 'Свернуть статью';
        button.classList.add('active');
        // Плавная прокрутка к началу статьи
        article.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ===================================================================
// PARALLAX EFFECT
// ===================================================================
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-background');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

// ===================================================================
// IMAGE LAZY LOADING
// ===================================================================
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('AZ ALMAZ - Судебная экспертиза - Инициализация...');
    
    // Проверка конфигурации Telegram бота
    const botWarning = document.getElementById('botSetupWarning');
    if (botWarning) {
        if (isBotConfigured) {
            botWarning.style.display = 'none';
        } else {
            console.warn('⚠️ Telegram bot не настроен! Форма не будет работать.');
        }
    }
    
    // Инициализация формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Форматирование телефона
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        // Начальное значение
        if (!phoneInput.value) {
            phoneInput.value = '+7';
        }
    }
    
    // Инициализация счетчиков статистики
    const statsSection = document.querySelector('.statistics');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Lazy loading для изображений
    setupLazyLoading();
    
    // Обработка скролла
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleParallax);
    handleScroll(); // Начальная проверка
    
    // Smooth scroll для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
    
    // Intersection Observer для анимаций
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдение за элементами для анимации
    document.querySelectorAll('.service-card, .timeline-item, .testimonial-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    console.log('✅ Инициализация завершена');
});

// ===================================================================
// PERFORMANCE MONITORING
// ===================================================================
window.addEventListener('load', function() {
    // Отправка метрик производительности
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log(`⚡ Время загрузки страницы: ${Math.round(loadTime)}ms`);
            
            // Отправка в Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'page_load',
                    'value': Math.round(loadTime),
                    'event_category': 'Performance'
                });
            }
        }
    }
});

// ===================================================================
// ERROR HANDLING
// ===================================================================
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    // Отправка критических ошибок в консоль
    if (event.error && event.error.stack) {
        console.error('Stack trace:', event.error.stack);
    }
});

// ===================================================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// ===================================================================
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.scrollToTop = scrollToTop;
window.scrollToContact = scrollToContact;
window.scrollToServices = scrollToServices;
window.toggleFAQ = toggleFAQ;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleArticle = toggleArticle;
