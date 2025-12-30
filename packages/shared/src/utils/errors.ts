export const formatError = (error: unknown) => {
  const fallbackErrorMessage = "An error occurred";

  const isObject =
    typeof error === "object" && Object.keys(error as object).length > 0;

  if (typeof error === "string") return error;

  if (error instanceof Error || isObject) {
    const errorAsObject = error as Error;
    return errorAsObject?.message ?? fallbackErrorMessage;
  }

  return fallbackErrorMessage;
};
