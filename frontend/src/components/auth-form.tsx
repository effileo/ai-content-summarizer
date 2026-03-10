"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";

export function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage("Check your email to confirm your account!");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                    {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {isLogin
                        ? "Sign in to access your summaries"
                        : "Sign up to start summarizing content"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>

                {/* Password Input */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>

                {/* Error / Success Messages */}
                {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                )}
                {message && (
                    <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">
                        <p>{message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-gradient mt-2 w-full text-primary-foreground"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isLogin ? (
                        "Sign In"
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>

            {/* Toggle View */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                        setMessage(null);
                    }}
                    className="font-medium text-primary hover:underline"
                >
                    {isLogin ? "Sign up" : "Sign in"}
                </button>
            </div>
        </div>
    );
}
