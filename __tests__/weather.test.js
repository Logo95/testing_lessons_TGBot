const axios = require('axios');
const { weatherHandler } = require('../index');  // Импортируем обработчик команды

jest.mock('axios');

describe('/weather command', () => {
    it('should return weather information for Saint Petersburg', async () => {
        const ctx = {
            reply: jest.fn()
        };

        axios.get.mockResolvedValue({
            data: {
                weather: [{ description: 'clear sky' }],
                main: { temp: 25, feels_like: 27 }
            }
        });

        await weatherHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith(
            'Погода в Saint Petersburg на сегодня: clear sky\nТемпература: 25°C\nОщущается как: 27°C'
        );
    });

    it('should handle errors', async () => {
        const ctx = {
            reply: jest.fn()
        };

        axios.get.mockRejectedValue(new Error('Network Error'));

        await weatherHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Произошла ошибка при получении данных о погоде.');
    });
});
