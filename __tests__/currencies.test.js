const axios = require('axios');
const { bot, currenciesHandler } = require('../index');  // Импортируем бот и обработчик команды

jest.mock('axios');

describe('/currencies command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should return a list of available currencies', async () => {
        const ctx = {
            reply: jest.fn()
        };

        axios.get.mockResolvedValue({
            data: {
                rates: {
                    USD: 1.0,
                    EUR: 0.85,
                    GBP: 0.75
                }
            }
        });

        await currenciesHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('USD'));
        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('EUR'));
        expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('GBP'));
    });

    it('should handle API errors', async () => {
        const ctx = {
            reply: jest.fn()
        };

        axios.get.mockRejectedValue(new Error('Network Error'));

        await currenciesHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении списка валют.');
    });

    it('should return empty list when no currencies are available', async () => {
        const ctx = {
            reply: jest.fn()
        };

        axios.get.mockResolvedValue({
            data: {
                rates: {}
            }
        });

        await currenciesHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Доступные валюты:\n');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
