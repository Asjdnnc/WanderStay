//data of the website stored in the array as an object(key-value pair)
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sampleListings = [
    {
      title: "Cozy Beachfront Cottage",
      description:
        "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
      image:{
        filename:"listingimage",
        url:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 1500,
      location: "Malibu",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [118.6923, 34.0381],
    },
    categories: ["Mountains","Amazing pools","Boat"],
    },
    {
      title: "Modern Loft in Downtown",
      description:
        "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
      image:{
        filename:"listingimage",
        url:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 1200,
      location: "New York City",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [74.0060, 40.7128],
    },
    categories: ["Mountains","Camping","Boat"],
    },
    {
      title: "Mountain Retreat",
      description:
        "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
      image:{
        filename:"listingimage",
        url:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 1000,
      location: "Aspen",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [106.8175, 39.1911],
    },
    categories: ["Amazing pools","Castles","Iconic Cities"],
    },
    {
      title: "Historic Villa in Tuscany",
      description:
        "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
      image:{
      filename:"listingimage",
      url:"https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 2500,
      location: "Florence",
      country: "Italy",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [11.2577, 43.7700],
    },
    categories: ["Amazing pools","Castles","Iconic Cities","Farms"],
    },
    {
      title: "Secluded Treehouse Getaway",
      description:
        "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
      image:
      {filename:"listingimage",
        url:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 800,
      location: "Portland",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [122.6784, 45.5152],
    },
    categories: ["Amazing pools","Castles","Farms","Boat","Dome"],
    },
    {
      title: "Beachfront Paradise",
      description:
        "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
      image:{
        filename:"listingimage",
        url : "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 2000,
      location: "Cancun",
      country: "Mexico",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [102.5528, 23.6345],
    },
    categories: ["Amazing pools","Farms","Boat"],
    },
    {
      title: "Rustic Cabin by the Lake",
      description:
        "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 900,
      location: "Lake Tahoe",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [120.0324,39.0968],
    },
    categories: ["Camping","Castles","Farms","Dome"],
    },
    {
      title: "Luxury Penthouse with City Views",
      description:
        "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 3500,
      location: "Los Angeles",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [118.2426, 34.0549],
    },
    categories: ["Amazing pools","Castles","Boat"],
    },
    {
      title: "Ski-In/Ski-Out Chalet",
      description:
        "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 3000,
      location: "Verbier",
      country: "Switzerland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [ 7.2286,46.0961],
    },
    categories: ["Amazing pools","Boat"],
    },
    {
      title: "Safari Lodge in the Serengeti",
      description:
        "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 4000,
      location: "Serengeti National Park",
      country: "Tanzania",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [34.8888, 6.3690],
    },
    categories: ["Castles","Farms","Arctic","Dome"],
    },
    {
      title: "Historic Canal House",
      description:
        "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
      image:{filename:"listingimage",
      url:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
      price: 1800,
      location: "Amsterdam",
      country: "Netherlands",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [4.9041, 52.3676],
    },
    categories: ["Camping","Castles","Dome","Arctic","Farms"],
    },
    {
      title: "Private Island Retreat",
      description:
        "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 10000,
      location: "Fiji",
      country: "Fiji",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [ 178.0650, 17.7134],
    },
    categories: ["Castles","Farms"],
    },
    {
      title: "Charming Cottage in the Cotswolds",
      description:
        "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 1200,
      location: "Cotswolds",
      country: "United Kingdom",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [1.9586, 51.7904],
    },
    categories: ["Amazing pools","Boat"],
    },
    {
      title: "Historic Brownstone in Boston",
      description:
        "Step back in time in this elegant historic brownstone located in the heart of Boston.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 2200,
      location: "Boston",
      country: "United States",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [71.0589, 42.3601],
      },
      categories: ["Boat","Castles","Farms"],
    },
    {
      title: "Beachfront Bungalow in Bali",
      description:
        "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
      image:{filename:"listingimage",
        url:"https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      },
      price: 1800,
      location: "Bali",
      country: "Indonesia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
    geometry: {
      type: "Point",
      coordinates: [115.1889, 8.4095],
    },
    categories: ["Camping","Dome","Castles","Farms"],
    },
    {
      title: "Eiffel Tower View Apartment",
      description: "Enjoy breathtaking views of the Eiffel Tower from this romantic apartment in Paris.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 766,
      location: "Paris",
      country: "France",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [2.3522, 48.8566],
      },
      categories: ["Iconic Cities","Amazing pools"],
    },
    {
      title: "Traditional Ryokan in Kyoto",
      description: "Experience Japanese culture in this traditional ryokan with a beautiful zen garden.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 2848,
      location: "Kyoto",
      country: "Japan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [135.7681, 35.0116],
      },
      categories: ["Iconic Cities","Mountains"],
    },
    {
      title: "Sydney Harbour Penthouse",
      description: "Luxurious penthouse overlooking the iconic Sydney Opera House and Harbour Bridge.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 4284,
      location: "Sydney",
      country: "Australia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [151.2093, -33.8688],
      },
      categories: ["Iconic Cities","Boat"],
    },
    {
      title: "Copacabana Beachfront Condo",
      description: "Vibrant beachfront condo right on the famous Copacabana beach in Rio.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 1082,
      location: "Rio de Janeiro",
      country: "Brazil",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-43.1729, -22.9068],
      },
      categories: ["Amazing pools"],
    },
    {
      title: "Banff Log Cabin",
      description: "Cozy log cabin nestled in the heart of the Canadian Rockies. Perfect for winter sports.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3801,
      location: "Banff",
      country: "Canada",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-115.5708, 51.1784],
      },
      categories: ["Mountains","Arctic","Dome"],
    },
    {
      title: "Barcelona Gothic Quarter Flat",
      description: "Historic flat in the center of Barcelona's charming Gothic Quarter.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 2268,
      location: "Barcelona",
      country: "Spain",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [2.1686, 41.3874],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Santorini Cliffside Villa",
      description: "Stunning white-washed villa with a private infinity pool overlooking the Aegean Sea.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 2677,
      location: "Santorini",
      country: "Greece",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [25.4615, 36.3932],
      },
      categories: ["Amazing pools","Iconic Cities"],
    },
    {
      title: "Cape Town Coastal Retreat",
      description: "Modern coastal retreat with majestic views of Table Mountain.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3347,
      location: "Cape Town",
      country: "South Africa",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [18.4232, -33.9249],
      },
      categories: ["Mountains","Amazing pools"],
    },
    {
      title: "Phuket Private Pool Villa",
      description: "Tropical paradise villa with a private pool and direct beach access.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 2618,
      location: "Phuket",
      country: "Thailand",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [98.3923, 7.9519],
      },
      categories: ["Amazing pools","Boat"],
    },
    {
      title: "Queenstown Lakeside Lodge",
      description: "Luxurious lodge on the shores of Lake Wakatipu with mountain views.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 2594,
      location: "Queenstown",
      country: "New Zealand",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [168.6626, -45.0312],
      },
      categories: ["Mountains","Boat"],
    },
    {
      title: "Taj Mahal View Haveli",
      description: "Heritage haveli offering spectacular views of the Taj Mahal.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 4242,
      location: "Agra",
      country: "India",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [78.0081, 27.1767],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Cairo Nile Cruise Boat",
      description: "Experience Egypt on a luxurious boat cruising down the historic Nile River.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 670,
      location: "Cairo",
      country: "Egypt",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [31.2357, 30.0444],
      },
      categories: ["Boat","Iconic Cities"],
    },
    {
      title: "Cappadocia Cave Hotel",
      description: "A unique stay in a luxurious cave hotel with views of hot air balloons.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1260,
      location: "Cappadocia",
      country: "Turkey",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [34.8298, 38.6431],
      },
      categories: ["Dome","Mountains"],
    },
    {
      title: "Berlin Mitte Loft",
      description: "Spacious and modern loft in the trendy Mitte district of Berlin.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 3862,
      location: "Berlin",
      country: "Germany",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [13.405, 52.52],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Buenos Aires Tango Apartment",
      description: "Charming apartment in San Telmo, the heart of tango culture in Argentina.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1123,
      location: "Buenos Aires",
      country: "Argentina",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-58.3816, -34.6037],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Cusco Historic Hacienda",
      description: "Beautiful hacienda located in the ancient Inca capital with stunning mountain views.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 2113,
      location: "Cusco",
      country: "Peru",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-71.9675, -13.532],
      },
      categories: ["Mountains","Farms"],
    },
    {
      title: "Patagonia Wilderness Cabin",
      description: "Remote cabin perfect for exploring the rugged beauty of Chilean Patagonia.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1742,
      location: "Torres del Paine",
      country: "Chile",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-73.0811, -50.9423],
      },
      categories: ["Mountains","Camping"],
    },
    {
      title: "Medellin High-Rise",
      description: "Modern apartment with panoramic views of the Aburrá Valley.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 761,
      location: "Medellin",
      country: "Colombia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-75.5658, 6.2442],
      },
      categories: ["Iconic Cities","Amazing pools"],
    },
    {
      title: "Halong Bay Junk Boat",
      description: "Sail through the emerald waters of Halong Bay on a traditional junk boat.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 3659,
      location: "Halong Bay",
      country: "Vietnam",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [107.0804, 20.9101],
      },
      categories: ["Boat"],
    },
    {
      title: "Seoul Hanok Guesthouse",
      description: "Traditional Korean hanok offering a peaceful retreat in the bustling city.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 874,
      location: "Seoul",
      country: "South Korea",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [126.978, 37.5665],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Marrakech Medina Riad",
      description: "Gorgeous, colorful riad located in the heart of the historic Marrakech Medina.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3957,
      location: "Marrakech",
      country: "Morocco",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-7.9811, 31.6295],
      },
      categories: ["Iconic Cities","Amazing pools"],
    },
    {
      title: "Lisbon Alfama Apartment",
      description: "Cozy apartment with azulejo tiles in Lisbon's oldest neighborhood.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 4005,
      location: "Lisbon",
      country: "Portugal",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-9.1393, 38.7223],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Dublin Georgian Townhouse",
      description: "Elegant Georgian townhouse near St. Stephen's Green.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 2711,
      location: "Dublin",
      country: "Ireland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-6.2603, 53.3498],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Edinburgh Castle View",
      description: "Apartment offering uninterrupted views of the historic Edinburgh Castle.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 693,
      location: "Edinburgh",
      country: "Scotland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-3.1883, 55.9533],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Tromsø Aurora Cabin",
      description: "Isolated cabin perfect for viewing the majestic Northern Lights.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 1857,
      location: "Tromsø",
      country: "Norway",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [18.9553, 69.6492],
      },
      categories: ["Arctic","Dome"],
    },
    {
      title: "Stockholm Archipelago Cottage",
      description: "Charming red cottage on a remote island in the Stockholm archipelago.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 4360,
      location: "Stockholm",
      country: "Sweden",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [18.0686, 59.3293],
      },
      categories: ["Boat","Amazing pools"],
    },
    {
      title: "Helsinki Design Loft",
      description: "Minimalist and stylish loft in the design district of Helsinki.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1506,
      location: "Helsinki",
      country: "Finland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [24.9384, 60.1695],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Copenhagen Nyhavn Studio",
      description: "Cozy studio overlooking the colorful boats of Nyhavn.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 4175,
      location: "Copenhagen",
      country: "Denmark",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [12.5683, 55.6761],
      },
      categories: ["Boat","Iconic Cities"],
    },
    {
      title: "Reykjavik Geothermal Villa",
      description: "Modern villa featuring a naturally heated outdoor geothermal pool.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 1242,
      location: "Reykjavik",
      country: "Iceland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-21.9426, 64.1466],
      },
      categories: ["Amazing pools","Arctic"],
    },
    {
      title: "Arenal Volcano Eco-Lodge",
      description: "Sustainable treehouse lodge in the shadow of the Arenal Volcano.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1539,
      location: "La Fortuna",
      country: "Costa Rica",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-84.6453, 10.4632],
      },
      categories: ["Camping","Mountains"],
    },
    {
      title: "Panama City Casco Viejo",
      description: "Restored colonial apartment in the vibrant Casco Viejo district.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 4177,
      location: "Panama City",
      country: "Panama",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-79.5199, 8.9824],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Dubrovnik Old Town Home",
      description: "Stone house within the ancient walled city of Dubrovnik.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 621,
      location: "Dubrovnik",
      country: "Croatia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [18.0944, 42.6507],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Vienna Imperial Suite",
      description: "Luxurious suite featuring classic Viennese architecture and high ceilings.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 3913,
      location: "Vienna",
      country: "Austria",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [16.3738, 48.2082],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Zurich Lakefront Mansion",
      description: "Exclusive mansion with a private dock on Lake Zurich.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 702,
      location: "Zurich",
      country: "Switzerland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [8.5417, 47.3769],
      },
      categories: ["Boat","Amazing pools"],
    },
    {
      title: "Brussels Grand Place Flat",
      description: "Steps away from the stunning Grand Place, a chocolate-lover's dream.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1395,
      location: "Brussels",
      country: "Belgium",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [4.3517, 50.8503],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Krakow Market Square Apartment",
      description: "Overlook the historic Cloth Hall from this beautiful old-town apartment.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1407,
      location: "Krakow",
      country: "Poland",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [19.9449, 50.0647],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Prague Castle View Room",
      description: "Romantic room with views across the Charles Bridge to Prague Castle.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 2946,
      location: "Prague",
      country: "Czech Republic",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [14.4378, 50.0755],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Budapest Danube Balcony",
      description: "Apartment with a balcony offering sweeping views of the Danube River.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3089,
      location: "Budapest",
      country: "Hungary",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [19.0402, 47.4979],
      },
      categories: ["Iconic Cities","Boat"],
    },
    {
      title: "Transylvania Dracula's Retreat",
      description: "A medieval-style stay near the famous Bran Castle.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 1717,
      location: "Brasov",
      country: "Romania",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [25.6012, 45.6427],
      },
      categories: ["Castles","Mountains"],
    },
    {
      title: "Maasai Mara Safari Tent",
      description: "Luxury glamping tent in the heart of the African savanna.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 2468,
      location: "Maasai Mara",
      country: "Kenya",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [35.1474, -1.3733],
      },
      categories: ["Camping","Farms"],
    },
    {
      title: "Madagascar Baobab Bungalow",
      description: "Eco-bungalow near the famous Avenue of the Baobabs.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1056,
      location: "Morondava",
      country: "Madagascar",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [44.2806, -20.2833],
      },
      categories: ["Camping","Farms"],
    },
    {
      title: "Maldives Overwater Villa",
      description: "Experience ultimate luxury in an overwater villa with crystal-clear lagoon access.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3531,
      location: "Male",
      country: "Maldives",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [73.5093, 4.1755],
      },
      categories: ["Amazing pools","Boat"],
    },
    {
      title: "Seychelles Jungle Retreat",
      description: "Secluded villa surrounded by pristine jungle and granitic boulders.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1589,
      location: "Mahe",
      country: "Seychelles",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [55.4915, -4.6796],
      },
      categories: ["Amazing pools"],
    },
    {
      title: "Dubai Palm Jumeirah Villa",
      description: "Ultra-modern villa on the iconic man-made Palm Jumeirah island.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 3380,
      location: "Dubai",
      country: "United Arab Emirates",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [55.2708, 25.2048],
      },
      categories: ["Amazing pools","Iconic Cities"],
    },
    {
      title: "Singapore Marina Bay Suite",
      description: "High-tech luxury suite overlooking Marina Bay Sands and Gardens by the Bay.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 2270,
      location: "Singapore",
      country: "Singapore",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [103.8198, 1.3521],
      },
      categories: ["Iconic Cities","Amazing pools"],
    },
    {
      title: "Kuala Lumpur Twin Towers View",
      description: "Sleek apartment with a direct line of sight to the Petronas Twin Towers.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 541,
      location: "Kuala Lumpur",
      country: "Malaysia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [101.6869, 3.139],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Palawan Secret Lagoon Cottage",
      description: "Remote and rustic cottage hidden beside a crystal-clear lagoon.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 3661,
      location: "El Nido",
      country: "Philippines",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [119.4311, 11.1793],
      },
      categories: ["Boat","Amazing pools"],
    },
    {
      title: "Ubud Rice Terrace Hut",
      description: "Peaceful bamboo hut set amidst lush, green cascading rice terraces.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 3276,
      location: "Ubud",
      country: "Indonesia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [115.269, -8.5069],
      },
      categories: ["Farms","Dome"],
    },
    {
      title: "Mexico City Polanco Penthouse",
      description: "Chic and modern penthouse in the upscale Polanco neighborhood.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      price: 4262,
      location: "Mexico City",
      country: "Mexico",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-99.1332, 19.4326],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Montego Bay Beachhouse",
      description: "Step straight onto the white sand from this breezy Caribbean beachhouse.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
      },
      price: 1770,
      location: "Montego Bay",
      country: "Jamaica",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-77.9152, 18.4714],
      },
      categories: ["Amazing pools","Boat"],
    }
