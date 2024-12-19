import { User } from "./users";

export type Event = {
	id: number;
	name: string;
	description: string;
	start: Date;
	end: Date;
	createdAt: Date;
	updatedAt: Date;
	ownerId: number
	owner?: User
	users?: User[]
}
