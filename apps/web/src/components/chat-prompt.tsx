"use client";

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
import { useState } from "react";
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
import { type Agent, useAgents } from "@/services/queries/agents.query";

export type ChatPromptForm = {
	prompt: string;
	agent?: Agent;
};

export type ChatPromptProps = {
	disabledAgentSelection?: boolean;
	isLoading?: boolean;
	onSubmit: (form: ChatPromptForm) => void;
	onStop?: () => void;
};

export default function ChatPrompt({
	disabledAgentSelection = false,
	isLoading = false,
	onSubmit,
	onStop,
}: ChatPromptProps) {
	const [input, setInput] = useState("");
	const [agent, setAgent] = useState<Agent>();

	const { data: agents } = useAgents();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ prompt: input, agent });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key !== "Enter" || e.shiftKey) return;

		e.preventDefault();

		handleSubmit(e);
		setInput("");
	};

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const target = e.target as HTMLTextAreaElement;
		target.style.height = "auto";
		target.style.height = target.scrollHeight + "px";
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
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
		<div className="relative mx-auto max-w-xl">
			<div className="flex w-full justify-center pb-2">
				<ScrollButton variant="secondary" size="icon-sm" />
			</div>

			<div className="overflow-hidden rounded-2xl border border-border bg-card">
				<div className="grow px-3 pt-3 pb-4">
					<form onSubmit={handleSubmit}>
						<Textarea
							value={input}
							placeholder="Ask anything"
							className="max-h-[25vh] min-h-10 w-full resize-none border-0 border-none bg-transparent! p-0 text-foreground placeholder-muted-foreground shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
							rows={1}
							autoFocus
							onChange={handleInputChange}
							onInput={handleInput}
							onKeyDown={handleKeyDown}
						/>
					</form>
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
												onClick={() => setAgent(agent)}
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
								type="submit"
								size="icon"
								className="rounded-full bg-primary p-0 disabled:cursor-not-allowed disabled:opacity-50"
								onClick={handleStop}
							>
								<Square className="fill-primary" />
							</Button>
						) : (
							<Button
								type="submit"
								disabled={!input.length || isLoading}
								size="icon"
								className="rounded-full bg-primary p-0 disabled:cursor-not-allowed disabled:opacity-50"
								onClick={handleSubmit}
							>
								<SendHorizontal className="fill-primary" />
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
