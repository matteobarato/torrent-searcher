// Ottieni informazioni di denug nel caso si verificasse un errore lato server
const HttpError = {
    name: "Nome dell' errore",
    message: "Messaggio di errore",
    stack: "Stack trace invocato dall'errore"
}

// ####################
//          API
// ####################
// -----------------------------------------------------------------------
// HTTP [GET]: http://localohost:3000/search?q=Query&cat=Catgoria&limit=LimiteRisultati
// Cerca torrent
// -----------------------------------------------------------------------
const SearchResponse = {
    result : [TorrentResult, TorrentResult, TorrentResult], // lista di torrent che corrispondo alla ricerca
    error : HttpError || undefined // se non si verifica nessun errore
}

const TorrentResult = {
    provider: "Rarbg",
    title: "Venom.Let.There.Be.Carnage.2021.1080p.AMZN.WEBRip.DDP5.1.x264-alfaHD",
    time: "2021-11-23 02:37:30 +0000",
    seeds: 3270,
    peers: 295,
    size: "5.3 GB",
    magnet: "magnet:?xt:urn:btih:7d962ec9137989d19e346d7e68946e88d41fe991&dn:Venom.Let.There.Be.Carnage.2021.1080p.AMZN.WEBRip.DDP5.1.x264-alfaHD&tr:http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr:udp%3A%2F%2F9.rarbg.me%3A2990&tr:udp%3A%2F%2F9.rarbg.to%3A2730&tr:udp%3A%2F%2Ftracker.thinelephant.org%3A12710&tr:udp%3A%2F%2Ftracker.fatkhoala.org%3A13800",
    desc: "https://torrentapi.org/redirect_to_info.php?token:nif4xqmgs3&p:2_6_5_2_1_5_6__7d962ec913",
}

// -----------------------------------------------------------------------
// HTTP [GET]: http://localohost:3000/categories
// Ottieni la lista di tutte le categorie disponibili nella ricerca
// -----------------------------------------------------------------------
const CategoriesResponse = {
    result:['All', 'Movies', 'Music'],
    error : HttpError || undefined // se non si verifica nessun errore
}

// -----------------------------------------------------------------------
// HTTP [GET]: http://localohost:3000/providers
// Ottieni la lista di tutti i siti  in cui verranno cercati i risultati
// -----------------------------------------------------------------------
const CategoriesResponse = {
    result:['KickassTorrents', 'ThePirateBay', '1337x'],
    error : HttpError || undefined // se non si verifica nessun errore
}

