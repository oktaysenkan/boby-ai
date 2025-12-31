"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Brain,
  ChevronDown,
  DollarSign,
  HeartHandshake,
  type Icon,
  Laptop,
  Plane,
  SendHorizontal,
  Square,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAgents } from "@/services/queries/agents.query";

export type ChatPromptProps = {
  disabledAgentSelection?: boolean;
  isLoading?: boolean;
  onSubmit: (form: ChatPromptForm) => void;
  onStop?: () => void;
};

const formSchema = z.object({
  prompt: z.string().min(1),
  agent: z
    .object({
      slug: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type ChatPromptForm = z.infer<typeof formSchema>;

export default function ChatPrompt({
  disabledAgentSelection = false,
  isLoading = false,
  onSubmit,
  onStop,
}: ChatPromptProps) {
  const { data: agents } = useAgents();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      agent: undefined,
    },
  });

  const agent = form.watch("agent");
  const prompt = form.watch("prompt");

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // We use send form on enter key instead of new line
    // because we want to send the form when the user presses enter
    // and not when they press shift + enter
    if (e.key !== "Enter" || e.shiftKey) return;

    e.preventDefault();

    if (isLoading) return;

    form.handleSubmit(handleSubmit)();
  };

  const handleStop = () => {
    onStop?.();
  };

  const getAgentIcon = (
    slug: string | undefined,
    props?: Partial<React.ComponentProps<typeof Icon>>,
  ) => {
    if (slug === "coding-guru") return <Laptop size={16} {...props} />;
    if (slug === "health-advisor")
      return <HeartHandshake size={16} {...props} />;
    if (slug === "financial-advisor")
      return <DollarSign size={16} {...props} />;
    if (slug === "travel-planner") return <Plane size={16} {...props} />;
    return <Brain size={16} {...props} />;
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="relative mx-auto max-w-xl">
        <div className="flex w-full justify-center pb-2">
          <ScrollButton variant="secondary" size="icon-sm" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grow px-3 pt-3 pb-4">
            <Controller
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Ask anything"
                  className="max-h-[15vh] min-h-10 w-full resize-none border-0 border-none bg-transparent! p-0 text-foreground placeholder-muted-foreground shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                  autoFocus={!isMobile}
                  onKeyDown={handleKeyDown}
                />
              )}
            />
          </div>
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              {!disabledAgentSelection && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabledAgentSelection}
                    >
                      {getAgentIcon(agent?.slug)}
                      <span>{agent?.name ?? "Agent"}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup className="space-y-1">
                      {agents?.map((agent) => (
                        <DropdownMenuItem
                          key={agent.name}
                          onClick={() => form.setValue("agent", agent)}
                        >
                          {getAgentIcon(agent.slug)}
                          {agent.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div>
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full bg-primary p-0 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleStop}
                >
                  <Square className="fill-background" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!prompt.length || isLoading}
                  size="icon"
                  className="rounded-full bg-primary p-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendHorizontal className="fill-background" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
