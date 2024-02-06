## Informazioni

Questa mappa fornisce indizi sulla probabile posizione delle decorazioni nel gioco Pikmin Bloom. I dati visualizzati su questa mappa potrebbero non rispecchiare completamente quelli visualizzati nel gioco.

Questa applicazione non è affiliata a Nintendo o a Niantic Lab. Le icone delle categorie di decorazioni e l'illustrazione del fiore rosso provengono dal gioco. Questa applicazione è sviluppata e gestita da [pixelpirate](https://pixelpirate.fr).

## Come funziona?

Per capire come funziona questa applicazione, è necessario comprendere come il gioco determina la posizione delle decorazioni.

### Come funziona la mappa del gioco

Di tanto in tanto (circa una volta all'anno per dare un'idea, ma è molto irregolare), il gioco raccoglie informazioni sulle caratteristiche del paesaggio, delle strade e degli edifici.
Mentre il giocatore si muove nell'ambiente, il gioco carica la mappa, insieme alle informazioni su ciò che lo circonda.
Ad esempio, se il giocatore si trova vicino a un ristorante, il gioco visualizzerà l'icona **restaurant**.

### Fonti di dati del gioco

Ora, come fa il gioco a determinare che c'è un ristorante in questa posizione? Sembra che il gioco utilizzi almeno due fonti di dati:

- Open Street Map (OSM): Per gli sfondi delle mappe e la maggior parte dei dati geolocalizzati.
- Foursquare: Per alcuni dati geolocalizzati.

### Funzionamento di questa carta

Questa mappa si basa esclusivamente sui dati disponibili su OSM; mancano quindi i dati di Foursquare. Nel nostro esempio, i ristoranti sembrano essere associati al tag OSM `amenity=restaurant`.
Quando si seleziona il deco **ristorante**, l'applicazione chiede a OSM di fornirle gli oggetti che contengono il tag [`amenity=restaurant`](https://wiki.openstreetmap.org/wiki/Key:amenity) e di visualizzarli sulla mappa.
OSM non dispone di una funzione per recuperare direttamente gli oggetti per un particolare tag. Questa applicazione utilizza lo strumento Overpass-Turbo per recuperare questi dati.

### Suggerimenti

Questa applicazione è stata progettata per essere appuntata sullo schermo del telefono! Per farlo
- Su Android: Aprire il browser sul telefono Android -> Andare all'indirizzo di questa applicazione -> Premere l'icona con tre punti in alto a destra dello schermo e selezionare "Aggiungi alla schermata iniziale".
- Su iOS: Aprire Safari sull'iPhone -> Andare all'indirizzo di questa applicazione -> Premere l'icona di condivisione nella parte inferiore dello schermo e selezionare "Aggiungi alla schermata iniziale".

Questi passaggi possono variare leggermente da un telefono all'altro.