import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";


export default function Checkout() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "Loading...",
    email: "Loading...",
    address: "Loading...",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  async function fetchShipmentPayment() {
    try {
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }
      setUser({
        fullname: data.user.fullname,
        email: data.user.email,
        address: data.user.address || "No address provided",
      });
      setLoading(false);
    }catch(error){
      console.error("Error fetching user profile:", error);
      navigate("/signin");
    }
  }

   useEffect(() => {
    fetchShipmentPayment();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate("/confirmation");
   
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center pt-16 pb-24 px-6 relative">

      <button
        onClick={() => navigate("/cart")}
        className="absolute left-4 top-4 p-2 rounded-full hover:bg-slate-100 transition"
      >
        <img src="/assets/arrow_back_icon.svg" className="w-6 h-6 opacity-80" />
      </button>

      <h1 className="text-center text-[32px] font-semibold leading-tight font-[Lora] mb-6">
        Checkout
      </h1>
        <div className="w-full max-w-sm mt-6">
        <p className="text-sm text-slate-700 mb-3 font-medium">Payment Method</p>

        <div className="flex flex-col gap-3">

            <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer">
            <img src="/assets/payment_card_icon.svg" className="w-6 h-6 opacity-80" />
            <span className="text-sm flex-1">Credit / Debit Card</span>

            <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="w-4 h-4"
            />
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer">
            <img src="/assets/paypal.svg" className="w-6 h-6 opacity-80" />
            <span className="text-sm flex-1">PayPal</span>

            <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="w-4 h-4"
            />
            </label>

            <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer">
            <img src="/assets/money_icon.svg" className="w-6 h-6 opacity-80" />
            <span className="text-sm flex-1">Cash on Delivery</span>

            <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="w-4 h-4"
            />
            </label>

        </div>
        </div>


      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-6"
      >

        <div className="w-full max-w-sm mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Shipment Information
        </h2>

        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-6">
            <div className="mb-4">
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="text-[16px] font-medium text-slate-900 mt-1">
                {user.fullname}
            </p>
            </div>

            <div className="mb-4">
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-[16px] font-medium text-slate-900 mt-1">
                {user.email}
            </p>
            </div>

            <div>
            <p className="text-sm text-slate-500">Address</p>
            <p className="text-[16px] font-medium text-slate-900 mt-1">
                {user.address}
            </p>
            </div>
        </div>
        </div>

        <div className="w-full max-w-sm mt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-[15px]">

                <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>$120.00</span>
                </div>

                <div className="flex justify-between text-slate-700">
                <span>Shipping</span>
                <span>$10.00</span>
                </div>

                <div className="flex justify-between text-slate-700">
                <span>Taxes</span>
                <span>$5.00</span>
                </div>

                <div className="h-[1px] w-full bg-slate-300 my-2" />

                <div className="flex justify-between text-slate-900 font-semibold text-[17px]">
                <span>Total</span>
                <span>$135.00</span>
                </div>

            </div>
        </div>



        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white text-[15px] font-medium shadow-sm hover:bg-slate-800 transition mt-6"
        >
          Pay Now
        </button>
      </form>
      <BottomNav />
    </div>
  );
}
