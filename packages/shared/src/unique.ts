import { nanoid } from "nanoid";

const createId = () => {
	return nanoid(10);
};

export { createId };
