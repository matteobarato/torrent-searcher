import  TorrentSearchApi from "torrent-search-api";
import { CacheContainer } from 'node-ts-cache'
import { NodeFsStorage } from "node-ts-cache-storage-node-fs"

const tsCache = new CacheContainer(new NodeFsStorage('./cache/torrent-search-cache.json'))

const calculateKeyCache = function (params) {
    let key = ''
    for (let p of params){
        key += p ? p.toString().toLowerCase()+'&' : '' 
    }
    key = key.slice(0, -1); 
    return key
}

/** Torrent Search Api Provider. */
export class TorrentSearchProvider {
    /**
     * Initialize class.
     * @constructor
     * @param {boolean} verbose - Log verbosity for debug purpose.
     */
    constructor(verbose = false) {
        this.verbose = verbose;
        this.query_limit = 200
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
    async search(query, category, limit = 50) {
        if (category && !this.assertCategory(category))
            throw new Error(`Category "${category}" is not available. Choose between: "${this.api_categories}"`);

        let torrents = []
        let cachedResult = await tsCache.getItem(calculateKeyCache([query,category,limit]))

        if (cachedResult){
            torrents = cachedResult
        }else{
            torrents = await this.api.search(query, category, Math.min(limit, this.query_limit));
            await tsCache.setItem(calculateKeyCache([query,category,limit]), torrents, {ttl: 60*60*24}) // ttl:1day
        }

        this._l("search torrents", torrents);
        torrents = torrents.filter(x=> x.seeds || x.peers || x.numFiles)
        torrents = torrents.map(x=> {x['hash'] = this.extractHashFromMagnet(x.magnet); return x})
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

    extractHashFromMagnet(magnet){
        if (!magnet) return '';
        const current_url = new URL(magnet);
        const search_params = current_url.searchParams;
        const hash = search_params.get('xt');
        return hash;
    }

}

