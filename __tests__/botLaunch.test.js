const { bot } = require('../index');  // Импортируем бот

describe('Bot launch', () => {
    it('should launch the bot', () => {
        jest.spyOn(bot, 'launch').mockImplementation(() => {});
        bot.launch();
        expect(bot.launch).toHaveBeenCalled();
    });
});
