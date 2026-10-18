import Hero from "../components/Hero";
import Collection from "../components/Collection";
import FeaturedProduct from "../components/FeaturedProduct";
import FeaturedProductSkeleton from "../components/FeatureProductSkeleton";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";



import image1 from "../assets/images.webp";
import image2 from "../assets/images2.webp";
import ServiceFeatures from "../components/ServicesFeatures";
import SocialShowcase from "../components/SocialShowCase";
import BrandStory from "../components/BrandStory";
import ProductBasic from "../components/ProductBasic";



const products = [
  {
    id: 1,
    name: "Essential Western Shirt",
    price: 126,
    oldPrice: 148,          // optional: shows struck-through price and -% pill
    soldOut: false,         
    variants: [
      { name: "Olive",  image: image1 },
      { name: "Black",  image: image2 },
      { name: "Purple", image: image1 },
    ],
  },
  {
    id: 2,
    name: "Relaxed Hoodie",
    price: 89,
    image: image2,          // no variants: uses a single image instead
    soldOut: false,
  },
  {
    id: 3,
    name: "Limited Edition Jacket",
    price: 210,
    soldOut: true,          // sold out case: greys out / overlays the sold out badge
    image: image1,          // works with single image or variants
  },
];

// const products = [
//   {
//     id: 1,
//     name: "Levi's Essential Western Denim Shirt",
//     price: 126,
//     oldPrice: 160,
//     soldOut: false,

//     variants: [
//       {
//         name: "Brown",
//         image: image1,
//       },
//       {
//         name: "Black",
//         image: image2,
//       },
//       {
//         name: "Red",
//         image: image1,
//       },
//       {
//         name: "White",
//         image: image2,
//       },
//     ],
//   },

//   {
//     id: 2,
//     name: "Classic Relaxed Fit Denim Jacket",
//     price: 145,
//     oldPrice: 180,
//     soldOut: true,

//     variants: [
//       {
//         name: "Blue",
//         image: image1,
//       },
//       {
//         name: "Black",
//         image: image2,
//       },
//       {
//         name: "Grey",
//         image: image1,
//       },
//     ],
//   },
// ];

const CheckOut = () => {
  return (
    <div>
      <Hero />
      <FeaturedProduct />
          <ProductBasic />

      <Collection />
      <FeaturedProductSkeleton />
       <div
      className=" p-4 md:py-20 md:px-20
        grid
        grid-cols-2
        gap-x-3
        gap-y-10
        sm:gap-x-5
        md:grid-cols-3
        lg:grid-cols-4
        lg:gap-x-6
        lg:gap-y-12
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}

      <ProductCardSkeleton />
    
    </div>

    <ServiceFeatures />
    <SocialShowcase />
    <div className=" py-20">

    <BrandStory />
    </div>
      
    </div>
  );
};

export default CheckOut;