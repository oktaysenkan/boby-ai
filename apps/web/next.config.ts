import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	rewrites: () => [
		{
			source: "/api/:path*",
			destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`,
		},
	],
};

export default nextConfig;
