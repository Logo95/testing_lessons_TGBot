const { bot, randomHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/random command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should generate a random number within the given range', () => {
        const ctx = {
            message: {
                text: '/random 1 10'
            },
            reply: jest.fn()
        };

        randomHandler(ctx);

        const response = parseInt(ctx.reply.mock.calls[0][0].split(': ')[1], 10);
        expect(response).toBeGreaterThanOrEqual(1);
        expect(response).toBeLessThanOrEqual(10);
    });

    it('should handle invalid range', () => {
        const ctx = {
            message: {
                text: '/random 10 1'
            },
            reply: jest.fn()
        };

        randomHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Пожалуйста, укажите корректный диапазон чисел. Пример: /random 1 10');
    });

    it('should handle equal min and max', () => {
        const ctx = {
            message: {
                text: '/random 5 5'
            },
            reply: jest.fn()
        };

        randomHandler(ctx);

        const response = ctx.reply.mock.calls[0][0];
        expect(response).toBe('Случайное число: 5');
    });

    it('should handle non-numeric min and max', () => {
        const ctx = {
            message: {
                text: '/random a b'
            },
            reply: jest.fn()
        };

        randomHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Пожалуйста, укажите корректный диапазон чисел. Пример: /random 1 10');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
