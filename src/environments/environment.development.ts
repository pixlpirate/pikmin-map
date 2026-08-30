export const environment = {
	production: false,
	toastDuration: 3500,
	overpassInstance: 'https://overpass-api.de/api/interpreter',

	// Reached through proxy.conf.json, which forwards /api to the local
	// pikmin-map-data checkout served by Apache.
	mirrorInstance: '/api/overpass.php'
};
