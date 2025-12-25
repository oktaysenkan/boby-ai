"use client";

import { useEffect, useState } from "react";

const Client = () => {
	const [data, setData] = useState<{ message?: string } | null>(null);

	const getProtectedData = async () => {
		const response = await fetch("/api/protected", {
			method: "GET",
			credentials: "include",
		});

		const data = await response.json();

		setData(data);
	};

	useEffect(() => {
		getProtectedData();
	}, []);

	return (
		<div>
			<h1>Protected data</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default Client;
