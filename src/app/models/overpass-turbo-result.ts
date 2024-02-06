import { LatLng } from "leaflet";
import { Decor } from "./decor";

export interface OverpassTurboResult
{
	id: number;
	name: string;
	type: string;
	geometry: LatLng[];
	decors: Decor[];
}
