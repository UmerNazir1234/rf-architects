import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function CheckoutPage() {

  const [currentStep, setCurrentStep] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cartItem = {
    id: "dining-2",
    name: "Lloyd Extendable Dining Table - Whitewash",
    price: "$2,910.00",
    quantity: 1,
    image: "/lloyd-extendable-dining-table-whitewash.jpg",
  };

  const productImages = [
    cartItem.image,
    `/placeholder.svg?height=400&width=400&query=${cartItem.name} view 2`,
    `/placeholder.svg?height=400&width=400&query=${cartItem.name} view 3`,
    `/placeholder.svg?height=400&width=400&query=${cartItem.name} view 4`,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  const subtotal = 2910;
  const delivery = 150;
  const tax = 291;
  const total = subtotal + delivery + tax;

  return (
    <div className="min-h-screen bg-white">
      {/* <Navigation onCategorySelect={setSelectedCategory} /> */}

      <div className="grid grid-cols-3 gap-8 px-6 py-12">
        {/* Left Column - Checkout Form */}
        <div className="col-span-2">
          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-4 w-full">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${currentStep >= step
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 ${currentStep > step ? "bg-black" : "bg-gray-200"
                      }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-light">Shipping Address</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                </div>
                <select className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm bg-white">
                  <option>Select Country</option>
                  <option>Singapore</option>
                  <option>Malaysia</option>
                  <option>Thailand</option>
                </select>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-black text-white py-3 rounded-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-light">Shipping Method</h2>

              <div className="space-y-3">
                {[
                  {
                    label: "Standard Delivery",
                    desc: "5-7 business days",
                    price: "$150.00",
                    checked: true,
                  },
                  {
                    label: "Express Delivery",
                    desc: "2-3 business days",
                    price: "$300.00",
                  },
                  {
                    label: "Next Day Delivery",
                    desc: "Next business day",
                    price: "$500.00",
                  },
                ].map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 rounded-sm cursor-pointer ${option.checked
                        ? "border-2 border-black"
                        : "border border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked={option.checked}
                      className="w-4 h-4"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-gray-600">{option.desc}</p>
                    </div>
                    <span className="font-medium">{option.price}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-black text-white py-3 rounded-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-light">Payment Method</h2>

              <div className="space-y-3">
                {[
                  "Credit Card",
                  "Debit Card",
                  "Bank Transfer",
                  "Digital Wallet",
                ].map((method, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 rounded-sm cursor-pointer ${i === 0
                        ? "border-2 border-black"
                        : "border border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked={i === 0}
                      className="w-4 h-4"
                    />
                    <span className="ml-4 font-medium text-sm">{method}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="border border-gray-300 rounded-sm px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button className="flex-1 bg-black text-white py-3 rounded-sm font-medium hover:bg-gray-800 transition-colors">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-50 rounded-sm p-6 h-fit sticky top-6">
          <h3 className="text-lg font-medium mb-6">Order Summary</h3>

          <div className="relative bg-white aspect-square overflow-hidden rounded-sm mb-6">
            <img
              src={productImages[currentImageIndex] || "/placeholder.svg"}
              alt={cartItem.name}
              className="object-cover w-full h-full"
            />

            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>

            <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1} / {productImages.length}
            </div>
          </div>

          <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{cartItem.name}</p>
              <p className="font-medium text-gray-800">
                Qty: {cartItem.quantity}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium">${delivery.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <p>✓ Free delivery on orders above $2,000</p>
            <p>✓ 30-day return policy</p>
            <p>✓ 1-year warranty included</p>
          </div>
        </div>
      </div>
    </div>
  );
}
