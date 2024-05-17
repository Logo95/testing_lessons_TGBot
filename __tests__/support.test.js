const { supportHandler } = require('../index');  // Импортируем обработчик команды

describe('/support command', () => {
    it('should send a support request to admin', () => {
        const ctx = {
            message: {
                text: '/support help'
            },
            from: {
                username: 'testuser'
            },
            reply: jest.fn()
        };

        supportHandler(ctx);

        expect(ctx.reply).toHaveBeenCalledWith('Ваш запрос на помощь отправлен администратору.');
    });
});
