"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { deleteCategory } from "@/utils/deleteCategory";
import { deleteCategoryWithProducts } from "@/utils/deleteCategoryWithProducts";

type CategoryCardProps = {
  imageUrl: string;
  name: string;
  productCount: number;
  categoryId: string;
  onEdit?: () => void;
  onDeleted?: (id: string) => void; // tell parent to refresh
};

const CategoryCard = ({
  imageUrl,
  name,
  productCount,
  categoryId,
  onEdit,
  onDeleted,
}: CategoryCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteProducts, setDeleteProducts] = useState(true); // toggle default ON
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (deleteProducts) {
        await deleteCategoryWithProducts(categoryId);
      } else {
        await deleteCategory(categoryId);
      }
      setModalOpen(false);
      onDeleted?.(categoryId); // notify parent
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-visible shadow-lg relative">
      {/* Category Image */}
      <div className="relative w-full h-64">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      {/* Footer */}
      <div className="bg-yellow-500 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-800">{productCount} Products</p>
        </div>

        {/* Three Dot Menu */}
        <div className="relative">
          <button
            className="text-gray-900 text-xl"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FaEllipsisV />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit?.();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setModalOpen(true);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-96 p-6 z-10">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Delete Category?
            </h2>
            <p className="text-gray-700 mb-4">
              This action cannot be undone. Choose what to do with the products
              inside this category.
            </p>

            {/* Toggle switch */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-900">Delete all products</p>
                <p className="text-sm text-gray-600">
                  If turned off, products will be marked as{" "}
                  <span className="font-semibold">Uncategorized</span>.
                </p>
              </div>
              <button
                onClick={() => setDeleteProducts(!deleteProducts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  deleteProducts ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    deleteProducts ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <FaCheck /> {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
