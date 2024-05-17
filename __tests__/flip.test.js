const { bot, flipHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/flip command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should return either "Орел" or "Решка"', () => {
        const ctx = {
            reply: jest.fn()
        };

        flipHandler(ctx);

        const response = ctx.reply.mock.calls[0][0];
        expect(['Орел', 'Решка']).toContain(response);
    });

    it('should return "Орел" multiple times in a row', () => {
        const ctx = {
            reply: jest.fn()
        };

        jest.spyOn(Math, 'random').mockReturnValue(0.2); // Всегда возвращает "Орел"
        flipHandler(ctx);
        flipHandler(ctx);
        flipHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledTimes(3);
        ctx.reply.mock.calls.forEach(call => {
            expect(call[0]).toBe('Орел');
        });

        Math.random.mockRestore();
    });

    it('should return "Решка" multiple times in a row', () => {
        const ctx = {
            reply: jest.fn()
        };

        jest.spyOn(Math, 'random').mockReturnValue(0.8); // Всегда возвращает "Решка"
        flipHandler(ctx);
        flipHandler(ctx);
        flipHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledTimes(3);
        ctx.reply.mock.calls.forEach(call => {
            expect(call[0]).toBe('Решка');
        });

        Math.random.mockRestore();
    });

    afterEach(() => {
        bot.stop('test');
    });
});
