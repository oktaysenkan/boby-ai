import { formatError } from "@boby-ai/shared";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export const buildStreamingErrorResponse = (error: Error | string) => {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute(options) {
        options.writer.write({
          type: "error",
          errorText: formatError(error),
        });
      },
    }),
  });
};
