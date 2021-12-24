import {serializeError} from 'serialize-error';
import express from 'express';
import {TorrentSearchProvider} from "./torrentSearch.js";

const torrentSearchProvider = new TorrentSearchProvider(true);
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

/**
 * Torrent object
 * @typedef {Object} TorrentResult
 * @property {String} provider - Sito da che ospita il torrent
 * @property {String} title - Titolo
 * @property {String} time - Data in cui è stato caricato
 * @property {Number} seeds - Seeds disponibili
 * @property {Number} peers - Peers presenti
 * @property {String} size - Dimensione del file
 * @property {String} magnet - Magnet url
 * @property {String} desc - Link di descizione del torrent
 */

/**
 * @api {get} /search Cerca torrent
 * @apiGroup TorrentSearchProvider
 * @apiParam {String} query Parole chiave da cercare
 * @apiParam {String} category Categoria in cui cercare
 * @apiParam {Number} limit Limite numero di risultati
 * @apiSuccess {TorrentResult[]} result Lista di torrent che soddisfano la ricerca 
 * @apiError {Object} error Informazioni di debug riguardo l'eccezione sollevata
 * */
app.get("/search", (req, res) => {
    const query = req.query.q;
    const category = req.query.cat || undefined;
    const limit = req.query.limit || undefined;
    
    torrentSearchProvider
        .search(query, category, limit)
        .then((result) => {
            return res.json({ result: result });
        })
        .catch((err) => {
            console.log(err)
            res.status(400);
            return res.json({ result: [], err: serializeError(err) });
        });
});

/**
 * @api {get} /categories Ottieni lista delle catagorie disponibili
 * @apiGroup TorrentSearchProvider
 * @apiSuccess {String[]} result Lista della categorie disponibili
 * @apiError {Object} error Informazioni di debug riguardo l'eccezione sollevata
 * */
app.get("/categories", (req, res) => {
    const categories = torrentSearchProvider.getAvailableCategories();
    return res.json({ result: categories });
});

/**
 * @api {get} /providers Ottieni lista dei siti che verranno interrogati per la ricerca
 * @apiGroup TorrentSearchProvider
 * @apiSuccess {String[]} result Lista dei siti
 * @apiError {Object} error Informazioni di debug riguardo l'eccezione sollevata
 * */
app.get("/providers", (req, res) => {
    const providers = torrentSearchProvider.getActiveProviders();
    return res.json({ result: providers });
});

app.listen(port, () => {
    console.log(`TorrentSearch app listening at http://localhost:${port}`);
});
