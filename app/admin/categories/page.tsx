"use client";

import { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import { fetchCategories } from "@/utils/fetchCategories";
import ButtonWithoutIcons from "@/components/ButtonWithoutIcons";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<
    {
      categoryid: string;
      categoryimage: string;
      categoryname: string;
      productcount: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Categories</h1>
        <ButtonWithoutIcons text="Add Category" url="/admin/categories/add" />
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading categories...</p>}

      {/* Responsive Grid with min width 210px */}
      <div
        className="
          p-6 grid gap-6
          grid-cols-[repeat(auto-fit,minmax(211px,1fr))]
        "
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.categoryid}
            categoryId={category.categoryid}
            imageUrl={category.categoryimage}
            name={category.categoryname}
            productCount={category.productcount}
            // when deleted → remove from state instantly
            onDeleted={(id) =>
              setCategories((prev) =>
                prev.filter((c) => c.categoryid !== id)
              )
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <p className="text-gray-500 mt-6">No categories found.</p>
      )}
    </div>
  );
}
