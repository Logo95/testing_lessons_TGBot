const fetch = require('node-fetch');
const { jokeHandler } = require('../index');  // Импортируем обработчик команды

jest.mock('node-fetch', () => jest.fn());

describe('/joke command', () => {
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
});
