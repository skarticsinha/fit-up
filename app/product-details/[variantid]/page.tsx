import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

interface Category {
  categoryname?: string;
}

interface Product {
  name?: string;
  description?: string;
  categories?: Category;
}

export interface ProductVariant {
  variantid: number;
  productid: number;
  color?: string;
  colorName?: string;
  colorCode?: string;
  size?: string;
  price?: number;
  sku?: string;
  products?: Product;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ variantid: string }>;
}) {
  const resolvedParams = await params; // ✅ await params
  const variantId = parseInt(resolvedParams.variantid);
  if (!variantId || isNaN(variantId)) return notFound();

  const supabase = await getSupabaseServerClient();

  // Fetch the main variant with category
  const { data: variant, error } = await supabase
    .from("productvariants")
    .select(
      `
      *,
      products(
        *,
        categories(categoryname)
      )
    `
    )
    .eq("variantid", variantId)
    .single<ProductVariant>();

  if (!variant || error) {
    console.error("Supabase error:", error);
    return notFound();
  }

  // Fetch all variants for the product
  const { data: allVariants } = await supabase
    .from("productvariants")
    .select("*")
    .eq("productid", variant.productid)
    .returns<ProductVariant[]>();

  if (!allVariants) return notFound();

  // Build unique colors list
  const availableColors = Array.from(
    new Map(
      allVariants.map((v) => [
        v.colorCode?.toLowerCase() || v.color?.toLowerCase(),
        {
          name: v.colorName || v.color || "Unnamed Color",
          hex: v.colorCode || "#000000",
          variantid: v.variantid,
        },
      ])
    ).values()
  );

  return (
    <>
      <Navbar />
      <ProductDetailsClient
        variant={variant}
        variantId={variantId}
        availableColors={availableColors}
        allVariants={allVariants}
      />
      <Footer />
    </>
  );
}
