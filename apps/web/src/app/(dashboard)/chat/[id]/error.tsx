"use client";

const ErrorPage = ({ error }: { error: Error }) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			{error.message}
		</div>
	);
};

export default ErrorPage;
