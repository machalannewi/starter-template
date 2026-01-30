"use client";

import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useState, FormEvent, useEffect } from "react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "signin" | "signup";
    onSuccess?: () => void;
    className?: string;
}

export default function AuthModal({
    isOpen,
    onClose,
    mode,
    onSuccess,
    className,
    ...props
}: AuthModalProps) {
    const {
        isLoaded: signUpLoaded,
        signUp,
        setActive: setActiveSignUp,
    } = useSignUp();
    const {
        isLoaded: signInLoaded,
        signIn,
        setActive: setActiveSignIn,
    } = useSignIn();

    const [fullName, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [pendingVerification, setPendingVerification] =
        useState<boolean>(false);
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // ADDED: Clear error when modal closes or mode changes
    useEffect(() => {
        if (!isOpen) {
            setError("");
            setIsLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setError("");
    }, [mode]);

    if (!isOpen) return null;

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signUpLoaded || isLoading) return;

        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Split full name into first and last
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        try {
            await signUp.create({
                firstName,
                lastName,
                username,
                emailAddress,
                password,
            });
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });
            setPendingVerification(true);
            setError("");
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                setError(err.errors[0].message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signUpLoaded || isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification(
                { code },
            );

            if (completeSignUp.status === "complete") {
                await setActiveSignUp({
                    session: completeSignUp.createdSessionId,
                });
                onSuccess?.();
                onClose();
                router.push("/dashboard");
            } else {
                setError("Verification incomplete. Please try again.");
            }
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                setError(err.errors[0].message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signInLoaded || isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                await setActiveSignIn({ session: result.createdSessionId });
                onSuccess?.();
                onClose();
                router.push("/dashboard");
            } else {
                setError("Sign-in incomplete. Please try again.");
            }
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                setError(err.errors[0].message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md p-6 rounded-3xl shadow-xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-10 right-10 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {mode === "signup" && !pendingVerification ? (
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div
                            className={cn("flex flex-col gap-6", className)}
                            {...props}
                        >
                            <Card className="bg-neutral-900 border border-white/10 text-white">
                                <CardHeader className="text-center -mt-2">
                                    <CardTitle className="text-xl text-white">
                                        Create your account
                                    </CardTitle>
                                    <CardDescription>
                                        Enter your email below to create your
                                        account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel
                                                htmlFor="name"
                                                className="text-white"
                                            >
                                                Full Name
                                            </FieldLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                onChange={(e) =>
                                                    setFullName(e.target.value)
                                                }
                                                disabled={isLoading}
                                            />
                                        </Field>
                                        <Field className="-mt-5">
                                            <FieldLabel
                                                htmlFor="name"
                                                className="text-white"
                                            >
                                                Username
                                            </FieldLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Johndoe10"
                                                required
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                disabled={isLoading}
                                            />
                                        </Field>
                                        <Field className="-mt-5">
                                            <FieldLabel
                                                htmlFor="email"
                                                className="text-white"
                                            >
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                value={emailAddress}
                                                onChange={(e) =>
                                                    setEmailAddress(
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={isLoading}
                                            />
                                        </Field>
                                        <Field className="-mt-5">
                                            <Field className="grid grid-cols-2 gap-4 text-white">
                                                <Field>
                                                    <FieldLabel htmlFor="password">
                                                        Password
                                                    </FieldLabel>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        required
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    />
                                                </Field>
                                                <Field>
                                                    <FieldLabel htmlFor="confirm-password">
                                                        Confirm Password
                                                    </FieldLabel>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        required
                                                        value={confirmPassword}
                                                        onChange={(e) =>
                                                            setConfirmPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    />
                                                </Field>
                                            </Field>
                                            <FieldDescription>
                                                Must be at least 8 characters
                                                long.
                                            </FieldDescription>
                                        </Field>
                                        <div id="clerk-captcha"></div>
                                        {error && (
                                            <div className="text-red-500 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        <Field className="mt-2">
                                            <Button
                                                type="submit"
                                                className="bg-lime-500 text-black transition duration-300 hover:text-lime-400 hover:bg-neutral-800"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Spinner />
                                                ) : (
                                                    "Create Account"
                                                )}
                                            </Button>

                                            <FieldDescription className="text-center group">
                                                Already have an account?{" "}
                                                <a
                                                    href="/sign-in"
                                                    className="group-hover:text-lime-400 transition duration-300"
                                                >
                                                    Sign in
                                                </a>
                                            </FieldDescription>
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                ) : mode === "signup" && pendingVerification ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <Card
                            {...props}
                            className="bg-neutral-900 border border-white/10 text-white"
                        >
                            <CardHeader>
                                <CardTitle>Enter verification code</CardTitle>
                                <CardDescription>
                                    We sent a 6-digit code to your email.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="otp">
                                            Verification code
                                        </FieldLabel>
                                        <InputOTP
                                            maxLength={6}
                                            id="otp"
                                            required
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={isLoading}
                                        >
                                            <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                                <InputOTPSlot
                                                    index={0}
                                                    className="border border-lime-400"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="border border-lime-400"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="border border-lime-400"
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className="border border-lime-400"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="border border-lime-400"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="border border-lime-400"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <FieldDescription>
                                            Enter the 6-digit code sent to your
                                            email.
                                        </FieldDescription>
                                    </Field>
                                    {error && (
                                        <div className="text-red-500 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <FieldGroup>
                                        <Button
                                            type="submit"
                                            className="bg-lime-500 text-black transition duration-300 hover:text-lime-400 hover:bg-neutral-800"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Spinner /> : "Verify"}
                                        </Button>

                                        <FieldDescription className="text-center group">
                                            Didn&apos;t receive the code?{" "}
                                            <a
                                                href="#"
                                                className="group-hover:text-lime-400"
                                            >
                                                Resend
                                            </a>
                                        </FieldDescription>
                                    </FieldGroup>
                                </FieldGroup>
                            </CardContent>
                        </Card>
                    </form>
                ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div
                            className={cn("flex flex-col gap-6", className)}
                            {...props}
                        >
                            <Card className="bg-neutral-900 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Login to your account
                                    </CardTitle>
                                    <CardDescription>
                                        Enter your email below to login to your
                                        account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel
                                                htmlFor="email"
                                                className="text-white"
                                            >
                                                Email
                                            </FieldLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={emailAddress}
                                                onChange={(e) =>
                                                    setEmailAddress(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="m@example.com"
                                                required
                                                className="text-gray-600"
                                                disabled={isLoading}
                                            />
                                        </Field>
                                        <Field>
                                            <div className="flex items-center">
                                                <FieldLabel
                                                    htmlFor="password"
                                                    className="text-white"
                                                >
                                                    Password
                                                </FieldLabel>
                                                <a
                                                    href="#"
                                                    className="ml-auto inline-block text-sm text-white underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                                className="text-gray-600"
                                                disabled={isLoading}
                                            />
                                        </Field>
                                        <div id="clerk-captcha"></div>
                                        {error && (
                                            <div className="text-red-500 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        <Field>
                                            <Button
                                                className="bg-lime-500 text-black transition duration-300 hover:text-lime-400 hover:bg-neutral-800"
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Spinner />
                                                ) : (
                                                    "Login"
                                                )}
                                            </Button>

                                            <Button
                                                className="outline outline-1 outline-lime-500"
                                                variant="outline"
                                                type="button"
                                            >
                                                Login with Google
                                            </Button>

                                            <FieldDescription className="text-center text-gray-400 group">
                                                Don&apos;t have an account?{" "}
                                                <a
                                                    href="#"
                                                    className="group-hover:text-lime-500"
                                                >
                                                    Sign up
                                                </a>
                                            </FieldDescription>
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
