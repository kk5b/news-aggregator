import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Newspaper } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/auth/login", formData);
            if (response.data.token) {
                toast.success("Login successful!");
                login(response.data.token);
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
            <div className="flex items-center gap-2 mb-6">
                <Newspaper className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-serif font-bold">NewsAgg</h1>
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your personalized feed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
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
                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    <p className="text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;