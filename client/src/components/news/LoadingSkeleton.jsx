import React from 'react';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    );
};

export default LoadingSkeleton;