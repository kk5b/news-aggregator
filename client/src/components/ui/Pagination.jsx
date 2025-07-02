import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2 my-8">
            <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Pagination;