import { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import "./ProductQuickViewModal.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star, Minus, Plus } from "lucide-react";

export default function ProductQuickViewModal({ product, isOpen, onClose }) {
    const { wishlist, addToCart, toggleWishlist } = useShop();
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [selectedGlaze, setSelectedGlaze] = useState(null);

    const productId = product?._id || product?.id;

    useEffect(() => {
        if (productId) {
            setIsWishlisted(wishlist.includes(productId));
        }
    }, [wishlist, productId]);

    useEffect(() => {
        if (product?.glazeOptions && product.glazeOptions.length > 0) {
            setSelectedGlaze(product.glazeOptions[0]);
        }
    }, [product]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlist = () => toggleWishlist(product);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Handle price - could be a number or a pre-formatted string like "₹1,500 /-"
    const rawPrice = product?.price;
    const formattedPrice = typeof rawPrice === "string"
        ? rawPrice
        : `₹${(rawPrice || 0).toLocaleString("en-IN")}`;

    const stock = product?.stock ?? 10;
    const inStock = stock > 0;
    const rating = product?.rating || 0;

    const overflowVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", damping: 25, stiffness: 300 }
        },
        exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="quick-view-overlay"
                    onClick={handleOverlayClick}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={overflowVariants}
                >
                    <motion.div
                        className="quick-view-modal"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-btn" onClick={onClose} aria-label="Close modal">
                            <X size={20} />
                        </button>

                        <div className="modal-layout">
                            {/* Left Column: Image */}
                            <div className="modal-image-container">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="modal-product-image"
                                />
                                <div className="image-overlay-gradient"></div>
                                {!inStock && (
                                    <div className="out-of-stock-badge">Out of Stock</div>
                                )}
                            </div>

                            {/* Right Column: Details */}
                            <div className="modal-details">
                                <div className="product-header">
                                    <div className="category-tag">{product.category || "Pottery"}</div>
                                    <h2 className="product-title">{product.name}</h2>

                                    <div className="product-meta">
                                        <span className="product-price">{formattedPrice}</span>
                                        {rating > 0 && (
                                            <div className="rating-badge">
                                                <Star size={14} fill="currentColor" stroke="none" />
                                                <span>{rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="product-description">
                                    {product.description || "Handcrafted with precision and care, this piece adds a touch of elegance to your collection."}
                                </p>

                                <div className="product-controls">
                                    {/* Glaze Selection */}
                                    {product.glazeOptions?.length > 0 && (
                                        <div className="control-group">
                                            <label className="control-label">Glaze</label>
                                            <div className="glaze-selector">
                                                {product.glazeOptions.map((glaze) => (
                                                    <button
                                                        key={glaze}
                                                        className={`glaze-option ${selectedGlaze === glaze ? "active" : ""}`}
                                                        style={{ backgroundColor: glaze.includes("#") ? glaze : undefined }}
                                                        title={glaze}
                                                        onClick={() => setSelectedGlaze(glaze)}
                                                    >
                                                        {!glaze.includes("#") && <span className="glaze-name-tooltip">{glaze}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity */}
                                    <div className="control-group">
                                        <label className="control-label">Quantity</label>
                                        <div className="quantity-wrapper">
                                            <button
                                                className="qty-btn"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1 || !inStock}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="qty-value">{quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                                disabled={quantity >= stock || !inStock}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className={`add-to-cart-btn ${isAdded ? "success" : ""}`}
                                        onClick={handleAddToCart}
                                        disabled={!inStock}
                                    >
                                        {isAdded ? (
                                            <span className="btn-content">Added</span>
                                        ) : (
                                            <span className="btn-content">
                                                <ShoppingBag size={18} /> Add to Cart
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
                                        onClick={handleWishlist}
                                    >
                                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
