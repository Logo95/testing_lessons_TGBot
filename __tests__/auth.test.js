const { authHandler } = require('../index');  // Импортируем обработчик команды

describe('/auth command', () => {
    it('should authorize user with correct key', () => {
        const ctx = {
            message: {
                text: '/auth secret'
            },
            session: {},
            reply: jest.fn()
        };

        authHandler(ctx);
        expect(ctx.session.authorized).toBe(true);
        expect(ctx.reply).toHaveBeenCalledWith('Вы успешно авторизованы!');
    });

    it('should not authorize user with incorrect key', () => {
        const ctx = {
            message: {
                text: '/auth wrongkey'
            },
            session: {},
            reply: jest.fn()
        };

        authHandler(ctx);
        expect(ctx.session.authorized).toBeFalsy();
        expect(ctx.reply).toHaveBeenCalledWith('Неверный ключ авторизации!');
    });
});
