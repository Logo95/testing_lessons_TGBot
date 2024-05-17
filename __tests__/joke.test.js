const fetch = require('node-fetch');
const { bot, jokeHandler } = require('../index');  // Импортируем бот и обработчик команды

jest.mock('node-fetch', () => jest.fn());

describe('/joke command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should return a joke', async () => {
        const ctx = {
            reply: jest.fn()
        };

        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ value: 'Chuck Norris joke' })
        });

        await jokeHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Chuck Norris joke');
    });

    it('should handle errors', async () => {
        const ctx = {
            reply: jest.fn()
        };

        fetch.mockRejectedValue(new Error('Network Error'));

        await jokeHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении шутки.');
    });

    it('should handle empty joke response', async () => {
        const ctx = {
            reply: jest.fn()
        };

        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({})
        });

        await jokeHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении шутки.');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
