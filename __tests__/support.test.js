const { bot, supportHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/support command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        jest.spyOn(bot.telegram, 'sendMessage').mockImplementation(() => Promise.resolve());  // Мокируем sendMessage
        bot.launch();
    });

    it('should send a support request to admin', () => {
        const ctx = {
            message: {
                text: '/support help'
            },
            from: {
                username: 'testuser'
            },
            reply: jest.fn()
        };

        supportHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Ваш запрос на помощь отправлен администратору.');
        // Проверка отправки сообщения админу
        expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
            '851460416',
            'Пользователь @testuser запрашивает помощь: help'
        );
    });

    it('should handle empty support message', () => {
        const ctx = {
            message: {
                text: '/support'
            },
            from: {
                username: 'testuser'
            },
            reply: jest.fn()
        };

        supportHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Ваш запрос на помощь отправлен администратору.');
        // Проверка отправки сообщения админу
        expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
            '851460416',
            'Пользователь @testuser запрашивает помощь: '
        );
    });

    afterEach(() => {
        bot.stop('test');
    });
});
