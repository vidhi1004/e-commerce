import FilterComponent from "./components/filterComponent";
import { API_BASE_URL } from "../../../lib/api";
export default async function Home() {
  const fetchProductData = async () => {
    const response = await fetch(`${API_BASE_URL}/catalog/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const productData = await response.json();
    if (response.ok) {
      return productData.products;
    }
  };
  const fetchCategoryData = async () => {
    const response = await fetch(`${API_BASE_URL}/catalog/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      return data.categories;
    }
  };
  const products = await fetchProductData();
  const categories = await fetchCategoryData();
  return (
    <FilterComponent
      products={products}
      categories={categories}
    ></FilterComponent>
  );
}
