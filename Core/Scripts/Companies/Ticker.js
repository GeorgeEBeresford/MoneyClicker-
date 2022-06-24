"use strict";
/**
 * An object that monitors the different companies and provides statistics for how well each company is doing
 */
class Ticker {
    /**
     * Creates a new Ticker
     * @param player - A reference to the current player so we can track their owned stock // Todo - refactor this out of the Player object and into the StockExchange object
     */
    constructor(stockExchange) {
        this.tickerInterval = ko.observable(5000);
        this.maxPreviewedCompanies = ko.observable(5);
        this.stockExchange = ko.observable(stockExchange);
        this.companiesPreview = ko.computed(() => {
            if (this.stockExchange() === null) {
                return [];
            }
            const companies = this.stockExchange().companies();
            const filteredCompanies = companies.filter((company) => {
                return company.stockValueChange() !== 0;
            });
            const sortedCompanies = filteredCompanies.sort((previousCompany, currentCompany) => {
                return currentCompany.lastUpdated().getTime() - previousCompany.lastUpdated().getTime();
            });
            return sortedCompanies.slice(0, this.maxPreviewedCompanies());
        });
    }
    /**
     * Restores a Ticker object that has been saved
     * @param savedTicker - A JSON object representing a ViewModel
     * @param player - A reference to the current player so we can track their owned stock // Todo - refactor this out of the Player object and into the StockExchange object
     * @returns the restored Ticker object
     */
    static restore(savedTicker, player) {
        if (savedTicker !== null) {
            const savedStockExchange = StockExchange.restore(savedTicker.stockExchange, player);
            const ticker = new Ticker(savedStockExchange);
            ticker.maxPreviewedCompanies(savedTicker.maxPreviewedCompanies);
            ticker.tickerInterval(savedTicker.tickerInterval);
            return ticker;
        }
        const stockExchange = StockExchange.restore(null, player);
        const ticker = new Ticker(stockExchange);
        return ticker;
    }
    /**
     * Creates a new JSON object representing the current object
     * @returns the JSON object representing the current object
     */
    toJSON() {
        return {
            maxPreviewedCompanies: this.maxPreviewedCompanies(),
            stockExchange: this.stockExchange().toJSON(),
            tickerInterval: this.tickerInterval()
        };
    }
    /**
     * Starts ticking over and updating the companies over time
     */
    startTicking() {
        const tickerDelay = this.tickerInterval();
        const interval = setInterval(() => {
            const companies = this.stockExchange().companies();
            companies.forEach(company => {
                company.makeRandomChange();
            });
        }, tickerDelay);
        this.tickerInterval.subscribe(() => {
            clearInterval(interval);
            this.startTicking();
        });
    }
}
//# sourceMappingURL=ticker.js.map