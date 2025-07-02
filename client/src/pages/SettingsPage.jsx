import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];

const SettingsPage = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPrefs = async () => {
            const res = await axiosInstance.get('/profile/preferences');
            setSelectedCategories(res.data.categories || []);
        };
        if (token) fetchPrefs();
    }, [token]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const preferences = { categories: selectedCategories };
            await axiosInstance.put('/profile/preferences', { preferences });
            toast.success("Preferences saved!");
        } catch (err) {
            toast.error("Failed to save preferences.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Your Preferences</h1>
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Favorite Categories</h3>
                <p className="text-sm text-muted-foreground">Select categories to personalize your 'For You' feed.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCheckboxChange(category)}
                            />
                            <label htmlFor={category} className="text-sm font-medium capitalize">{category}</label>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
            </Button>
        </div>
    );
};

export default SettingsPage;