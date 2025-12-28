"use client";

import {
	Brain,
	ChevronDown,
	HeartHandshake,
	Laptop,
	Paperclip,
	Plus,
	SendHorizontal,
} from "lucide-react";
import { useRef, useState } from "react";
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

type Agent = {
	name: string;
	icon: React.ElementType;
};

const agents: Agent[] = [
	{
		name: "Coding Guru",
		icon: Laptop,
	},
	{
		name: "Health Advisor",
		icon: HeartHandshake,
	},
];

export type ChatPromptForm = {
	prompt: string;
	agent?: Agent;
};

export type ChatPromptProps = {
	onSubmit: (form: ChatPromptForm) => void;
};

export default function ChatPrompt({ onSubmit }: ChatPromptProps) {
	const [input, setInput] = useState("");
	const [agent, setAgent] = useState<Agent>();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	return (
		<div className="relative mx-auto max-w-xl">
			<div className="flex w-full justify-center pb-2">
				<ScrollButton variant="secondary" size="icon-sm" />
			</div>

			<div className="overflow-hidden rounded-2xl border border-border bg-card">
				<input ref={fileInputRef} type="file" multiple className="sr-only" />
				<div className="grow px-3 pt-3 pb-4">
					<form onSubmit={handleSubmit}>
						<Textarea
							value={input}
							placeholder="Ask anything"
							className="max-h-[25vh] min-h-10 w-full resize-none border-0 border-none bg-transparent! p-0 text-foreground placeholder-muted-foreground shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
							rows={1}
							onChange={handleInputChange}
							onInput={handleInput}
							onKeyDown={handleKeyDown}
						/>
					</form>
				</div>

				<div className="mb-2 flex items-center justify-between px-2">
					<div className="flex items-center gap-1">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon-sm"
									className="rounded-full"
								>
									<Plus />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuGroup className="space-y-1">
									<DropdownMenuItem
										onClick={() => fileInputRef.current?.click()}
									>
										<Paperclip size={16} className="opacity-60" />
										Attach Files
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									{agent?.icon ? <agent.icon /> : <Brain />}
									<span>{agent?.name ?? "Agent"}</span>
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuGroup className="space-y-1">
									{agents.map((agent) => (
										<DropdownMenuItem
											key={agent.name}
											onClick={() => setAgent(agent)}
										>
											<agent.icon size={16} className="opacity-60" />
											{agent.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div>
						<Button
							type="submit"
							disabled={!input.length}
							size="icon"
							className="rounded-full bg-primary p-0 disabled:cursor-not-allowed disabled:opacity-50"
							onClick={handleSubmit}
						>
							<SendHorizontal className="fill-primary" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
