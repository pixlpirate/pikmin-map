import { LatLngBounds } from "leaflet";

export interface NominatimResult
{
	name: string;
	bbox: LatLngBounds;
}
