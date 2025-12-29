import { StickToBottom, type StickToBottomProps } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";

export type ChatContainerRootProps = {
	children: React.ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = {
	children: React.ReactNode;
	className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
	className?: string;
	ref?: React.RefObject<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

function ChatContainerRoot({
	children,
	className,
	...props
}: StickToBottomProps) {
	return (
		<StickToBottom
			className={cn("flex overflow-y-auto", className)}
			resize="instant"
			initial="instant"
			role="log"
			{...props}
		>
			{children}
		</StickToBottom>
	);
}

function ChatContainerContent({
	children,
	className,
	...props
}: ChatContainerContentProps) {
	return (
		<StickToBottom.Content
			className={cn("flex w-full flex-col", className)}
			{...props}
		>
			{children}
		</StickToBottom.Content>
	);
}

export { ChatContainerRoot, ChatContainerContent };
