import  TorrentSearchApi from "torrent-search-api";

/** Torrent Search Api Provider. */
export class TorrentSearchProvider {
    /**
     * Initialize class.
     * @constructor
     * @param {boolean} verbose - Log verbosity for debug purpose.
     */
    constructor(verbose = false) {
        this.verbose = verbose;
        this.query_limit = 100
        this.api = TorrentSearchApi;
        this.api.enablePublicProviders();
        this.api_categories = this.getAvailableCategories();
    }

    /**
     * Search torrent.
     * @async
     * @param {string} query - Query to search.
     * @param {boolean} category - Category filter.
     * @param {boolean} limit - Limit the result to a number.
     * @return {torrent array} List of torrents matching the query
     */
    async search(query, category, limit = 20) {
        if (category && !this.assertCategory(category))
            throw new Error(`Category "${category}" is not available. Choose between: "${this.api_categories}"`);

        let torrents = await this.api.search(query, category, Math.min(limit, this.query_limit));
        this._l("search torrents", torrents);
        return torrents;
    }

    /**
     * Get the list of active providers.
     * @return {object[]} List of providers currently active.
     */
    getActiveProviders() {
        return this.api.getActiveProviders();
    }

    /**
     * Get the list of available categories between providers.
     * @return {object[]} List of category currently active.
     */
    getAvailableCategories() {
        const providers_categories = this.api
            .getActiveProviders()
            .map((x) => x["categories"]);
        const categories = [].concat
            .apply([], providers_categories)
            .filter((v, i, a) => a.indexOf(v) === i);
        return categories;
    }

    /**
     * Check if category is available between providers.
     * @param {string} Name of category.
     * @return {boolean} True if exists otherwise false.
     */
    assertCategory(category) {
        return this.api_categories
            .map((x) => x.toLowerCase())
            .includes(category.toLowerCase());
    }

    _l(label, item, level = "log", force = false) {
        if (this.verbose)
            return console[level](`|${label.toUpperCase()}|`, item);
    }

}

// TEST
// (async () => {
//     const TS = new TorrentSearchProvider(true);
//     console.log(TS.availableCategories());

//     const torrent = await TS.search("1080p ita", "Movies");
//     console.log(torrent);
// })();


