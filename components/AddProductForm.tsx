// app/(dashboard)/add-product/AddProductForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ImageUploader from "@/components/ImageUploader";
import { SizeSelector } from "@/components/SizeSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { supabase } from "@/utils/supabaseClient";

type Size = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";

interface Category {
  categoryid: number;
  categoryname: string;
}

interface Brand {
  brandid: number;
  brandname: string;
}

interface ColorOption {
  hex: string;
  name: string;
}

interface UploadRef {
  getUploadFunction: () => Promise<{
    mainImageUrl?: string;
    galleryUrls: string[];
  }>;
}

const AddProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [category, setCategory] = useState("");
  const [brandid, setBrandid] = useState<number | null>(null);
  const [brandInput, setBrandInput] = useState("");
  const [addingNewBrand, setAddingNewBrand] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("Men");
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [variantSizes, setVariantSizes] = useState<Record<string, Size[]>>({});
  const [variantSkus, setVariantSkus] = useState<Record<string, string>>({});
  const [price, setPrice] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [stock, setStock] = useState("");
  const [seoUrl, setSeoUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const variantUploadRefs = useRef<Record<string, UploadRef>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("categoryid, categoryname");

      const { data: brandData } = await supabase
        .from("brands")
        .select("brandid, brandname");

      setCategories(categoryData || []);
      setBrands(brandData || []);
      console.log("Fetched brands:", brandData);
    };

    fetchInitialData();
  }, []);

  const handleColorSelect = (colors: ColorOption[]) => {
    setSelectedColors(colors);
    const initialSizes: Record<string, Size[]> = {};
    const initialSkus: Record<string, string> = {};

    colors.forEach((color) => {
      initialSizes[color.hex] = variantSizes[color.hex] || [];
      initialSkus[color.hex] = variantSkus[color.hex] || "";
    });
    setVariantSizes(initialSizes);
    setVariantSkus(initialSkus);
  };

  const handleVariantSizeChange = (colorHex: string, sizes: Size[]) => {
    setVariantSizes((prev) => ({
      ...prev,
      [colorHex]: sizes,
    }));
  };

  const handleVariantSkuChange = (colorHex: string, sku: string) => {
  setVariantSkus((prev) => ({
    ...prev,
    [colorHex]: sku,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let resolvedBrandId = brandid;

    if (brandid === null && brandInput.trim() !== "") {
      const { data: newBrand, error } = await supabase
        .from("brands")
        .insert({ brandname: brandInput.trim() })
        .select()
        .single();

      if (error) {
        console.error("Failed to insert new brand:", error);
        return;
      }

      resolvedBrandId = newBrand.brandid;
    }

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name: productName,
        categoryid: Number(category),
        brandid: resolvedBrandId,
        description,
        Gender: gender,
        baseprice: Number(price),
        discountvalue: Number(discountValue),
        discounttype: discountType,
        stock: Number(stock),
        seourl: seoUrl,
        seotitle: seoTitle,
        seokeywords: seoKeywords,
        seodetails: seoDescription,
      })
      .select()
      .single();

    if (productError) {
      console.error("Error inserting product:", productError);
      return;
    }

    const productid = productData.productid;

    for (const color of selectedColors) {
      const uploader = variantUploadRefs.current[color.hex];
      const { mainImageUrl } = uploader
        ? await uploader.getUploadFunction()
        : { mainImageUrl: "" };

      const sizes = variantSizes[color.hex] || [];
      const sizeString = sizes.join(","); // "S,M,L"
      const variant = {
        productid: productid,
        colorCode: color.hex,
        colorName: color.name,
        size: sizeString,
        price: Number(price),
        stock: Number(stock),
        mainimageurl: mainImageUrl || "",
        sku: variantSkus[color.hex] || "",
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      };

      const { error: variantError } = await supabase
        .from("productvariants")
        .insert([variant]);

      if (variantError) {
        console.error("Error inserting variant:", variantError);
      }
    }

    alert("Product uploaded successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
    >
      {/* Left Column */}
      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="font-semibold mb-1 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md bg-white border px-4 py-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.categoryid} value={cat.categoryid.toString()}>
                {cat.categoryname}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className="font-semibold">Product Name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full rounded border px-4 py-2 bg-white"
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="font-semibold">Brand</label>
          <select
            value={
              addingNewBrand
                ? "add-new"
                : brandid !== null
                ? brandid.toString()
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "add-new") {
                setAddingNewBrand(true);
                setBrandid(null);
                setBrandInput("");
              } else {
                setAddingNewBrand(false);
                setBrandid(value ? Number(value) : null);
              }
            }}
            className="w-full rounded-md bg-white border px-4 py-2"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.brandid} value={b.brandid}>
                {b.brandname}
              </option>
            ))}
            <option value="add-new">+ Add New Brand</option>
          </select>

          {addingNewBrand && (
            <input
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="Enter new brand name"
              className="w-full rounded-md bg-white border px-4 py-2"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-4 py-2 bg-white"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold block mb-2">Gender</label>
          <div className="flex gap-4">
            {["Men", "Women", "Unisex"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div>
          <label className="font-semibold block mb-2">Select Colors</label>
          <ColorSelector
            selectedColors={selectedColors}
            onSelect={handleColorSelect}
            multiple={true}
            allowAddColor={true}
          />
        </div>

        {/* Variants */}
        {selectedColors.map((color) => (
          <div key={color.hex} className="p-4 mt-4 rounded border bg-white">
            <h4 className="font-semibold mb-2">Variant - {color.name}</h4>
            <ImageUploader
              onReady={(ref: UploadRef) => {
                variantUploadRefs.current[color.hex] = ref;
              }}
            />
            <div className="mt-2">
              <SizeSelector
                selectedSizes={variantSizes[color.hex] || []}
                onSelect={(sizes) => handleVariantSizeChange(color.hex, sizes)}
                availableSizes={["XS", "S", "M", "L", "XL", "2XL", "3XL"]}
                multiple={true}
              />
            </div>
            {/* SKU Input */}
            <div className="mt-2">
              <label className="font-semibold block mb-1">SKU Code</label>
              <input
                value={variantSkus[color.hex] || ""}
                onChange={(e) => handleVariantSkuChange(color.hex, e.target.value)}
                placeholder="Enter SKU"
                className="w-full rounded border px-3 py-2 bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Pricing & Stock */}
        <div className="rounded bg-gray-50 p-4">
          <label className="font-semibold block mb-2">Pricing & Stock</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Base Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
            <input
              placeholder="Discount Value"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            >
              <option value="">Discount Type</option>
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
            <input
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
          </div>
        </div>

        {/* SEO */}
        <div>
          <label className="font-semibold">SEO</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="SEO URL"
              value={seoUrl}
              onChange={(e) => setSeoUrl(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
            <input
              placeholder="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
            <input
              placeholder="SEO Keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
            <input
              placeholder="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="rounded border px-3 py-2 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-semibold w-full"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
