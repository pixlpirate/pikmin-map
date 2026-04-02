import { Decor } from "./decor.interface";

export interface DecorQuery {
	decors: Decor[];
	bounds: [number, number, number, number];
}