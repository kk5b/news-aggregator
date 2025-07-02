import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Trash2, Bookmark as BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import NewsCard from '@/components/news/NewsCard';


const EmptyBookmarks = () => (
    <div className="text-center py-16 flex flex-col items-center">
        <div className="inline-block p-4 bg-muted rounded-full">
            <BookmarkIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No Saved Articles</h2>
        <p className="mt-2 text-muted-foreground">You haven't bookmarked any articles yet. Start exploring!</p>
        <Button asChild className="mt-6">
            <Link to="/">Browse Headlines</Link>
        </Button>
    </div>
);

// --- Main Bookmarks Page Component ---

const BookmarksPage = () => {
    const { bookmarks, toggleBookmark, loadingBookmarks, fetchBookmarks } = useBookmarks();
    const { token } = useAuth();

    // This ensures the bookmark data is always fresh when the user navigates to this page.
    useEffect(() => {
        if (token) {
            fetchBookmarks();
        }
    }, [token, fetchBookmarks]);

    if (loadingBookmarks) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center p-8">
                <p>Please log in to view your bookmarks.</p>
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return <EmptyBookmarks />;
    }

    return (
        <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Your Bookmarks</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bookmark) => (
                    <NewsCard
                        key={bookmark.bookmark_id}
                        article={bookmark.article}
                        isBookmarked={true}
                        onToggleBookmark={toggleBookmark}
                        isBookmarkPage={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookmarksPage;