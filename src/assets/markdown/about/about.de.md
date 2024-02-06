## Über

Diese Karte gibt Hinweise auf die wahrscheinlichen Standorte von Dekorationen im Spiel Pikmin Bloom. Die auf dieser Karte angezeigten Daten spiegeln möglicherweise nicht vollständig das wider, was im Spiel angezeigt wird.

Diese Anwendung ist nicht mit Nintendo oder Niantic Lab verbunden. Die Symbole der Dekorationskategorie stammen aus dem Spiel. Diese Anwendung wird von [pixelpirate] (https://pixelpirate.fr) entwickelt und gepflegt.

## Wie funktioniert es?

Um zu verstehen, wie diese Anwendung funktioniert, musst du verstehen, wie das Spiel die Position der Dekorationen bestimmt.

### Wie die Karte des Spiels funktioniert

Gelegentlich (ungefähr einmal im Jahr als grobe Schätzung, aber es ist sehr unregelmäßig) sammelt das Spiel Informationen über die Merkmale der Landschaft, Straßen und Gebäude.
Wenn der Spieler sich in der Umgebung bewegt, lädt das Spiel die Karte zusammen mit Informationen über die Umgebung des Spielers.
Wenn sich der Spieler zum Beispiel in der Nähe eines Restaurants befindet, zeigt das Spiel das Symbol **Restaurant** an.

### Datenquellen des Spiels

Wie stellt das Spiel nun fest, dass es an diesem Ort ein Restaurant gibt? Es scheint, dass das Spiel mindestens zwei Datenquellen verwendet:

- Open Street Map (OSM): Für Kartenhintergründe und den Großteil der geografischen Daten.
- Foursquare: Für einige geolokalisierte Daten.

### Funktionsweise dieser Karte

Diese Karte stützt sich ausschließlich auf Daten, die auf OSM verfügbar sind, es fehlen also die Foursquare-Daten. In unserem Beispiel scheinen Restaurants mit dem OSM-Tag `amenity=restaurant` verbunden zu sein.
Wenn die Deko **Restaurant** ausgewählt wird, bittet die Anwendung OSM, ihr die Objekte zu geben, die das Tag [`amenity=restaurant`](https://wiki.openstreetmap.org/wiki/Key:amenity) enthalten, und sie auf der Karte anzuzeigen.
OSM verfügt nicht über eine Funktion zum direkten Abrufen von Objekten für ein bestimmtes Tag. Diese Anwendung verwendet das Overpass-Turbo-Tool, um diese Daten abzurufen.

### Tipps

Diese Anwendung ist so konzipiert, dass sie an den Bildschirm Ihres Telefons angeheftet werden kann! Um dies zu tun
- Auf Android: Öffnen Sie Ihren Browser auf Ihrem Android-Telefon -> Gehen Sie zur Adresse dieser Anwendung -> Drücken Sie das Symbol mit den drei Punkten oben rechts auf dem Bildschirm und wählen Sie "Zum Startbildschirm hinzufügen".
- Unter iOS: Öffnen Sie Safari auf Ihrem iPhone -> Gehen Sie zur Adresse dieser Anwendung -> Drücken Sie auf das Freigabesymbol am unteren Rand des Bildschirms und wählen Sie "Zum Startbildschirm hinzufügen".

Diese Schritte können von einem Telefon zum anderen leicht variieren.