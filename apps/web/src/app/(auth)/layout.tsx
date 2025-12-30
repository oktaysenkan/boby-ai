import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: false,
		},
	});

	if (session?.data?.user) {
		throw redirect("/");
	}

	return children;
};

export default AuthLayout;
