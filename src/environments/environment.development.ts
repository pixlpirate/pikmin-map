export const environment = {
	production: false,
	toastDuration: 3500,
	// Only used when the mirror cannot answer
	overpassInstance: 'https://overpass-api.de/api/interpreter',

	// The deployed mirror, which allows http://localhost:4200, so that nothing
	// needs setting up to run the app. To try a local pikmin-map-data checkout
	// instead, use '/api/overpass.php' and forward /api with proxy.conf.json
	// (see proxy.conf.example.json and src/environments/README.md).
	mirrorInstance: 'https://api.pikmin-map.pixelpirate.fr/overpass.php'
};
