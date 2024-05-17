const axios = require('axios');
const { bot, convertHandler } = require('../index');  // Импортируем бот и обработчик команды

jest.mock('axios');

describe('/convert command', () => {
    beforeEach(() => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        jest.spyOn(bot, 'stop').mockImplementation(() => {});
        bot.launch();
    });

    it('should convert currency successfully', async () => {
        const ctx = {
            message: {
                text: '/convert 100 USD EUR'
            },
            reply: jest.fn()
        };

        axios.get.mockResolvedValue({
            data: {
                rates: {
                    EUR: 0.85
                }
            }
        });

        await convertHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('100 USD = 85.00 EUR');
    });

    it('should handle invalid currencies', async () => {
        const ctx = {
            message: {
                text: '/convert 100 USD XYZ'
            },
            reply: jest.fn()
        };

        axios.get.mockResolvedValue({
            data: {
                rates: {}
            }
        });

        await convertHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Ошибка: Невозможно найти курс обмена для указанных валют');
    });

    it('should handle API errors', async () => {
        const ctx = {
            message: {
                text: '/convert 100 USD EUR'
            },
            reply: jest.fn()
        };

        axios.get.mockRejectedValue(new Error('Network Error'));

        await convertHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при конвертации валюты');
    });

    afterEach(() => {
        bot.stop('test');
    });
});
