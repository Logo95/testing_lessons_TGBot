const { Telegraf } = require('telegraf');
const { registerHandler } = require('../index');  // Импортируем обработчик команды

describe('/register command', () => {
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
});
