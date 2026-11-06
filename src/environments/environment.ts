export const environment = {
	production: true,
	toastDuration: 3500,
	// Only used when the mirror cannot answer
	overpassInstance: 'https://overpass-api.de/api/interpreter',

	// Self-hosted mirror, asked first. Cross-origin, so the API allowlists
	// this app's origin; see that repository's api/overpass.php.
	mirrorInstance: 'https://api.pikmin-map.pixelpirate.fr/overpass.php'
};
