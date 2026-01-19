/**
 * GST and Shipping Calculation Utilities
 * For pottery ecommerce with GST (CGST + SGST = 12% total)
 */

// GST rates
const CGST_RATE = 0.06; // 6%
const SGST_RATE = 0.06; // 6%

// Shipping slabs based on weight (kg)
const SHIPPING_SLABS = [
  { maxWeight: 0.5, charge: 40 },
  { maxWeight: 1, charge: 60 },
  { maxWeight: 2, charge: 90 },
  { maxWeight: 5, charge: 150 },
  { maxWeight: Infinity, charge: 250 },
];

/**
 * Extract numeric value from price string
 * Handles formats like "₹2,800 /-", "2800", "₹1,900", etc.
 */
export const getNumericPrice = (price) => {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const numericPrice = parseFloat(String(price).replace(/[^\d.-]/g, ""));
  return isNaN(numericPrice) ? 0 : numericPrice;
};

/**
 * Get weight from product
 * Assumes product has a "weight" or "weightKg" field
 */
export const getProductWeight = (product) => {
  if (!product) return 0;
  const weight = product.weightKg || product.weight || 0.3; // Default 300g if not specified
  return parseFloat(weight) || 0.3;
};

/**
 * Calculate shipping charge based on total weight
 */
export const calculateShippingCharge = (totalWeightKg) => {
  for (const slab of SHIPPING_SLABS) {
    if (totalWeightKg <= slab.maxWeight) {
      return slab.charge;
    }
  }
  return SHIPPING_SLABS[SHIPPING_SLABS.length - 1].charge;
};

/**
 * Calculate cart totals with GST and shipping
 * Returns: { subtotal, totalWeight, shippingCharge, cgst, sgst, grandTotal }
 */
export const calculateCartTotal = (cartItems = [], products = []) => {
  // Calculate subtotal and total weight
  let subtotal = 0;
  let totalWeight = 0;

  cartItems.forEach((item) => {
    const product = products.find((p) => p._id === item.id || p.id === item.id);
    const price = getNumericPrice(product?.price ?? item.price ?? 0);
    const weight = getProductWeight(product);

    subtotal += price * (item.qty || 1);
    totalWeight += weight * (item.qty || 1);
  });

  // Calculate shipping
  const shippingCharge = calculateShippingCharge(totalWeight);

  // Calculate GST
  const cgst = Math.round((subtotal * CGST_RATE) * 100) / 100;
  const sgst = Math.round((subtotal * SGST_RATE) * 100) / 100;

  // Calculate grand total
  const grandTotal = Math.round((subtotal + cgst + sgst + shippingCharge) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalWeight: Math.round(totalWeight * 1000) / 1000, // kg
    shippingCharge: Math.round(shippingCharge * 100) / 100,
    cgst,
    sgst,
    grandTotal,
  };
};

/**
 * Calculate workshop total with GST (NO shipping)
 * Returns: { workshopFee, cgst, sgst, total }
 */
export const calculateWorkshopTotal = (workshopFee) => {
  const fee = getNumericPrice(workshopFee);

  // Calculate GST
  const cgst = Math.round((fee * CGST_RATE) * 100) / 100;
  const sgst = Math.round((fee * SGST_RATE) * 100) / 100;

  // Calculate total
  const total = Math.round((fee + cgst + sgst) * 100) / 100;

  return {
    workshopFee: Math.round(fee * 100) / 100,
    cgst,
    sgst,
    total,
  };
};

/**
 * Format price for display (with rupee symbol)
 */
export const formatPrice = (price) => {
  return `₹${(Math.round(price * 100) / 100).toFixed(2)}`;
};
