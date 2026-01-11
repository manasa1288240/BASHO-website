import flutedBowls from "../assets/products/Fluted_Bowl.png";
import studioMugs from "../assets/products/Studio_Mug.png";
import tealMugs from "../assets/products/Teal_Mug.png";
import indigoMugs from "../assets/products/Indigo_Mug.png";
import wovenPlates from "../assets/products/Woven_Plate.png";
import oceanBowls from "../assets/products/Ocean_Bowl.png";
import snackDishes from "../assets/products/Snack_Dish.png";
import servingPlates from "../assets/products/Serving_Plate.png";
import pastelPlates from "../assets/products/Pastel_Plate.png";
import clayCups from "../assets/products/Clay_Cup.png"; 
import heartbowl from "../assets/products/Heart_Bowl.png";
import lipmug from "../assets/products/Lip_Mug.png";
import mugset from "../assets/products/Mug_Set.png";
import planter from "../assets/products/Planter.png";
import stripedmug from "../assets/products/Striped_Mug.png";
import tictactoe from "../assets/products/Tic_Tac_Toe.png";
import vase from "../assets/products/Vase.png";
import wavyplate from "../assets/products/Wavy_Plate.png";
import wavyplate2 from "../assets/products/Wavy_Plate2.png";
import thumbie from "../assets/products/Thumbie.jpeg";
import flower from "../assets/products/Flower.jpeg";
import ratbird from "../assets/products/RatBird.jpeg";
import boat from "../assets/products/Boat.jpeg";
import potset from "../assets/products/Pot_Set.png";
import tumbler from "../assets/products/Tumbler.png";
import matcha from "../assets/products/Matcha.jpeg";
import dip from "../assets/products/Dip.jpeg";
import vase2 from "../assets/products/Vase2.jpeg";
import fem from "../assets/products/Fem.png";
import cap from "../assets/products/Cap.jpeg";

