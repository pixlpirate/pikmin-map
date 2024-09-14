import { LatLng } from "leaflet";
import { Decor } from "./decor.interface";

export interface OverpassTurboResult
{
	id: number;
	name: string;
	type: string;
	geometry: LatLng[];
	decors: Decor[];
}
