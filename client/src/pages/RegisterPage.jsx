import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Newspaper } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/auth/register", formData);
            if (response.data.token) {
                toast.success("Account created successfully!");
                login(response.data.token);
            }
        } catch (err) {
            toast.error(err.response?.data || "Registration failed. Please try again.");
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