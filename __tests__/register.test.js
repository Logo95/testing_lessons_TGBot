const { bot, registerHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/register command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should register user with given full name', () => {
        const ctx = {
            message: {
                text: '/register John Doe'
            },
            reply: jest.fn()
        };

        registerHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Вы зарегистрированы как John Doe');
    });

    it('should handle missing full name', () => {
        const ctx = {
            message: {
                text: '/register'
            },
            reply: jest.fn()
        };

        registerHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Вы зарегистрированы как ');
    });

    it('should handle special characters in full name', () => {
        const ctx = {
            message: {
                text: '/register J@ne D0e'
            },
            reply: jest.fn()
        };

        registerHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Вы зарегистрированы как J@ne D0e');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
