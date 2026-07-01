import EditProductDetails from "@/app/admin/components/EditProductDetailComponent";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProductDetails id={Number(id)} />;
}
