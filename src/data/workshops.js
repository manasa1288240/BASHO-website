import workshopImg from "../assets/workshop.jpg";
import workshop1 from "../assets/workshops/workshop1.png";
import workshop2 from "../assets/workshops/workshop2.png";
import workshop3 from "../assets/workshops/workshop3.png";
import workshop4 from "../assets/workshops/workshop4.png";

const workshopsData = [
 {
  id: 1,
  title: "Handbuilding Pottery Workshop",
  duration: "2 hours",
  price: "₹3,500",
  image: workshop1,
  description: "craft your own beautiful chip & dip platter.",
  includes: ["Personalised experience",
    "Flexible dates",
    "Beginner friendly",
    "Custom pricing"
  ],
  date: "11 April 2026",
  time: "4:00 PM",
  endTime: "6:00 PM",
  location: "CZERO, VIP Road, Surat",
  maxParticipants: 6,
  bookedSeats: 6 // ❌ FULL
},
{
  id: 2,
  title: "A Handbuilding Matcha Bowl Workshop",
  duration: "2 hours",
  price: "₹1,200",
  image: workshop2,
  description: "...",
  includes: ["Personalised experience",
    "Flexible dates",
    "Beginner friendly",
    "Custom pricing"
  ],
  date: "15 November 2026",
  time: "4:00 PM",
  endTime: "6:00 PM",
  location: "Basho Studio, Silent Zone",
  maxParticipants: 8,
  bookedSeats: 3 // ✅ AVAILABLE
},
{
  id: 3,
  title: "Christmas Workshop",
  duration: "2 hours",
  price: "₹2,000",
  image: workshop3,
  description: "...",
  includes: ["Personalised experience",
    "Flexible dates",
    "Beginner friendly",
    "Custom pricing"
  ],
  date: "13 December 2026",
  time: "4:00 PM",
  endTime: "6:00 PM",
  location: "Trezoro, Piplod",
  maxParticipants: 5,
  bookedSeats: 5 // ❌ FULL
},
{
  id: 4,
  title: "Colors of Women",
  duration: "3 hours",
  price: "₹1,500",
  image: workshop4,
  description: "...",
  includes: ["Personalised experience",
    "Flexible dates",
    "Beginner friendly",
    "Custom pricing"
  ],
  date: "11 January 2026",
  time: "5:00 PM",
  endTime: "7:00 PM",
  location: "Coffee Culture Dumas",
  maxParticipants: 4,
  bookedSeats: 1 // ✅ AVAILABLE
},
  {
  id: 999,
  title: "Custom Pottery Experience",
  duration: "Flexible",
  price: "Custom Pricing",
  image: workshopImg,
  description:
    "One-on-one workshops, pottery dates, or private sessions tailored for you.",
  includes: [
    "Personalised experience",
    "Flexible dates",
    "Beginner friendly",
    "Custom pricing"
  ],
  date: "Flexible",
  time: "Flexible",
  location: "Basho Studio / Partner Locations",
  maxParticipants: 4,
  isCustom: true
  }

];

export default workshopsData;
