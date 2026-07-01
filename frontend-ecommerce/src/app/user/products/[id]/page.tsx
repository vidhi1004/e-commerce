import ProductDetailComponent from "@/app/user/components/product_components/productDetailComponent";
import { API_BASE_URL } from "../../../../../lib/api";

const SingleProduct = async ({ params }) => {
  const { id } = await params;
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/catalog/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const product = await response.json();
      return product;
    } catch (error) {
      console.error(error);
    }
  };
  const product = await fetchData();

  if (!product) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <ProductDetailComponent product={product}></ProductDetailComponent>
      </div>
    );
  }
};

export default SingleProduct;
