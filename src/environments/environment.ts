export const environment = {
	production: true,
	toastDuration: 3500,
	overpassInstance: 'https://overpass-api.de/api/interpreter',

	// Self-hosted mirror. Cross-origin, so the API allowlists
	// this app's origin; see that repository's api/overpass.php.
	mirrorInstance: 'https://api.pikmin-map.pixelpirate.fr/overpass.php'
};
