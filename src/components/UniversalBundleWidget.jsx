import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ChevronRight,
  Star,
  Sparkles,
  Zap,
  Heart,
} from "lucide-react";

const UniversalBundleWidget = ({
  mainProduct = {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
    url: "#",
    rating: 4.5,
    reviewCount: 1250,
    isNew: false,
    options: [],
  },
  relatedProducts = [
    {
      id: 2,
      name: "Wireless Charging Pad",
      price: 49.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop&crop=center",
      url: "#",
      rating: 4.2,
      reviewCount: 890,
      discount: 29,
      options: [],
    },
    {
      id: 3,
      name: "Premium Phone Case",
      price: 24.99,
      originalPrice: 34.99,
      image:
        "https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=200&fit=crop&crop=center",
      url: "#",
      rating: 4.7,
      reviewCount: 456,
      discount: 28,
      options: [],
    },
    {
      id: 4,
      name: "USB-C Fast Cable",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      url: "#",
      rating: 4.3,
      reviewCount: 234,
      isNew: true,
      options: [],
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      price: 89.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center",
      url: "#",
      rating: 4.6,
      reviewCount: 678,
      discount: 31,
      options: [],
    },
  ],
  options = {
    theme: "modern",
    layout: "horizontal",
    showSavings: true,
    enableQuantity: false,
    autoSelectMain: true,
    mobileModal: true,
    title: "Complete Your Experience",
    subtitle: "Handpicked items that work perfectly together",
  },
}) => {
  const [selectedProducts, setSelectedProducts] = useState(new Set([1]));
  const [quantities, setQuantities] = useState(new Map([[1, 1]]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const allProducts = [mainProduct, ...relatedProducts];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const initialQuantities = new Map();
    allProducts.forEach((product) => {
      initialQuantities.set(product.id, 1);
    });
    setQuantities(initialQuantities);
  }, []);

  const calculatePricing = () => {
    let subtotal = 0;
    let originalTotal = 0;
    let selectedCount = 0;

    selectedProducts.forEach((productId) => {
      const product = allProducts.find((p) => p.id === productId);
      const quantity = quantities.get(productId) || 1;
      if (product) {
        subtotal += product.price * quantity;
        originalTotal += (product.originalPrice || product.price) * quantity;
        selectedCount++;
      }
    });

    const discountAmount = originalTotal - subtotal;

    return {
      subtotal,
      originalTotal,
      discountAmount,
      selectedCount,
      finalTotal: subtotal,
    };
  };

  const pricing = calculatePricing();

  const handleProductToggle = (productId) => {
    if (productId === 1 && options.autoSelectMain) return;

    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    const newQuantities = new Map(quantities);
    newQuantities.set(productId, newQuantity);
    setQuantities(newQuantities);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const selectedItems = Array.from(selectedProducts).map((productId) => {
      const product = allProducts.find((p) => p.id === productId);
      return {
        product,
        quantity: quantities.get(productId) || 1,
      };
    });

    console.log("Adding to cart:", selectedItems);
    alert(
      `🎉 Added ${
        pricing.selectedCount
      } products to cart! Total: $${pricing.finalTotal.toFixed(2)}`
    );
    setIsAddingToCart(false);
  };

  const formatPrice = (amount) => `$${amount.toFixed(2)}`;

  const ProductBadge = ({ product, isMain }) => {
    if (isMain) {
      return (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
          <Sparkles size={10} />
          Featured
        </div>
      );
    }
    if (product.discount) {
      return (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
          <Zap size={10} />
          {product.discount}% OFF
        </div>
      );
    }
    if (product.isNew) {
      return (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
          <Sparkles size={10} />
          New
        </div>
      );
    }
    return null;
  };

  const ProductRating = ({ rating, reviewCount }) => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-gray-600 font-medium">{rating}</span>
        <span className="text-gray-400">({reviewCount?.toLocaleString()})</span>
      </div>
    );
  };

  const ProductCard = ({ product, index, context = "desktop" }) => {
    const isMain = index === 0;
    const isSelected = selectedProducts.has(product.id);
    const quantity = quantities.get(product.id) || 1;
    const isMobileContext = context === "mobile";
    const isHovered = hoveredProduct === product.id;

    return (
      <div
        className={`group relative bg-white rounded-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          isSelected
            ? "ring-4 ring-blue-500/30 shadow-2xl shadow-blue-500/20"
            : "hover:shadow-2xl hover:shadow-black/10"
        } ${isMobileContext ? "p-4" : "p-6"} backdrop-blur-sm ${
          isMain ? "bg-gradient-to-br from-purple-50 via-white to-blue-50" : ""
        }`}
        onMouseEnter={() => setHoveredProduct(product.id)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        {/* Animated background glow */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            isSelected ? "opacity-100" : ""
          }`}
        />

        <div className="relative z-10">
          <div
            className={`relative mb-4 overflow-hidden rounded-xl ${
              isMobileContext ? "h-36" : "h-48"
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? "scale-110 rotate-1" : "scale-100"
              } ${isSelected ? "brightness-105" : ""}`}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <ProductBadge product={product} isMain={isMain} />

            {/* Heart icon for favorites */}
            <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
              <Heart
                size={14}
                className="text-gray-600 hover:text-red-500 transition-colors"
              />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              {isMain && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Main Product
                  </span>
                </div>
              )}
              <label className="group/checkbox flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleProductToggle(product.id)}
                  disabled={isMain && options.autoSelectMain}
                  className="sr-only"
                />
                <div
                  className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 border-transparent shadow-lg shadow-blue-500/30"
                      : "border-gray-300 group-hover/checkbox:border-blue-400 bg-white"
                  } ${
                    isMain && options.autoSelectMain
                      ? "opacity-50"
                      : "group-hover/checkbox:scale-110"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm animate-pulse" />
                    </div>
                  )}
                </div>
              </label>
            </div>

            <h4
              className={`font-bold text-gray-900 leading-tight transition-colors group-hover:text-blue-600 ${
                isMobileContext ? "text-sm" : "text-base"
              }`}
            >
              <a
                href={product.url}
                className="hover:text-blue-600 transition-colors line-clamp-2"
              >
                {product.name}
              </a>
            </h4>

            <ProductRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-gray-400 text-sm line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                <span
                  className={`font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${
                    isMobileContext ? "text-lg" : "text-xl"
                  }`}
                >
                  {formatPrice(product.price)}
                </span>
              </div>

              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="text-xs font-semibold text-green-600">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </div>
                )}
            </div>

            {options.enableQuantity && isSelected && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, quantity - 1)
                    }
                    className="p-2 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-bold bg-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, quantity + 1)
                    }
                    className="p-2 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
                    disabled={quantity >= 10}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PricingSummary = ({ context = "desktop" }) => {
    const isMobileContext = context === "mobile";

    return (
      <div
        className={`relative overflow-hidden ${isMobileContext ? "mt-6" : ""}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="space-y-4">
            {/* Original vs Final Price */}
            {pricing.discountAmount > 0 && (
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="text-sm text-gray-600 mb-1">Original Price</div>
                <div className="text-lg font-semibold text-gray-400 line-through mb-2">
                  {formatPrice(pricing.originalTotal)}
                </div>
                <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <Sparkles size={14} />
                  You Save {formatPrice(pricing.discountAmount)}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Bundle Total:
              </span>
              <div className="text-right">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(pricing.finalTotal)}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {pricing.selectedCount} item
                  {pricing.selectedCount !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || pricing.selectedCount === 0}
              className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center justify-center gap-3">
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>
                      Add {pricing.selectedCount} Product
                      {pricing.selectedCount !== 1 ? "s" : ""} to Cart
                    </span>
                  </>
                )}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </button>

            <div className="text-center text-xs text-gray-500">
              Free shipping on orders over $100 • 30-day returns
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileCompactView = () => {
    const selectedProductsData = allProducts.filter((p) =>
      selectedProducts.has(p.id)
    );

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 overflow-x-auto pb-2">
            {selectedProductsData.map((product, index) => (
              <React.Fragment key={product.id}>
                <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {index < selectedProductsData.length - 1 && (
                  <Plus size={14} className="text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-5 rounded-xl font-bold flex items-center justify-between hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm opacity-90">Bundle Deal</span>
            <span className="text-lg">
              {pricing.selectedCount} Items: {formatPrice(pricing.finalTotal)}
            </span>
          </div>
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    );
  };

  const Modal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        />
        <div className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full mx-4 max-h-[95vh] overflow-hidden shadow-2xl animate-slideUp">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {options.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{options.subtitle}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="space-y-6">
              {allProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  context="mobile"
                />
              ))}
            </div>
            <div className="mt-8">
              <PricingSummary context="mobile" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <Sparkles size={28} className="text-purple-600" />
            <h3 className="text-4xl font-black">{options.title}</h3>
            <Sparkles size={28} className="text-blue-600" />
          </div>
          {options.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {options.subtitle}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6" />
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-8 mb-12">
            {allProducts.map((product, index) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} index={index} />
                {index < allProducts.length - 1 && index !== 0 && (
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Plus size={20} className="text-white" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <PricingSummary />
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {allProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <PricingSummary />
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <MobileCompactView />
        </div>

        {/* Modal */}
        {options.mobileModal && <Modal />}
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default UniversalBundleWidget;
