# torrent-searcher
Nel file /api/apidoc/index.html trovi la documentazione delle API dispinibili lato server. 

API:
- [GET] /search?q=Avengers&cat=Movie => {q: query di ricerca, cat: categoria in cui cercare (opzionale)}
Restituisce una lista di torrent corrsipondenti alla ricerca.
- [GET] /categories
Restituisce la lista delle categorie disponibili per la ricerca.
- [GET] /providers
Restituisce la lista dei siti torrent che verranno interrogati per la ricerca
