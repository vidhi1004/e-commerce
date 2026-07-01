// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image"; // Fixed missing import
// import { API_BASE_URL } from "../../../../lib/api";

// interface OrderItem {
//   productId: number;
//   productVariantId: number;
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
//   sku: string;
// }

// interface Order {
//   id: number;
//   status: string;
//   totalAmount: number;
//   createdAt: string;
//   items: OrderItem[];
// }

// export default function OrderDetailComponent({ id }: { id: string | number }) {
//   const [order, setOrder] = useState<Order | null>(null);
//   const [productImages, setProductImages] = useState<{ [key: number]: string }>(
//     {},
//   );

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem("token");

//         const orderResponse = await fetch(`${API_BASE_URL}/order/admin/${id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!orderResponse.ok) throw new Error("Failed to fetch order");
//         const orderData: Order = await orderResponse.json();
//         setOrder(orderData);
//         console.log(order);

//         if (orderData?.items) {
//           const imageMap: { [key: number]: string } = {};

//           await Promise.all(
//             orderData.items.map(async (item) => {
//               try {
//                 const productResponse = await fetch(
//                   `${API_BASE_URL}/catalog/products/${item.productId}`,
//                   {
//                     method: "GET",
//                     headers: {
//                       "Content-Type": "application/json",
//                       Authorization: `Bearer ${token}`,
//                     },
//                   },
//                 );
//                 if (productResponse.ok) {
//                   const variantData = await productResponse.json();

//                   imageMap[item.productId] =
//                     variantData?.images?.imageUrl ||
//                     variantData?.images?.[0]?.imageUrl ||
//                     "/placeholder.png";
//                 }
//               } catch (err) {
//                 console.error(
//                   `Error fetching variant ${item.productVariantId}`,
//                   err,
//                 );
//               }
//             }),
//           );
//           setProductImages(imageMap);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchOrderDetails();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-[40vh]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 text-center text-gray-500 border rounded-lg bg-gray-50 mt-10">
//         Order Details Not Available
//       </div>
//     );
//   }

//   const statusColors: { [key: string]: string } = {
//     DELIVERED: "bg-green-100 text-green-800",
//     PENDING: "bg-yellow-100 text-yellow-800",
//     SHIPPED: "bg-blue-100 text-blue-800",
//     CANCELLED: "bg-red-100 text-red-800",
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="border-b pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
//             Order Details
//           </h1>
//           {/* <p className="text-sm text-gray-500 mt-1">
//             Ordered on{" "}
//             {new Date(order.createdAt).toLocaleDateString("en-IN", {
//               dateStyle: "long",
//             })}
//           </p> */}
//         </div>
//         <div className="flex items-center gap-3">
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[order.status.toUpperCase()] || "bg-gray-100 text-gray-800"}`}
//           >
//             {order.status}
//           </span>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h2 className="text-xl font-bold text-gray-800 mb-2">Items Ordered</h2>

//         {order.items.map((item) => (
//           <div
//             key={item.productVariantId}
//             className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition gap-4"
//           >
//             <div className="flex items-center gap-4">
//               <div className="relative h-20 w-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
//                 <Image
//                   src={productImages[item.productId] || "/placeholder.png"}
//                   alt={item.productName}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 text-base">
//                   {item.productName}
//                 </h3>
//                 <h3 className="font-semibold text-gray-500 text-base">
//                   {item.sku}
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-0.5">
//                   Quantity: {item.quantity}
//                 </p>
//                 <p className="text-sm text-gray-600 font-medium sm:hidden mt-1">
//                   ₹{item.unitPrice} each
//                 </p>
//               </div>
//             </div>

//             <div className="w-full sm:w-auto flex flex-col sm:items-end justify-between gap-3 border-t sm:border-none pt-3 sm:pt-0">
//               <div className="hidden sm:block text-right">
//                 <p className="text-sm text-gray-500">
//                   ₹{item.unitPrice} × {item.quantity}
//                 </p>
//                 <p className="font-bold text-gray-900 mt-0.5">
//                   ₹{item.subtotal}
//                 </p>
//               </div>
//               <div className="sm:hidden flex justify-between items-center w-full">
//                 <span className="text-sm text-gray-500">Subtotal:</span>
//                 <span className="font-bold text-gray-900">
//                   ₹{item.subtotal}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 bg-gray-50 rounded-xl p-6 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <p className="text-sm text-gray-500">Payment Summary</p>
//         </div>
//         <div className="w-full sm:w-auto flex justify-between sm:justify-end items-baseline gap-6 border-t sm:border-none pt-3 sm:pt-0">
//           <span className="text-gray-700 font-medium text-lg">
//             Grand Total:
//           </span>
//           <span className="text-2xl font-black text-gray-900">
//             ₹{order.totalAmount}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner"; // Used for feedback notifications

interface OrderItem {
  productId: number;
  productVariantId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  sku: string;
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  awbCode?: string;
  courierName?: string;
}

export default function OrderDetailComponent({ id }: { id: string | number }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [productImages, setProductImages] = useState<{ [key: number]: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // Tracks update loading state

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const orderResponse = await fetch(`${API_BASE_URL}/order/admin/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!orderResponse.ok) throw new Error("Failed to fetch order");
      const orderData: Order = await orderResponse.json();
      setOrder(orderData);

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
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Order state updated to ${newStatus} successfully!`);
        await fetchOrderDetails();
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Something went wrong while changing status");
    } finally {
      setIsUpdating(false);
    }
  };

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
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    SHIPPED: "bg-blue-100 text-blue-800 border-blue-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="border-b pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Order Details
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Order Identification Ref: #{order.id}
          </p>
        </div>

        {/* INTERACTIVE Dropdown Control Block */}
        <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border shadow-sm">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
            Manage State:
          </label>
          <select
            value={order.status.toUpperCase()}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border cursor-pointer outline-none transition-all
              ${statusColors[order.status.toUpperCase()] || "bg-gray-100 text-gray-800"} 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped (Fires Shiprocket)</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

     
      {order.awbCode && (
        <div className="mb-6 bg-blue-50/50 border border-blue-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">
            Active Logistics Diagnostics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Assigned Courier
              </span>
              <span className="font-semibold text-gray-800">
                {order.courierName || "Pending"}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block">
                AWB Tracking Number
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700 font-bold inline-block mt-0.5">
                {order.awbCode}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Items Ordered</h2>
        {order.items.map((item) => (
          <div
            key={item.productVariantId}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition gap-4"
          >
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
                <h3 className="font-semibold text-gray-500 text-base">
                  {item.sku}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:items-end justify-between gap-3 border-t sm:border-none pt-3 sm:pt-0">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-500">
                  {item.unitPrice} × {item.quantity}
                </p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {item.subtotal}
                </p>
              </div>
              <div className="sm:hidden flex justify-between items-center w-full">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="font-bold text-gray-900">{item.subtotal}</span>
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
            {order.totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}
