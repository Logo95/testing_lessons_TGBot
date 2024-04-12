const { Telegraf, session } = require('telegraf');
const config = require('./config');
const bot = new Telegraf (config.telegramToken);
const axios = require('axios');
const currencySymbolMap = require('currency-symbol-map');


// Используем сессии для хранения состояния авторизации пользователя
bot.use(session());

// Функция для проверки авторизации пользователя
function checkAuthorization(ctx, next) {
    ctx.session = ctx.session || {};
    if (ctx.session && ctx.session.authorized) {
        next();
    } else {
        ctx.reply('Вы не авторизованы. Введите /auth <ключ> для авторизации.');
    }
}

// Настройка обработчиков команд

// Настройка запуска
bot.start((ctx) => ctx.reply('Добро пожаловать! Введите /help для получения справки.'));

// Авторизации с использованием ключа
bot.command('auth', (ctx) => {
    const inputKey = ctx.message.text.split(' ')[1];
    const authKey = 'secret';

    if (inputKey === authKey) {
        ctx.session = ctx.session || {};
        ctx.session.authorized = true;
        ctx.reply('Вы успешно авторизованы!');
    } else {
        ctx.reply('Неверный ключ авторизации!');
    }
});

// Проверка на авторизацию
bot.use((ctx, next) => {
    if (ctx.message.text.startsWith('/help')) {
        next();
    } else {
        checkAuthorization(ctx, next);
    }
});

// Обработка справки
bot.command('help', (ctx) => {
    ctx.reply(`
        Список команд:
        /auth <ключ> - авторизация
        /register <ФИО> - регистрация
        /help - получить справку
        /support - отправить запрос на помощь администратору
        /password <длина> - сгенерировать пароль заданной длины (от 1 до 30 символов)
        /weather - погода в Санкт-Петербурге
        /joke - получить случайную шутку про Чакка Норриса
        /flip - подбросить монетку
        /random <a> <b> - сгенерировать случайное число в диапазоне [a;b]
        /convert <количество> <валюта_1> <валюта_2> - конвертировать из валюты_1 в валюту_2
        /currencies - вывести список доступных сокращений валют
    `);
});

// Регистрация пользователя по ФИО
bot.command('register', (ctx) => {
    const fullName = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(`Вы зарегистрированы как ${fullName}`);
});

// Запрос помощи у администратора бота
bot.command('support', (ctx) => {
    const adminChatId = '851460416';
    const userMessage = ctx.message.text.split(' ').slice(1).join(' ');
    const userRequest = `Пользователь @${ctx.from.username} запрашивает помощь: ${userMessage}`;
    bot.telegram.sendMessage(adminChatId, userRequest);
    ctx.reply('Ваш запрос на помощь отправлен администратору.');
});

// bot.command('getChatId', (ctx) => {
//     ctx.reply(`ID вашего чата: ${ctx.chat.id}`);
// });

/* chatID
851460416
*/

// Генерация пароля
bot.command('password', (ctx) => {
    let length = parseInt(ctx.message.text.split(' ')[1]) || 8;
    if (length > 30) length = 30;
    if (length < 0) length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!%?";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    ctx.reply(`Ваш пароль: ${password}`);
});

// Получение погоды
bot.command('weather', async (ctx) => {
    //const apiKey = '24f2c5c8054a09cc970f41f4d2db9c34';
    const apiKey = config.openWeatherMapApiKey;
    const city = 'Saint Petersburg';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        
        const message = `Погода в ${city} на сегодня: ${weatherDescription}\nТемпература: ${temperature}°C\nОщущается как: ${feelsLike}°C`;
        
        ctx.reply(message);
    } catch (error) {
        console.error('Ошибка при получении погоды:', error);
        ctx.reply('Произошла ошибка при получении данных о погоде.');
    }
});

// Случайная шутка
bot.command('joke', async (ctx) => {
    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        ctx.reply(data.value);
    } catch (error) {
        ctx.reply('Произошла ошибка при получении шутки.');
    }
});

// Подброс монетки
bot.command('flip', (ctx) => {
    const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
    ctx.reply(result);
});

// Рандомное число
bot.command('random', (ctx) => {
    const [min, max] = ctx.message.text.split(' ').slice(1).map(Number);
    if (!isNaN(min) && !isNaN(max) && min < max) {
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        ctx.reply(`Случайное число: ${result}`);
    } else {
        ctx.reply('Пожалуйста, укажите корректный диапазон чисел. Пример: /random 1 10');
    }
});

// Конвертация валют
bot.command('convert', async (ctx) => {
    const apiKey = config.open_erApiKey;
    const [amount, fromCurrency, toCurrency] = ctx.message.text.split(' ').slice(1);
    
    try {
        // Получаем курс обмена
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}?apiKey=${apiKey}`);
        const exchangeRate = response.data.rates[toCurrency];
        
        // Проверяем, что курс обмена получен успешно
        if (exchangeRate) {
            // Вычисляем конвертированную сумму
            const convertedAmount = parseFloat(amount) * exchangeRate;
            ctx.reply(`${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
        } else {
            ctx.reply('Ошибка: Невозможно найти курс обмена для указанных валют');
        }
    } catch (error) {
        console.error('Ошибка при получении курса обмена:', error);
        ctx.reply('Произошла ошибка при конвертации валюты');
    }
});

// Функция для плучения сокращений валют
async function getCurrencyList() {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        const currencies = Object.keys(response.data.rates);
        return currencies.join('\n');
    } catch (error) {
        console.error('Ошибка при получении списка валют:', error);
        return 'Произошла ошибка при получении списка валют.';
    }
}

// Команда для вывода списка доступных валютных сокращений
bot.command('currencies', async (ctx) => {
    try {
        const currencyList = await getCurrencyList();
        ctx.reply(`Доступные валюты:\n${currencyList}`);
    } catch (error) {
        console.error('Ошибка при получении списка валют:', error);
        ctx.reply('Произошла ошибка при получении списка валют.');
    }
});

// Обработка неверных команд
bot.on('message', (ctx) => {
    ctx.reply('Неизвестная команда. Введите /help для списка команд.');
});

// Запуск бота
bot.launch();