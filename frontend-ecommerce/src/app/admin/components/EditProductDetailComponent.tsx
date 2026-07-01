"use client";

import { useEffect, useState } from "react";
import ProductVariantTable from "@/app/admin/components/ProductVariantTable";
import CreateProductVariant from "@/app/admin/components/CreateProductVariant";
import InventoryTable from "./InventoryTable";
import AddInventory from "./InventoryForm";
import ImageTable from "./ImageTable";
import AddImage from "./ImageForm";
import ProductBasicForm from "./ProductBasicForm";
import VariantForm from "@/app/admin/components/CreateProductVariant";
import ImageForm from "./ImageForm";
import InventoryForm from "./InventoryForm";
import { API_BASE_URL } from "../../../../lib/api";

interface EditProductDetailsProps {
  id: number;
}

export default function EditProductDetails({ id }: EditProductDetailsProps) {
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInventory, setSelectedInventory] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>();

  const fetchProduct = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/catalog/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      setProduct(data);
      setVariants(data.variants);
      setImages(data.images);

      console.log(data.variants);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchProduct()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <div className="border-2 border-gray-400 shadow-gray-400 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <ProductBasicForm id={id} product={product} onUpdated={fetchProduct} />
      </div>

      <ProductVariantTable
        productVariants={variants}
        onEdit={setSelectedVariant}
      />

      {selectedVariant ? (
        <VariantForm
          productId={id}
          variant={selectedVariant}
          onSuccess={() => {
            setSelectedVariant(undefined);
            fetchProduct();
          }}
        />
      ) : showVariantForm ? (
        <VariantForm
          productId={id}
          onSuccess={() => {
            setShowVariantForm(false);
            fetchProduct();
          }}
          onCancel={() => {
            setShowVariantForm(false);
          }}
        />
      ) : (
        <div>
          <button
            onClick={() => setShowVariantForm(true)}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Variant
          </button>
        </div>
      )}

      <InventoryTable variants={variants} onEdit={setSelectedInventory} />

      {selectedInventory && (
        <InventoryForm
          variants={variants}
          inventory={selectedInventory}
          onSuccess={() => {
            setSelectedInventory(undefined);
            fetchProduct();
          }}
        />
      )}

      {selectedInventory ? (
        <InventoryForm
          variants={variants}
          inventory={selectedInventory}
          onSuccess={() => {
            setSelectedInventory(undefined);
            fetchProduct();
          }}
        />
      ) : showInventoryForm ? (
        <InventoryForm
          variants={variants}
          onSuccess={() => {
            setShowInventoryForm(false);
            fetchProduct();
          }}
          onCancel={() => {
            setShowInventoryForm(false);
          }}
        />
      ) : (
        <button
          onClick={() => setShowInventoryForm(true)}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Inventory
        </button>
      )}

      <ImageTable images={images} onEdit={setSelectedImage} />

      {selectedImage && (
        <ImageForm
          productId={id}
          image={selectedImage}
          onSuccess={() => {
            setSelectedImage(undefined);
            fetchProduct();
          }}
        />
      )}

      {selectedImage ? (
        <ImageForm
          productId={id}
          image={selectedImage}
          onSuccess={() => {
            setSelectedImage(undefined);
            fetchProduct();
          }}
        />
      ) : showImageForm ? (
        <ImageForm
          productId={id}
          onSuccess={() => {
            setShowImageForm(false);
            fetchProduct();
          }}
          onCancel={() => {
            setShowImageForm(false);
          }}
        />
      ) : (
        <button
          onClick={() => setShowImageForm(true)}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Image
        </button>
      )}
    </div>
  );
}
