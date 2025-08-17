"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import ProductImageViewer from "@/components/ProductImageViewer";
import { ColorSelector } from "@/components/ColorSelector";
import { SizeSelector } from "@/components/SizeSelector"; // ❌ no "Size" here
import { ProductVariant } from "./page";

// Local type for sizes (matches SizeSelector)
type Size = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";

// Local type for color options
interface ColorOption {
  name: string;
  hex: string;
}
interface ExtendedColorOption extends ColorOption {
  variantid?: number;
}

export default function ProductDetailsClient({
  variant,
  variantId: initialVariantId,
  availableColors,
  allVariants,
}: {
  variant: ProductVariant;
  variantId: number;
  availableColors: ExtendedColorOption[];
  allVariants: ProductVariant[];
}) {
  const router = useRouter();

  const [selectedColors, setSelectedColors] = useState<ExtendedColorOption[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [currentVariantId, setCurrentVariantId] = useState<number>(initialVariantId);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  const productName = variant.products?.name ?? "Unknown Product";
  const selectedColorText =
    selectedColors.length > 0 ? selectedColors[0].name : "Not selected";
  const selectedSizeText =
    selectedSizes.length > 0 ? selectedSizes[0] : "Not selected";

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the product "${productName}".\nColor: ${selectedColorText}\nSize: ${selectedSizeText}`
  );
  const whatsappLink = `https://wa.me/91XXXXXXXXXX?text=${whatsappMessage}`;

  // Preselect first color & sizes on mount
  useEffect(() => {
    if (availableColors.length > 0) {
      const firstColor =
        availableColors.find((c) => c.variantid === initialVariantId) ||
        availableColors[0];

      setSelectedColors([firstColor]);
      if (firstColor.variantid) {
        setCurrentVariantId(firstColor.variantid);

        const sizesForColor = allVariants
          .filter(
            (v) => v.colorCode?.toLowerCase() === firstColor.hex.toLowerCase()
          )
          .map((v) => v.size as Size)
          .filter(Boolean);

        setAvailableSizes(sizesForColor);

        router.replace(`/product-details/${firstColor.variantid}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleColorSelect = (colors: ColorOption[]) => {
    const extendedColors = colors as ExtendedColorOption[];

    if (extendedColors.length > 0) {
      const newColor = extendedColors[0];
      setSelectedColors(extendedColors);

      if (newColor.variantid) {
        setCurrentVariantId(newColor.variantid);

        const sizesForColor = allVariants
          .filter(
            (v) => v.colorCode?.toLowerCase() === newColor.hex.toLowerCase()
          )
          .map((v) => v.size as Size)
          .filter(Boolean);

        setAvailableSizes(sizesForColor);

        router.replace(`/product-details/${newColor.variantid}`);
      }
    }
  };

  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_600px] gap-8 xl:gap-16">
      {/* LEFT: Images */}
      <div>
        <ProductImageViewer variantid={currentVariantId} />
      </div>

      {/* RIGHT: Product Info */}
      <div className="space-y-6 xl:pl-12">
        <div className="text-sm text-gray-500">
          Home / Shop / {productName}
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">{productName}</h1>

        <div className="text-2xl font-bold text-gray-900">
          AED {variant.price ? variant.price.toFixed(2) : "N/A"}
        </div>

        <p className="text-gray-700 leading-relaxed">
          {variant.products?.description ?? "No description available."}
        </p>

        {/* Colors */}
        {availableColors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Color</h4>
            <ColorSelector
              selectedColors={selectedColors}
              onSelect={handleColorSelect}
              availableColors={availableColors}
              multiple={false}
              allowAddColor={false}
            />
          </div>
        )}

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Size</h4>
            <SizeSelector
              selectedSizes={selectedSizes}
              onSelect={setSelectedSizes}
              availableSizes={availableSizes}
              multiple={false}
            />
          </div>
        )}

        {/* Enquiry Button */}
        <div className="flex items-center gap-4 mt-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 text-sm font-bold uppercase rounded text-white"
          >
            <FaWhatsapp size={18} />
            Enquiry
          </a>
        </div>

        <button className="text-sm text-gray-600 underline mt-2">
          Add to wishlist
        </button>

        {/* Extra details */}
        <div className="pt-6 space-y-1 text-sm text-gray-600">
          <div>
            <strong>SKU:</strong> {variant.sku ?? "N/A"}
          </div>
          <div>
            <strong>Category:</strong>{" "}
            {variant.products?.categories?.categoryname ?? "N/A"}
          </div>
          {/* <div><strong>Tags:</strong> {variant.products?.tags ?? "N/A"}</div> */}
        </div>
      </div>
    </main>
  );
}