const featuredProducts = [
  {
    id: 1,
    name: "Fluted Stoneware Bowls",
    material: "Stoneware",
    category: "Bowls",
    price: "₹2,800 /-",
    image: flutedBowls,
    description: "Hand-thrown bowls with gentle fluting inspired by everyday rituals."
  },
  {
    id: 2,
    name: "Minimal Studio Mugs",
    material: "Ceramic",
    category: "Mugs",
    price: "₹1,900 /-",
    image: studioMugs,
    description: "Clean-lined mugs designed for quiet studio mornings."
  },
  {
    id: 3,
    name: "Teal Criss-Cross Mugs",
    material: "Stoneware",
    category: "Mugs",
    price: "₹2,200  /-",
    image: tealMugs,
    description: "Textured mugs finished in a soft teal glaze."
  },
  {
    id: 4,
    name: "Indigo Glaze Mugs",
    material: "Ceramic",
    category: "Mugs",
    price: "₹2,400 /-",
    image: indigoMugs,
    description: "Deep indigo tones inspired by traditional Japanese dyeing."
  },
  {
    id: 5,
    name: "Garlic Grater",
    material: "Clay",
    category: "Platter/Cheeseboard",
    price: "₹1,500 /-",
    image: wovenPlates,
    description: "Plates featuring hand-impressed woven textures."
  },
  {
    id: 6,
    name: "Ocean Glaze Bowl Set",
    material: "Stoneware",
    category: "Bowls",
    price: "₹2,600 /-",
    image: oceanBowls,
    description: "Soft ocean hues captured in fluid glaze movement."
  },
  {
    id: 7,
    name: "Raw Clay Snack Dishes",
    material: "Clay",
    category: "Bowls",
    price: "₹1,700 /-",
    image: snackDishes,
    description: "Unrefined clay dishes celebrating natural imperfections."
  },
  {
    id: 8,
    name: "Earth Tone Serving Plates",
    material: "Stoneware",
    category: "Plates",
    price: "₹1,000 /-",
    image: servingPlates,
    description: "Warm earth-toned plates made for shared meals."
  },
  {
    id: 9,
    name: "Pastel Wabi-Sabi Plates",
    material: "Ceramic",
    category: "Plates",
    price: "₹1,000 /-",
    image: pastelPlates,
    description: "Soft pastel plates embracing wabi-sabi philosophy."
  },
  {
    id: 10,
    name: "Everyday Clay Cups",
    material: "Clay",
    category: "Mugs",
    price: "₹1,500 /-",
    image: clayCups,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 11,
    name: "Heart Bowl",
    material: "Clay",
    category: "Bowls",
    price: "₹1,000 /-",
    image: heartbowl,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 12,
    name: "Lip Mug",
    material: "Clay",
    category: "Mugs",
    price: "₹800 /-",
    image: lipmug,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 13,
    name: "Striped Coffee Mugs Set (Includes: plate, 2 mugs, 2 coasters) ",
    material: "Clay",
    category: "Mugs",
    price: "₹2,580 /-",
    image: mugset,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 14,
    name: "Planter",
    material: "Clay",
    category: "Vase",
    price: "₹1,000 /-",
    image: planter,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 15,
    name: "Striped Mug",
    material: "Clay",
    category: "Mugs",
    price: "₹800 /-",
    image: stripedmug,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 16,
    name: "Tic Tac Toe",
    material: "Clay",
    category: "Fancy",
    price: "₹1,500 /-",
    image: tictactoe,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 17,
    name: "Vase",
    material: "Clay",
    category: "Vase",
    price: "₹2,500 /-",
    image: vase,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 18,
    name: "Wavy Plate",
    material: "Clay",
    category: "Plates",
    price: "₹1,500 /-",
    image: wavyplate,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 19,
    name: "Wavy Plate",
    material: "Clay",
    category: "Plates",
    price: "₹1,500 /-",
    image: wavyplate2,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 20,
    name: "Trinket Trays (bird & rat) ",
    material: "Clay",
    category: "Picasso Limited Collection",
    price: "₹600 /-",
    image: ratbird,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 21,
    name: "Wall Flower Frames Plate",
    material: "Clay",
    category: "Fancy",
    price: "₹2,500 /-",
    image: flower,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 22,
    name: "Trinket trays (boat)",
    material: "Clay",
    category: "Picasso Limited Collection",
    price: "₹800 /-",
    image: boat,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 23,
    name: "Tumbler/Thumbie",
    material: "Clay",
    category: "Picasso Limited Collection",
    price: "₹1,000 /-",
    image: thumbie,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 24,
    name: "Tea Pot Set:(2 cups & 1 tea pot)",
    material: "Clay",
    category: "Fancy",
    price: "₹5,000 /-",
    image: potset,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 25,
    name: "Coffee Tumblers",
    material: "Clay",
    category: "Mugs",
    price: "₹1,000 /-",
    image: tumbler,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 26,
    name: "Chip & Dip Platter",
    material: "Clay",
    category: "Platter/Cheeseboard",
    price: "₹3,500 /-",
    image: dip,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 27,
    name: "Vase",
    material: "Clay",
    category: "Vase",
    price: "₹2,500 /-",
    image: vase2,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 28,
    name: "Matcha Bowl with whisk holder ",
    material: "Clay",
    category: "Bowls",
    price: "₹2,000 /-",
    image: matcha,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 29,
    name: "Sculpted Feminine Tumbler",
    material: "Clay",
    category: "Mugs",
    price: "₹1,000 /-",
    image: fem,
    description: "Simple cups crafted for daily use and comfort."
  },
  {
    id: 30,
    name: "Cappucino Mugs",
    material: "Clay",
    category: "Mugs",
    price: "₹800 /-",
    image: cap,
    description: "Simple cups crafted for daily use and comfort."
  }
];

export default featuredProducts;
