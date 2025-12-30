import type { UIMessage as BaseUIMessage, UIDataTypes, UITools } from "ai";

export type UIMessageMetadata = {
  agent?: string;
};

export type UIMessage = BaseUIMessage<UIMessageMetadata, UIDataTypes, UITools>;

export const a = 1;
