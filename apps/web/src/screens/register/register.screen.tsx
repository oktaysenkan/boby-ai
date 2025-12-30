"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import GitHubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    disabled: isLoading,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          router.push("/");
          toast.success("Sign in successful");
        },
        onError: (error) => {
          setIsLoading(false);
          toast.error(error.error.message || error.error.statusText);
        },
      },
    );
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    await authClient.signIn.social(
      {
        provider,
        callbackURL: `${window.location.origin}`,
      },
      {
        onRequest: () => setIsLoading(true),
        onSettled: () => setIsLoading(false),
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center space-x-1.5">
            <Logo className="h-7 w-7 text-foreground dark:text-foreground" />
            <p className="font-medium text-foreground text-lg dark:text-foreground">
              Boby AI
            </p>
          </div>
          <h3 className="mt-6 font-semibold text-foreground text-lg dark:text-foreground">
            Create an account
          </h3>
          <p className="mt-2 text-muted-foreground text-sm dark:text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
            >
              Sign in
            </Link>
          </p>
          <div className="mt-8 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              variant="outline"
              className="flex-1 items-center justify-center space-x-2 py-2"
              disabled={isLoading}
              onClick={() => handleSocialLogin("github")}
            >
              <GitHubIcon className="size-5" aria-hidden={true} />
              <span className="font-medium text-sm">Sign up with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="mt-2 flex-1 items-center justify-center space-x-2 py-2 sm:mt-0"
              disabled={isLoading}
              onClick={() => handleSocialLogin("google")}
            >
              <GoogleIcon className="size-4" aria-hidden={true} />
              <span className="font-medium text-sm">Sign up with Google</span>
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
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
            <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
              {isLoading && <Spinner />}
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
