## Data sources

- `mirrorInstance`: the self-hosted mirror, asked first. A
  [pikmin-map-data](https://github.com/pixlpirate/pikmin-map-data) deployment, an
  Overpass-compatible SQLite copy of the OSM data this map queries, refreshed by hand
  about every six months or when the game updates its map.
- `overpassInstance`: the public Overpass instance (overpass-api.de), used only
  when the mirror cannot answer: the area is not covered (it answers 404), the query
  is not supported, or it is down or too slow.

The About page ("Data source") lets users pick between these two, and remembers the choice once it has
been made (the mirror is the default).

Please do not add other public Overpass instances here: they are run by volunteers
who pay for them, and their terms of use apply.

## Self-hosted mirror

- **development**: the deployed mirror, which allows `http://localhost:4200`. To use a
  local checkout instead, set it to `/api/overpass.php` and forward `/api` with
  `proxy.conf.json` (copy `proxy.conf.example.json`, then
  `ng serve --proxy-config proxy.conf.json`); the Angular dev server cannot execute PHP.
- **production**: a full URL. The endpoint answers CORS itself and allowlists this
  app's origin.
