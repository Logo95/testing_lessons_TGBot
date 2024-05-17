const { bot, helpHandler } = require('../index');  // Импортируем бот и обработчик команды

describe('/help command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should return the list of commands', () => {
        const ctx = {
            reply: jest.fn()
        };

        helpHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('/auth <ключ> - авторизация'));
        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('/register <ФИО> - регистрация'));
        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('/weather - погода в Санкт-Петербурге'));
        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('/joke - получить случайную шутку про Чакка Норриса'));
    });

    afterEach(() => {
        bot.stop('test');
    });
});
