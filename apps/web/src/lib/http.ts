const isServer = typeof window === "undefined";

export const getBaseUrl = () => {
	if (isServer) {
		return process.env.NEXT_PUBLIC_SERVER_URL;
	}

	return "";
};
