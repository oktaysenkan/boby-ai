"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import BobyIcon from "@/components/icons/boby";
import GitHubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		await authClient.signIn.email(
			{ email: data.email, password: data.password },
			{
				onSuccess: () => {
					router.push("/dashboard");
					toast.success("Sign in successful");
				},
				onError: (error) => {
					toast.error(error.error.message || error.error.statusText);
				},
			},
		);
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex items-center space-x-1.5">
						<BobyIcon className="h-7 w-7 text-foreground dark:text-foreground" />
						<p className="font-medium text-foreground text-lg dark:text-foreground">
							Boby AI
						</p>
					</div>
					<h3 className="mt-6 font-semibold text-foreground text-lg dark:text-foreground">
						Sign in to your account
					</h3>
					<p className="mt-2 text-muted-foreground text-sm dark:text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="#"
							className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
						>
							Sign up
						</Link>
					</p>
					<div className="mt-8 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
						<Button
							variant="outline"
							className="flex-1 items-center justify-center space-x-2 py-2"
							asChild
						>
							<Link href="#">
								<GitHubIcon className="size-5" aria-hidden={true} />
								<span className="font-medium text-sm">Login with GitHub</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							className="mt-2 flex-1 items-center justify-center space-x-2 py-2 sm:mt-0"
							asChild
						>
							<Link href="#">
								<GoogleIcon className="size-4" aria-hidden={true} />
								<span className="font-medium text-sm">Login with Google</span>
							</Link>
						</Button>
					</div>
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								or
							</span>
						</div>
					</div>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="mt-6 space-y-4"
					>
						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										type="email"
										autoComplete="email"
										placeholder="your@email.com"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel
										htmlFor={field.name}
										aria-invalid={fieldState.invalid}
									>
										Password
									</FieldLabel>
									<Input
										{...field}
										type="password"
										id={field.name}
										name={field.name}
										aria-invalid={fieldState.invalid}
										autoComplete="password"
										placeholder="********"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Button type="submit" className="mt-4 w-full" disabled={isPending}>
							Sign in
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
