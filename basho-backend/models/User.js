const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Password is optional (used for admin account and sign in users)
    password: {
      type: String,
    },
    // Flag to identify the single admin user
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiresAt: Date,

    // User profile information
    firstName: {
      type: String,
      default: ""
    },
    lastName: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    profilePhoto: {
      type: String,
      default: ""
    },

    // Wishlist: list of product IDs
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Cart: products with quantities
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    // Purchase history (previously bought items)
    orders: [
      {
        items: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            qty: {
              type: Number,
              default: 1,
              min: 1,
            },
          },
        ],
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
