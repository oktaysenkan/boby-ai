import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";

export default function Home() {
	return (
		<div>
			<div className="container mx-auto flex max-w-3xl flex-row items-center justify-between px-4 py-2">
				<UserMenu />
				<ModeToggle />
			</div>
		</div>
	);
}
