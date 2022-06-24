"use strict";
/**
 * The main controller for the game
 */
class Game {
    /**
     * Creates a new Game
     */
    constructor(player, moneyGenerator, ticker) {
        this.player = ko.observable(player);
        this.moneyGenerator = ko.observable(moneyGenerator);
        this.ticker = ko.observable(ticker);
        this.currentPanel = ko.observable(Game.defaultPanel);
        this.initialise();
    }
    /**
     * Restores a game from saved JSON
     * @returns the restored Game
     */
    static restore(savedGame) {
        if (savedGame !== null) {
            const savedPlayer = Player.restore(savedGame.player);
            const savedMoneyGenerator = MoneyGenerator.restore(savedGame.moneyGenerator, savedPlayer);
            const savedTicker = Ticker.restore(savedGame.ticker, savedPlayer);
            const game = new Game(savedPlayer, savedMoneyGenerator, savedTicker);
            game.currentPanel(savedGame.currentPanel);
            return game;
        }
        const player = Player.restore(null);
        const moneyGenerator = MoneyGenerator.restore(null, player);
        const ticker = Ticker.restore(null, player);
        var game = new Game(player, moneyGenerator, ticker);
        return game;
    }
    /**
     * Changes the currently visible panel to the specified string
     * @param panelName - The name of the panel which should be visible
     */
    changePanel(panelName) {
        this.currentPanel(panelName);
        // Reset their company selection so the player is presented with a fresh panel
        this.ticker().stockExchange().selectedCompany(null);
    }
    /**
     * Creates a new JSON object representing the current object
     * @returns the JSON object representing the current object
     */
    toJSON() {
        return {
            player: this.player().toJSON(),
            moneyGenerator: this.moneyGenerator().toJSON(),
            ticker: this.ticker().toJSON(),
            currentPanel: this.currentPanel()
        };
    }
    /**
     * Initialises any objects that make up the current view model
     */
    initialise() {
        this.moneyGenerator().watchCurrentTime();
        this.ticker().startTicking();
    }
}
/**
 * The first panel that the player will see upon entering the game
 */
Game.defaultPanel = "MoneyGenerator";
//# sourceMappingURL=game.js.map