,
    {
      title: "Taipei 101 View",
      description: "Modern apartment right next to the iconic Taipei 101 tower.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3720,
      location: "Taipei",
      country: "Taiwan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [121.5654, 25.033],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Intramuros Historic Suite",
      description: "Experience the deep history of Manila in this colonial-period suite.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3681,
      location: "Manila",
      country: "Philippines",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [120.976, 14.5896],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Old Quarter Boutique",
      description: "Lovely boutique stay tucked away in Hanoi's bustling streets.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 859,
      location: "Hanoi",
      country: "Vietnam",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [105.8502, 21.0333],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Mekong River Guesthouse",
      description: "Peaceful guesthouse offering sunset views over the Mekong river.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1471,
      location: "Vientiane",
      country: "Laos",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [102.6, 17.9667],
      },
      categories: ["Boat","Amazing pools"],
    },
    {
      title: "Royal Palace Flat",
      description: "Beautifully styled flat located near the breathtaking Royal Palace of Cambodia.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1725,
      location: "Phnom Penh",
      country: "Cambodia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [104.9315, 11.5404],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Shwedagon Pagoda View",
      description: "Spacious apartment providing an unhindered view of the golden Shwedagon Pagoda.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1303,
      location: "Yangon",
      country: "Myanmar",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [96.149, 16.7983],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Galle Face Ocean View",
      description: "Feel the ocean breeze directly from this lovely seaside accommodation.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1125,
      location: "Colombo",
      country: "Sri Lanka",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [79.845, 6.9248],
      },
      categories: ["Amazing pools"],
    },
    {
      title: "Thamel Sanctuary",
      description: "Quiet and peaceful sanctuary hidden in the heart of bustling Kathmandu.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3774,
      location: "Kathmandu",
      country: "Nepal",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [85.3117, 27.7153],
      },
      categories: ["Mountains","Iconic Cities"],
    },
    {
      title: "Himalayan Lodge",
      description: "Warm and cozy lodge offering sweeping views of the mighty Himalayas.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2271,
      location: "Thimphu",
      country: "Bhutan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [89.6419, 27.4728],
      },
      categories: ["Mountains","Dome"],
    },
    {
      title: "Gulshan Apartment",
      description: "Luxurious apartment in the upscale diplomatic enclave.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 726,
      location: "Dhaka",
      country: "Bangladesh",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [90.4125, 23.8103],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Margalla Hills Retreat",
      description: "Serene retreat situated right at the foothills of the Margalla hills.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2391,
      location: "Islamabad",
      country: "Pakistan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [73.0479, 33.6844],
      },
      categories: ["Mountains","Camping"],
    },
    {
      title: "Golestan Palace Vicinity",
      description: "Traditional architectural marvel near Tehran's grand palace.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3205,
      location: "Tehran",
      country: "Iran",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [51.389, 35.6892],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Tigris River View",
      description: "Enjoy historic views of the Tigris river right from your private balcony.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3326,
      location: "Baghdad",
      country: "Iraq",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [44.3615, 33.3152],
      },
      categories: ["Iconic Cities","Boat"],
    },
    {
      title: "Kingdom Centre Luxury Suite",
      description: "Ultra-luxurious suite in the very heart of the business district.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 502,
      location: "Riyadh",
      country: "Saudi Arabia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [46.7167, 24.7136],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Mutrah Corniche Stay",
      description: "Overlook the Gulf of Oman and the active souq from this waterfront stay.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 593,
      location: "Muscat",
      country: "Oman",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [58.5683, 23.619],
      },
      categories: ["Boat","Amazing pools"],
    },
    {
      title: "The Pearl Qatar Villa",
      description: "Exclusive villa located on an artificial island boasting immaculate beaches.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1282,
      location: "Doha",
      country: "Qatar",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [51.5458, 25.3675],
      },
      categories: ["Amazing pools","Iconic Cities"],
    },
    {
      title: "Bahrain Bay Apartment",
      description: "A highly modern apartment presenting a stunning skyline view of Manama.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1742,
      location: "Manama",
      country: "Bahrain",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [50.5898, 26.2415],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Kuwait Towers Studio",
      description: "Sleek and minimalist studio beside the famous landmark Kuwait Towers.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1840,
      location: "Kuwait City",
      country: "Kuwait",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [47.9774, 29.3759],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Citadel View Home",
      description: "Rustic but cozy home with clear perspectives of the ancient Citadel.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2078,
      location: "Amman",
      country: "Jordan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [35.9284, 31.9454],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Raouche Rocks Apartment",
      description: "Breath-taking vistas of the Pigeon Rocks right from your own living room.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3627,
      location: "Beirut",
      country: "Lebanon",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [35.4746, 33.8899],
      },
      categories: ["Amazing pools","Iconic Cities"],
    },
    {
      title: "Old City Traditional Home",
      description: "Experience the blend of history and culture within Jerusalem's ancient walls.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1336,
      location: "Jerusalem",
      country: "Israel",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [35.2137, 31.7683],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Anitkabir View Flat",
      description: "A beautifully appointed flat located closely near the grand mausoleum.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1966,
      location: "Ankara",
      country: "Turkey",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [32.8597, 39.9334],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Ledra Street Boutique",
      description: "Chic boutique accommodation nestled in the historic part of Nicosia.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 4438,
      location: "Nicosia",
      country: "Cyprus",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [33.3606, 35.1856],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Acropolis View Penthouse",
      description: "Magnificent terrace penthouse overseeing the mighty Acropolis of Athens.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 789,
      location: "Athens",
      country: "Greece",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [23.7275, 37.9838],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Skanderbeg Square Apartment",
      description: "Located directly in the cultural epicenter of Tirana with expansive square views.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1641,
      location: "Tirana",
      country: "Albania",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [19.8187, 41.3275],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Vitosha Mountain Retreat",
      description: "Escape into the lush Vitosha mountain just a short commute from Sofia.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1415,
      location: "Sofia",
      country: "Bulgaria",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [23.3219, 42.6977],
      },
      categories: ["Mountains","Camping"],
    },
    {
      title: "Bucharest Old Town Studio",
      description: "Lively studio amidst the busy old town district of Bucharest.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3881,
      location: "Bucharest",
      country: "Romania",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [26.1025, 44.4268],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Kalemegdan Fortress Flat",
      description: "Inviting flat near the historic and vastly sprawling Kalemegdan park.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3925,
      location: "Belgrade",
      country: "Serbia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [20.4489, 44.8125],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Bascarsija Traditional House",
      description: "A truly authentic Bosnian home placed in the heart of original Sarajevo.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 838,
      location: "Sarajevo",
      country: "Bosnia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [18.4131, 43.8563],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Upper Town Historic Stay",
      description: "Historical and quaint stay in Zagreb's most famous and oldest district.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2458,
      location: "Zagreb",
      country: "Croatia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [15.978, 45.815],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Ljubljanica River Apartment",
      description: "Soothing apartment lying right alongside the iconic emerald river.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 510,
      location: "Ljubljana",
      country: "Slovenia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [14.5058, 46.0569],
      },
      categories: ["Boat","Iconic Cities"],
    },
    {
      title: "Bratislava Castle View",
      description: "Delightful view of the signature white castle from your bedroom window.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2775,
      location: "Bratislava",
      country: "Slovakia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [17.1077, 48.1486],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Alpine Lodge Vaduz",
      description: "Pristine alpine lodge offering fresh mountain air and remarkable scenery.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 4069,
      location: "Vaduz",
      country: "Liechtenstein",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [9.5215, 47.141],
      },
      categories: ["Mountains","Dome"],
    },
    {
      title: "Monte Carlo Sea View",
      description: "Glitzy Monaco flat featuring unbelievable yachts and ocean views.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1806,
      location: "Monaco",
      country: "Monaco",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [7.4246, 43.7384],
      },
      categories: ["Amazing pools","Iconic Cities"],
    },
    {
      title: "Pyrenees Ski Chalet",
      description: "Luxurious ski chalet providing ultimate resort relaxation nestled away.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2056,
      location: "Andorra la Vella",
      country: "Andorra",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [1.5218, 42.5063],
      },
      categories: ["Mountains","Arctic"],
    },
    {
      title: "Mount Titano Villa",
      description: "Rustic villa perched dramatically on the slopes of Mount Titano.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1637,
      location: "San Marino",
      country: "San Marino",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [12.4578, 43.9424],
      },
      categories: ["Mountains","Castles"],
    },
    {
      title: "Grand Harbour Suite",
      description: "Suite facing entirely towards the massive and historic Grand Harbour.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 530,
      location: "Valletta",
      country: "Malta",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [14.5146, 35.8989],
      },
      categories: ["Boat","Iconic Cities"],
    },
    {
      title: "Ville Haute Apartment",
      description: "Sophisticated apartment perched in the high historic quarters.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1624,
      location: "Luxembourg City",
      country: "Luxembourg",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [6.1296, 49.6116],
      },
      categories: ["Iconic Cities","Castles"],
    },
    {
      title: "Toompea Hill Studio",
      description: "Charming studio enclosed by mediaeval stone towers and cobblestone streets.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 908,
      location: "Tallinn",
      country: "Estonia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [24.7536, 59.437],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Art Nouveau District Flat",
      description: "Spacious flat immersed in one of the most stunning Art Nouveau regions globally.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2662,
      location: "Riga",
      country: "Latvia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [24.1052, 56.9496],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Uzupis Artist Studio",
      description: "Quirky artistic studio situated in the creative republic of Uzupis.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1617,
      location: "Vilnius",
      country: "Lithuania",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [25.2798, 54.6872],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Independence Square Flat",
      description: "Spacious layout with a direct view over the expansive Independence Square.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3275,
      location: "Minsk",
      country: "Belarus",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [27.5615, 53.9006],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Maidan Nezalezhnosti Apartment",
      description: "Comfortable stay right in the thriving core of the Ukrainian capital.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1605,
      location: "Kyiv",
      country: "Ukraine",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [30.5234, 50.4501],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Old Tbilisi Balcony",
      description: "Traditionally carved wooden balcony overlooking bathhouses and ancient churches.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3887,
      location: "Tbilisi",
      country: "Georgia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [44.8271, 41.7151],
      },
      categories: ["Castles","Iconic Cities"],
    },
    {
      title: "Cascade Complex View",
      description: "Fantastic panorama overlooking the massive limestone staircase of Yerevan.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3567,
      location: "Yerevan",
      country: "Armenia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [44.5136, 40.1872],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Flame Towers Suite",
      description: "Lavish and ultra-modern suite looking out to the spectacular Flame Towers.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1914,
      location: "Baku",
      country: "Azerbaijan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [49.8671, 40.4093],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Chorsu Bazaar Vicinity",
      description: "Deep cultural immersion right adjacent to the grand bazaar of Tashkent.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 522,
      location: "Tashkent",
      country: "Uzbekistan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [69.2401, 41.2995],
      },
      categories: ["Iconic Cities","Farms"],
    },
    {
      title: "Baiterek Tower View",
      description: "High-level apartment positioned with a direct spectacle of the Baiterek Tower.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1330,
      location: "Astana",
      country: "Kazakhstan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [71.4278, 51.1694],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Ala-Too Square Apartment",
      description: "Central apartment overlooking the heart of the capital and snowy summits.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3460,
      location: "Bishkek",
      country: "Kyrgyzstan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [74.59, 42.8746],
      },
      categories: ["Mountains","Iconic Cities"],
    },
    {
      title: "Rudaki Park Home",
      description: "A quiet and calm domestic stay placed alongside the grand Rudaki Park.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 4091,
      location: "Dushanbe",
      country: "Tajikistan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [68.7844, 38.5598],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Marble City Suite",
      description: "A pure white architectural dream-like suite located in Ashgabat.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2247,
      location: "Ashgabat",
      country: "Turkmenistan",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [58.3794, 37.95],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Genghis Khan Square Flat",
      description: "Convenient flat steps away from Ulaanbaatar's vast and bustling square.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2364,
      location: "Ulaanbaatar",
      country: "Mongolia",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [106.9177, 47.92],
      },
      categories: ["Iconic Cities"],
    },
    {
      title: "Old Havana Casa Particular",
      description: "Brightly colored Cuban colonial home radiating music and energy.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 3279,
      location: "Havana",
      country: "Cuba",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-82.3666, 23.1136],
      },
      categories: ["Iconic Cities","Amazing pools"],
    },
    {
      title: "Old San Juan Colonial House",
      description: "A beautifully conserved colonial estate near the historic forts.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 2942,
      location: "San Juan",
      country: "Puerto Rico",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-66.1167, 18.4655],
      },
      categories: ["Castles","Amazing pools"],
    },
    {
      title: "Paradise Island Beachhouse",
      description: "The literal definition of tropical paradise offering unparalleled luxury.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      },
      price: 1387,
      location: "Nassau",
      country: "Bahamas",
      owner: new ObjectId("6674e4f1fa4549530a19acd8"),
      geometry: {
        type: "Point",
        coordinates: [-77.3411, 25.0818],
      },
      categories: ["Amazing pools","Boat"],
    }
  ];
  
  module.exports = { data: sampleListings };