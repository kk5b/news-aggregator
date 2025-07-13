import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { Mail, Lock, User, Newspaper, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleChange = (e) => {
        setError("");
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axiosInstance.post("/auth/register", formData);
            if (response.data.token) {
                toast.success("Account created successfully!");
                login(response.data.token);
            }
        } catch (err) {
            const errorMessage = err.response?.data || "Registration failed. Please try again.";
            setError(errorMessage); // Set the inline error message
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
            <div className="flex items-center gap-3 mb-6">
                <Newspaper className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-serif font-bold">NewsAgg</h1>
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>Join to get your personalized news feed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="username" type="text" placeholder="yourusername" required value={formData.username} onChange={handleChange} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} className="pl-10" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="password" type="password" required value={formData.password} onChange={handleChange} className="pl-10" />
                            </div>
                        </div>

                        {/* --- The New Error UI --- */}
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    <p className="text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;