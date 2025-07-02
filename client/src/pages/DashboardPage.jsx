import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Bookmark, X as ClearIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import NewsCard from '@/components/news/NewsCard';
import LoadingSkeleton from '@/components/news/LoadingSkeleton';

const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];
const countries = [{ code: "us", name: "USA" }, { code: "in", name: "India" }, { code: "gb", name: "UK" }, { code: "ca", name: "Canada" }, { code: "au", "name": "Australia" }];
const sortOptions = [{ value: "publishedAt", name: "Newest" }, { value: "relevancy", name: "Relevance" }, { value: "popularity", name: "Popularity" }];
const PAGE_SIZE = 9;
const DEFAULT_FILTERS = { q: '', sources: '', category: '', country: '', sortBy: 'publishedAt' };

const isFilterActive = (filters) => filters.q || filters.sources || filters.category || filters.country;

const DashboardPage = () => {
    const [articles, setArticles] = useState([]);
    const [sources, setSources] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useAuth();
    const { bookmarkedUrls, toggleBookmark } = useBookmarks();

    const totalPages = Math.ceil(totalResults / PAGE_SIZE);

    const fetchNews = useCallback(async () => {
        if (!token) { setLoading(false); setArticles([]); return; }
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
            const params = { page: currentPage, pageSize: PAGE_SIZE, ...filters };
            const response = await axiosInstance.get('/news', { params });
            setArticles(response.data.articles || []);
            setTotalResults(response.data.totalResults || 0);
        } catch (err) {
            setError('Failed to fetch news articles.');
            setArticles([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filters, token]);

    useEffect(() => { fetchNews(); }, [fetchNews]);

    useEffect(() => {
        if (!token) return;
        axiosInstance.get('/news/sources')
            .then(res => setSources(res.data.sources || []))
            .catch(err => console.error("Failed to fetch sources", err));
    }, [token]);

    const handleFilterChange = (type, value) => {
        setCurrentPage(1);
        const newFilters = { ...DEFAULT_FILTERS, [type]: value };
        if (type === 'q' && value) newFilters.sortBy = 'relevancy';
        setFilters(newFilters);
    };

    const handleSearch = (e) => { e.preventDefault(); handleFilterChange('q', searchTerm.trim()); };
    const handlePageChange = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
    const handleSortChange = (value) => { if (filters.q) setFilters(prev => ({ ...prev, sortBy: value })); };
    const handleClearFilters = () => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); setCurrentPage(1); };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                    {isFilterActive(filters) ? "Filtered Results" : "For You"}
                </h1>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-card">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input type="text" placeholder="Search for articles by keyword..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
                    <Button type="submit" aria-label="Search"><Search className="h-5 w-5" /></Button>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="hidden sm:flex"><Filter className="h-4 w-4 mr-2" /> Filters</Button></PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="end">
                            <div className="grid gap-4">
                                <div className="space-y-2"><h4 className="font-medium leading-none">Filter By</h4><p className="text-sm text-muted-foreground">Select to see top headlines.</p></div>
                                <div className="space-y-2">
                                    <Select value={filters.sources} onValueChange={(value) => handleFilterChange('sources', value)}><SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger><SelectContent>{sources.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
                                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent></Select>
                                    <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}><SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger><SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select>
                                </div>
                                {isFilterActive(filters) && <Button variant="ghost" onClick={handleClearFilters} className="w-full justify-center">Clear All Filters</Button>}
                            </div>
                        </PopoverContent>
                    </Popover>
                </form>
            </div>

            {/* --- New Search Results Header --- */}
            {filters.q && !loading && (
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-lg text-muted-foreground">
                        Found <span className="font-bold text-foreground">{totalResults}</span> results for <span className="font-bold text-primary">"{filters.q}"</span>
                    </h3>
                    <Select onValueChange={handleSortChange} value={filters.sortBy}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>Sort by {opt.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {error && !loading && <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
                {loading ? (Array.from({ length: PAGE_SIZE }).map((_, index) => <LoadingSkeleton key={index} />)) : (articles.map((article, index) => <NewsCard key={`${article.url}-${index}`} article={article} isBookmarked={bookmarkedUrls.has(article.url)} onToggleBookmark={toggleBookmark} />))}
            </div>
            <div className="flex justify-center">{!loading && articles.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
            {!loading && articles.length === 0 && <p className="text-center text-muted-foreground mt-8">No articles found.</p>}
        </div>
    );
};

export default DashboardPage;