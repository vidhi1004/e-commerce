// "use client";

// import { Order } from "@/app/components/order_component/OrderComponent";
// import { useEffect, useState } from "react";
// import AddReviewComponent from "../review_component/AddReview";
// import { API_BASE_URL } from "../../../../lib/api";

// export default function OrderDetailComponent({ id }) {
//   const [order, setOrder] = useState<Order | null>(null);
//   const [variant, setVariant] = useState<Order | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/order/${id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const orderData = await response.json();

//       if (response.ok) {
//         setOrder(orderData);
//       }
//     };
//     fetchOrder();
//     const productVariantId = order?.items?.[0].productVariantId;

//     const fetchVariant = async () => {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `${API_BASE_URL}/catalog/variants/${productVariantId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       const variantData = await response.json();

//       if (response.ok) {
//         setVariant(variantData);
//       }
//     };

//     fetchVariant();
//   }, [id]);
//   console.log(order);

//   if (!order) {
//     return "Not Available";
//   } else {
//     return (
//       <div className="max-w-4xl mx-auto space-y-5">
//         <h1 className="text-3xl font-bold mb-8">My Orders</h1>

//         <p>Status: {order.status}</p>

//         <p>Total: ₹{order.totalAmount}</p>

//         <Image src={variant.images.imageUrl}></Image>

//         <div>
//           Items:{" "}
//           {order.items.map((item) => (
//             <div>
//               <div>{item.productName}</div>
//               <div>{item.quantity}</div>
//               <div>{item.unitPrice}</div>
//               <div>{item.subtotal}</div>

//               <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

//               {selectedProduct === item.productId ? (
//                 <AddReviewComponent productId={item.productId} />
//               ) : (
//                 <button
//                   onClick={() => setSelectedProduct(item.productId)}
//                   className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
//                 >
//                   Write Review
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="mt-4"></div>
//       </div>
//     );
//   }
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Fixed missing import
import AddReviewComponent from "../review_component/AddReview";
import { API_BASE_URL } from "../../../../../lib/api";
import OrderTimeline from "../OrderTimeline";

interface OrderItem {
  productId: number;
  productVariantId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  awbCode: string;
  courierName: string;
}

export default function OrderDetailComponent({ id }: { id: number }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [productImages, setProductImages] = useState<{ [key: number]: string }>(
    {},
  );
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const orderResponse = await fetch(`${API_BASE_URL}/order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!orderResponse.ok) throw new Error("Failed to fetch order");
        const orderData: Order = await orderResponse.json();
        setOrder(orderData);
        console.log(order);

        if (orderData?.items) {
          const imageMap: { [key: number]: string } = {};

          await Promise.all(
            orderData.items.map(async (item) => {
              try {
                const productResponse = await fetch(
                  `${API_BASE_URL}/catalog/products/${item.productId}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                if (productResponse.ok) {
                  const variantData = await productResponse.json();

                  imageMap[item.productId] =
                    variantData?.images?.imageUrl ||
                    variantData?.images?.[0]?.imageUrl ||
                    "/placeholder.png";
                }
              } catch (err) {
                console.error(
                  `Error fetching variant ${item.productVariantId}`,
                  err,
                );
              }
            }),
          );
          setProductImages(imageMap);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrderDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500 border rounded-lg bg-gray-50 mt-10">
        Order Details Not Available
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    DELIVERED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border-b pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              dateStyle: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[order.status.toUpperCase()] || "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Items Ordered</h2>

        {order.items.map((item) => (
          <div
            key={item.productVariantId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition gap-4"
          >
            {/* Left: Product Image & Metadata */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src={productImages[item.productId] || "/placeholder.png"}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-600 font-medium sm:hidden mt-1">
                  ₹{item.unitPrice} each
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:items-end justify-between gap-3 border-t sm:border-none pt-3 sm:pt-0">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-500">
                  ₹{item.unitPrice} × {item.quantity}
                </p>
                <p className="font-bold text-gray-900 mt-0.5">
                  ₹{item.subtotal}
                </p>
              </div>
              <div className="sm:hidden flex justify-between items-center w-full">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="font-bold text-gray-900">
                  ₹{item.subtotal}
                </span>
              </div>

              <div className="w-full sm:w-64 mt-1">
                {selectedProduct === item.productId ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-dashed">
                    <AddReviewComponent
                      orderId={id}
                      productId={item.productId}
                    />
                  </div>
                ) : order.status === "DELIVERED" ? (
                  <button
                    onClick={() => setSelectedProduct(item.productId)}
                    className="w-full text-center text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 transition active:bg-gray-100"
                  >
                    Write a Product Review
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Payment Summary</p>
        </div>
        <div className="w-full sm:w-auto flex justify-between sm:justify-end items-baseline gap-6 border-t sm:border-none pt-3 sm:pt-0">
          <span className="text-gray-700 font-medium text-lg">
            Grand Total:
          </span>
          <span className="text-2xl font-black text-gray-900">
            ₹{order.totalAmount}
          </span>
        </div>
      </div>
      <div>
        <OrderTimeline
          currentStatus={order.status}
          awbCode={order.awbCode}
          courierName={order.courierName}
        ></OrderTimeline>
      </div>
    </div>
  );
}
