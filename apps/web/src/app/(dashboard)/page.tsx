import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/http";
import Client from "./client";

export default async function Home() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/protected`,
		{
			headers: await headers(),
			method: "GET",
		},
	);

	const data = await response.json();

	console.log("BASE URL", getBaseUrl());

	return (
		<div>
			<h1>New chat</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<Client />
		</div>
	);
}
