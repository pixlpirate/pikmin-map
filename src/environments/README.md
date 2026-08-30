## Overpass API instances

Feel free to add instances here if you know any !

## Global instances : 
- https://overpass-api.de/api/interpreter
- https://overpass.openstreetmap.fr/api/interpreter
- https://overpass.private.coffee/api/interpreter

## Regional instances (those only work for a specific region, but are usually faster) :
- https://overpass.osm.ch/api/interpreter (Switzerland)



## Self-hosted mirror

`mirrorInstance` points at a [pikmin-map-data](https://github.com/pixlpirate/pikmin-map-data)
deployment - an Overpass-compatible SQLite mirror used as a fallback when the
public instances are overloaded.

- **development**: `/api/overpass.php`, forwarded by `proxy.conf.json` to a local
  checkout served by Apache (the Angular dev server cannot execute PHP).
- **production**: `/data/api/overpass.php` by default, assuming you alias the
  repository's `api/` folder on the same origin. A full URL works too - the
  endpoint sends `Access-Control-Allow-Origin: *`.
