const { bot, passwordHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/password command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should generate a password of given length', () => {
        const ctx = {
            message: {
                text: '/password 10'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(10);
    });

    it('should handle default length when no length is provided', () => {
        const ctx = {
            message: {
                text: '/password'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(8);
    });

    it('should handle maximum length of 30', () => {
        const ctx = {
            message: {
                text: '/password 50'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(30);
    });

    it('should handle minimum length of 1', () => {
        const ctx = {
            message: {
                text: '/password 1'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(1);
    });

    it('should handle negative length by setting to default', () => {
        const ctx = {
            message: {
                text: '/password -5'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(8);
    });

    it('should handle length of 0 by setting to default', () => {
        const ctx = {
            message: {
                text: '/password 0'
            },
            reply: jest.fn()
        };

        passwordHandler(ctx);

        const password = ctx.reply.mock.calls[0][0].split(': ')[1];
        expect(password.length).toBe(8);
    });

    afterEach(() => {
        bot.stop('test');
    });
});
