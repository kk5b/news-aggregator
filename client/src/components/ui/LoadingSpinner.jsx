import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;