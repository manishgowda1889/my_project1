import React from 'react';

const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="aspect-[4/5] bg-gray-200 dark:bg-dark" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/3 bg-gray-200 dark:bg-dark rounded" />
      <div className="h-4 w-full bg-gray-200 dark:bg-dark rounded" />
      <div className="h-4 w-2/3 bg-gray-200 dark:bg-dark rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-dark rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-dark rounded-lg" />
      </div>
    </div>
  </div>
);

const CategoryCardSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="w-full aspect-square bg-gray-200 dark:bg-dark rounded-full" />
    <div className="h-3 w-1/2 bg-gray-200 dark:bg-dark rounded mx-auto" />
  </div>
);

const BannerSkeleton = () => (
  <div className="w-full aspect-[21/9] bg-gray-200 dark:bg-dark rounded-2xl animate-pulse" />
);

const SkeletonLoaders = {
  ProductCard: ProductCardSkeleton,
  CategoryCard: CategoryCardSkeleton,
  Banner: BannerSkeleton,
};

export default SkeletonLoaders;
