// "use client";

// import { useRouter } from "next/navigation";

// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// export default function CheckOutComponent({ params }) {
//   const items = params;
//   const router = useRouter();

//   const handleClick = async () => {
//     const token = localStorage.getItem("token");
//     const orderResponse = await fetch(`${API_BASE_URL}/order`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         items,
//       }),
//     });
//     const data = await orderResponse.json();
//     if (orderResponse.ok) {
//       const paymentResponse=await fetch(`${API_BASE_URL}/payment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           orderId: data.id,
//         }),
//       });
//       const result = await paymentResponse.json()
//       const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: result.amount,
//       currency: 'INR',
//       name: 'Your Company Name',
//       description: 'Test Transaction',
//       order_id: result.orderId,
//         handler(result) {
//             await fetch(`${API_BASE_URL}/payment/${result.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//             paymentstatus:result.paymentstatus,
//             paymentMode:result.paymentMode,
//             transactionId:result.transactionId,
//             razorpayPaymentId: result.razopayPaymentId,
//             razorpaySignature: result.razorpaySignature

//         }),

//         },
//       });

//     } else {
//       alert("something went wrong");
//     }
//   };
//   return (
//     <button
//       onClick={handleClick}
//       className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700"
//     >
//       Checkout
//     </button>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckOutComponent({ params }) {
  const items = params;
  const router = useRouter();

  // 1. ADDED Local State Parameters to Capture Shipping Addresses
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit

    // 2. Form Input Validation Guards
    if (
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPincode ||
      !shippingPhone
    ) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    setIsProcessing(true);
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      toast.error("Unable to load Razorpay");
      setIsProcessing(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const orderResponse = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          items,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingPincode,
          shippingPhone,
        }),
      });

      if (!orderResponse.ok) {
        toast.error("Failed to create order");
        setIsProcessing(false);
        return;
      }

      const order = await orderResponse.json();

      const paymentResponse = await fetch(`${API_BASE_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!paymentResponse.ok) {
        toast.error("Failed to create payment");
        setIsProcessing(false);
        return;
      }

      const payment = await paymentResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(Number(payment.amount) * 100),
        currency: payment.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: payment.razorpayOrderId,
        handler: async function (response: any) {
          const verifyResponse = await fetch(
            `${API_BASE_URL}/payment/${payment.paymentId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
              body: JSON.stringify({
                paymentstatus: "SUCCESS",
                paymentMode: "UPI",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            },
          );

          if (verifyResponse.ok) {
            localStorage.removeItem("cart");
            toast.success("Payment Successful");
            router.push("/orders");
          } else {
            toast.error("Payment Verification Failed");
          }
        },
        modal: {
          ondismiss: async function () {
            await fetch(`${API_BASE_URL}/payment/${payment.paymentId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
              body: JSON.stringify({
                paymentstatus: "FAILED",
                paymentMode: "UPI",
              }),
            });
            toast.warning("Payment Cancelled");
            setIsProcessing(false);
          },
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected runtime error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Shipping Details
      </h2>

      {/* 4. Interactive Input Fields Layout */}
      <form onSubmit={handleClick} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            Street Address
          </label>
          <input
            type="text"
            required
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Flat/House No, Building, Street Name"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-blue-500 transition-all text-gray-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="Indore"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-blue-500 transition-all text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              State
            </label>
            <input
              type="text"
              required
              value={shippingState}
              onChange={(e) => setShippingState(e.target.value)}
              placeholder="Madhya Pradesh"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-blue-500 transition-all text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Pincode
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={shippingPincode}
              onChange={(e) =>
                setShippingPincode(e.target.value.replace(/\D/g, ""))
              } // Numbers only sanitizer
              placeholder="452001"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-blue-500 transition-all text-gray-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={shippingPhone}
              onChange={(e) =>
                setShippingPhone(e.target.value.replace(/\D/g, ""))
              } // Numbers only sanitizer
              placeholder="9876543210"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-blue-500 transition-all text-gray-800 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-900 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm"
        >
          {isProcessing ? "Processing Order..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}
