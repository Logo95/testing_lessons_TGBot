const { bot, authHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/auth command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should authorize user with correct key', () => {
        const ctx = {
            message: {
                text: '/auth secret'
            },
            session: {},
            reply: jest.fn()
        };

        authHandler(ctx);
        expect(ctx.session.authorized).toBe(true);
        expect(ctx.reply).toHaveBeenCalledWith('Вы успешно авторизованы!');
    });

    it('should not authorize user with incorrect key', () => {
        const ctx = {
            message: {
                text: '/auth wrongkey'
            },
            session: {},
            reply: jest.fn()
        };

        authHandler(ctx);
        expect(ctx.session.authorized).toBeFalsy();
        expect(ctx.reply).toHaveBeenCalledWith('Неверный ключ авторизации!');
    });

    it('should prompt for key if none is provided', () => {
        const ctx = {
            message: {
                text: '/auth'
            },
            session: {},
            reply: jest.fn()
        };

        authHandler(ctx);
        expect(ctx.session.authorized).toBeFalsy();
        expect(ctx.reply).toHaveBeenCalledWith('Неверный ключ авторизации!');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
