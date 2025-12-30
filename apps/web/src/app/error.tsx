"use client";

import ErrorScreen from "@/screens/error/error.screen";

const ErrorPage = ({ error }: { error: Error }) => {
  return <ErrorScreen error={error} />;
};

export default ErrorPage;
