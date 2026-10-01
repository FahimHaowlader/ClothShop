import Hero from "../components/Hero";
import Collection from "../components/Collection";
import FeaturedProduct from "../components/FeaturedProduct";
import FeaturedProductSkeleton from "../components/FeatureProductSkeleton";

const CheckOut = () => {
  return (
    <div>
      <Hero />
      <FeaturedProduct />
      <Collection />
      <FeaturedProductSkeleton />
    </div>
  );
};

export default CheckOut;