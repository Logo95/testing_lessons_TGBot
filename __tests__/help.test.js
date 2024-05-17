const { helpHandler } = require('../index');  // Импортируем обработчик команды

describe('/help command', () => {
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
});
