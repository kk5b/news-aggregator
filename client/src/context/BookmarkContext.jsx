import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import axiosInstance from '@/utils/axiosInstance';

const BookmarkContext = createContext(null);

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [bookmarkedUrls, setBookmarkedUrls] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const fetchBookmarks = useCallback(async () => {
        if (!token) {
            setBookmarks([]);
            setBookmarkedUrls(new Set());
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.get('/bookmarks');
            setBookmarks(res.data);
            setBookmarkedUrls(new Set(res.data.map(b => b.article.url)));
        } catch (err) {
            console.error("Failed to fetch bookmarks", err);
            toast.error("Could not load your bookmarks.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBookmarks();
    }, [token, fetchBookmarks]);

    const toggleBookmark = async (article) => {
        if (!token) {
            toast.error('Please log in to manage bookmarks.');
            return false;
        }
        const isBookmarked = bookmarkedUrls.has(article.url);
        try {
            if (isBookmarked) {
                await axiosInstance.post('/bookmarks/delete-by-url', { url: article.url });
                toast.success('Bookmark removed.');
            } else {
                await axiosInstance.post('/bookmarks', { article });
                toast.success('Article bookmarked!');
            }
            await fetchBookmarks(); // Refetch to ensure all components are in sync
            return true;
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Action failed.');
            return false;
        }
    };

    const value = { bookmarks, bookmarkedUrls, toggleBookmark, loadingBookmarks: loading, fetchBookmarks };

    return (
        <BookmarkContext.Provider value={value}>
            {children}
        </BookmarkContext.Provider>
    );
};