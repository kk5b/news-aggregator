import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/utils/axiosInstance';

const NewsCard = ({ article, isBookmarked, onToggleBookmark, isBookmarkPage = false }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const { token } = useAuth();

    const handleToggleBookmark = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        await onToggleBookmark(article);
        setIsUpdating(false);
    };

    // --- THIS IS THE FIX ---
    // This function is now attached to a <button>, not an <a> tag.
    const handleReadMoreClick = () => {
        // 1. Log history in the background (fire and forget)
        if (token) {
            axiosInstance.post('/history', { article })
                .catch(err => console.error("Failed to log history:", err.message));
        }
        // 2. Open the article in a new tab
        window.open(article.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card className="flex flex-col overflow-hidden border-border/60 hover:border-primary/40 transition-all hover:shadow-lg group">
            <div className="overflow-hidden">
                {/* This link now only navigates and doesn't have a competing onClick */}
                <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleReadMoreClick(); }}>
                    {article.urlToImage ? (
                        <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">No Image Available</p>
                        </div>
                    )}
                </a>
            </div>
            <CardHeader>
                <Badge variant="secondary" className="bg-accent/80 text-accent-foreground font-semibold w-fit">
                    {article.source.name}
                </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
                <a href={article.url} onClick={(e) => { e.preventDefault(); handleReadMoreClick(); }} className="font-serif text-lg md:text-xl font-bold mb-2 text-foreground line-clamp-2 hover:underline">
                    {article.title}
                </a>
                <p className="text-muted-foreground text-sm line-clamp-3">{article.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/30 py-3 px-6">
                <Button variant="ghost" size="icon" onClick={handleToggleBookmark} disabled={isUpdating} aria-label="Toggle bookmark">
                    {isUpdating ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
                    ) : isBookmarkPage ? (
                        <Trash2 className="h-4 w-4 text-destructive" />
                    ) : (
                        <Bookmark className={`h-4 w-4 transition-colors ${isBookmarked ? 'text-primary fill-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                    )}
                </Button>
                <p className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                {/* --- THIS IS THE FIX --- */}
                {/* We use a button styled as a link for predictable behavior */}
                <Button onClick={handleReadMoreClick} variant="link" className="p-0 h-auto text-primary">
                    Read More
                </Button>
            </CardFooter>
        </Card>
    );
};

export default NewsCard;