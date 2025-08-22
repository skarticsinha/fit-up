import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Delete category + all products inside it
 * (cleans up product variants + images first)
 */
export async function deleteCategoryWithProducts(categoryId: string) {
  try {
    // Fetch all products in this category
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("productid")
      .eq("categoryid", categoryId);

    if (productsError) throw productsError;

    if (products && products.length > 0) {
      const productIds = products.map((p) => p.productid);

      // Fetch variants for these products
      const { data: variants, error: variantsError } = await supabase
        .from("productvariants")
        .select("variantid")
        .in("productid", productIds);

      if (variantsError) throw variantsError;

      const variantIds = variants?.map((v) => v.variantid) || [];

      if (variantIds.length > 0) {
        // Delete variant images
        const { error: variantImagesError } = await supabase
          .from("variantimages")
          .delete()
          .in("variantid", variantIds);

        if (variantImagesError) throw variantImagesError;

        // Delete variants
        const { error: deleteVariantsError } = await supabase
          .from("productvariants")
          .delete()
          .in("variantid", variantIds);

        if (deleteVariantsError) throw deleteVariantsError;
      }

      // Delete products
      const { error: deleteProductsError } = await supabase
        .from("products")
        .delete()
        .in("productid", productIds);

      if (deleteProductsError) throw deleteProductsError;
    }

    // Finally delete the category
    const { error: categoryError } = await supabase
      .from("categories")
      .delete()
      .eq("categoryid", categoryId);

    if (categoryError) throw categoryError;

    return { success: true };
  } catch (err) {
    console.error("Error deleting category + products:", err);
    return { success: false, error: err };
  }
}
