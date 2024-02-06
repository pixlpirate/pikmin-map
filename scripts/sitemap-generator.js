// sitemap-generator.js
const fs = require( 'fs' );
const config = require( '../angular.json' );
const outputPath = config.projects[Object.keys( config.projects )[0]].architect.build.options.outputPath;

const BASE_URL = 'https://pikmin-map.pixelpirate.fr';
let routes = [
	{
		path: '/',
		changefreq: 'monthly',
		priority: 1.0
	},
	{
		path: '/about',
		changefreq: 'monthly',
		priority: 0.8
	}
];

routes.map( route =>
{
	route.lastmod = new Date().toISOString().split( 'T' )[0];
	route.path = `${BASE_URL}${route.path}`;
} );


const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map( route => `	<url>
		<loc>${route.path}</loc>
		<lastmod>${route.lastmod}</lastmod>
		<changefreq>${route.changefreq}</changefreq>
		<priority>${route.priority}</priority>
	</url>`).join( '\n' )}
</urlset>`;

fs.writeFileSync( `./${outputPath}/browser/sitemap.xml`, sitemap );