import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Delete category only
 * -> Products inside will be marked with `categoryid = null`
 */
export async function deleteCategory(categoryId: string) {
  try {
    // Move products to uncategorized (null categoryid)
    const { error: productError } = await supabase
      .from("products")
      .update({ categoryid: null })
      .eq("categoryid", categoryId);

    if (productError) throw productError;

    // Delete the category itself
    const { error: categoryError } = await supabase
      .from("categories")
      .delete()
      .eq("categoryid", categoryId);

    if (categoryError) throw categoryError;

    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false, error: err };
  }
}
