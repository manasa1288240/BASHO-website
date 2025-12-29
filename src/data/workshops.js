import workshopImg from "../assets/workshop.jpg";

const workshopsData = [
  {
    id: 1,
    title: "Wheel Throwing Basics",
    category: "Beginner",
    duration: "3 hours",
    price: "₹3,500",
    image: workshopImg,
    description: "Master the fundamentals of throwing on the potter's wheel. Learn centering, pulling walls, and basic shaping techniques.",
    includes: ["All materials provided", "Take home 2-3 pieces", "Tea & snacks", "Studio apron"],
    level: "Beginner Friendly",
    schedule: ["Saturday 10 AM - 1 PM", "Sunday 2 PM - 5 PM"],
    maxParticipants: 6
  },
  {
    id: 2,
    title: "Hand-Building Techniques",
    category: "Intermediate",
    duration: "4 hours",
    price: "₹4,200",
    image: workshopImg,
    description: "Explore coil, slab, and pinch techniques to create unique sculptural forms and functional pieces.",
    includes: ["Premium clay", "Take home 3-4 pieces", "Tea & lunch", "Tool kit usage"],
    level: "Some Experience Required",
    schedule: ["Saturday 10 AM - 2 PM", "Sunday 10 AM - 2 PM"],
    maxParticipants: 8
  },
  {
    id: 3,
    title: "Glazing Masterclass",
    category: "Advanced",
    duration: "2 hours",
    price: "₹2,800",
    image: workshopImg,
    description: "Learn the art of mixing and applying beautiful glazes. Understand glaze chemistry and color theory.",
    includes: ["Glaze samples", "Recipe booklet", "Finished pieces", "Tea service"],
    level: "Advanced",
    schedule: ["Friday 4 PM - 6 PM", "Saturday 4 PM - 6 PM"],
    maxParticipants: 5
  },
  {
    id: 4,
    title: "Mindful Pottery Session",
    category: "Beginner",
    duration: "2.5 hours",
    price: "₹3,000",
    image: workshopImg,
    description: "A meditative experience combining basic pottery with mindfulness practices. Perfect for stress relief.",
    includes: ["Guided meditation", "Clay work", "Take home 1-2 pieces", "Herbal tea"],
    level: "No Experience Needed",
    schedule: ["Tuesday 6 PM - 8:30 PM", "Thursday 6 PM - 8:30 PM"],
    maxParticipants: 6
  },
  {
    id: 5,
    title: "Japanese Tea Ceremony Bowls",
    category: "Intermediate",
    duration: "5 hours",
    price: "₹5,500",
    image: workshopImg,
    description: "Create your own chawan (tea bowl) inspired by traditional Japanese aesthetics and wabi-sabi philosophy.",
    includes: ["Premium materials", "Cultural insights", "Tea ceremony demo", "Take home bowl"],
    level: "Intermediate",
    schedule: ["Sunday 10 AM - 3 PM (includes lunch)"],
    maxParticipants: 4
  },
  {
    id: 6,
    title: "Family Pottery Workshop",
    category: "Beginner",
    duration: "3 hours",
    price: "₹6,000",
    image: workshopImg,
    description: "A fun family session where everyone creates together. Perfect for ages 8 and up.",
    includes: ["For 2-4 people", "All materials", "Family keepsakes", "Refreshments"],
    level: "All Ages Welcome",
    schedule: ["Sunday 11 AM - 2 PM", "Sunday 3 PM - 6 PM"],
    maxParticipants: 4
  }
];

export default workshopsData;