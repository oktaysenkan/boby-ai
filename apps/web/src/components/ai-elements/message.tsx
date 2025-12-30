"use client";

import { getAgentName } from "@boby-ai/shared";
import type { UIMessage } from "ai";
import { CopyIcon, MessageSquareIcon, RefreshCcwIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { ComponentProps, HTMLAttributes } from "react";
import React, { memo } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className,
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
      "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
      "group-[.is-assistant]:text-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageActionsProps = ComponentProps<"div">;

export const MessageActions = ({
  className,
  children,
  ...props
}: MessageActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = "ghost",
  size = "icon",
  ...props
}: MessageActionProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

MessageResponse.displayName = "MessageResponse";

export type MessageListProps = {
  messages: UIMessage[];
  messagesLoading: boolean;
  waitingLLMResponse: boolean;
  agentSlug?: string;
  onRegenerate?: (messageId: string) => void;
};

export const MessageList = ({
  messages,
  messagesLoading,
  waitingLLMResponse,
  agentSlug,
  onRegenerate,
}: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <Empty className="absolute inset-0 flex w-full items-center justify-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareIcon />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            Start a conversation by clicking the button below.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <React.Fragment>
      {messages.map((message, messageIndex) => (
        <React.Fragment key={`${message.id}-${messageIndex}`}>
          {message.parts.map((part, partIndex) => {
            switch (part.type) {
              case "text":
                return (
                  <Message
                    key={`${message.id}-${partIndex}`}
                    from={message.role}
                    className="relative"
                  >
                    <MessageContent className="gap-2">
                      {message.role === "assistant" ? (
                        <MessageResponse
                          mode={messagesLoading ? "static" : "streaming"}
                          isAnimating={messagesLoading}
                        >
                          {part.text}
                        </MessageResponse>
                      ) : (
                        <div className="whitespace-pre-line">{part.text}</div>
                      )}
                      {message.role === "assistant" && agentSlug && (
                        <div className="mt-1 flex w-fit items-center gap-2 rounded-full bg-muted px-2 py-1">
                          <Image
                            className="rounded-full"
                            src={`/agents/${agentSlug}.jpeg`}
                            alt={getAgentName(agentSlug)}
                            width={24}
                            height={24}
                          />
                          <span className="text-card-foreground text-sm">
                            {getAgentName(agentSlug)}
                          </span>
                        </div>
                      )}
                    </MessageContent>
                    <MessageActions>
                      {message.role === "assistant" && (
                        <>
                          <MessageAction
                            onClick={() => onRegenerate?.(message.id)}
                            label="Retry"
                          >
                            <RefreshCcwIcon />
                          </MessageAction>
                          <MessageAction
                            onClick={() => {
                              navigator.clipboard.writeText(part.text);
                              toast.success("Copied to clipboard");
                            }}
                            label="Copy"
                          >
                            <CopyIcon />
                          </MessageAction>
                        </>
                      )}
                    </MessageActions>
                  </Message>
                );
              default:
                return null;
            }
          })}
        </React.Fragment>
      ))}
      <div className={cn("hidden", waitingLLMResponse && "block")}>
        <motion.div
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          animate={{ scale: [1, 0.7, 1] }}
          className="size-4 rounded-full bg-primary"
        />
      </div>
      <div className="h-40" />
    </React.Fragment>
  );
};
