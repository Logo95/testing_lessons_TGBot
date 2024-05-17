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

    afterEach(() => {
        bot.stop('test');
    });
});
