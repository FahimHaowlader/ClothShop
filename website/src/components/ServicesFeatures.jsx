import React from "react";
import {
  Truck,
  Headphones,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const ServiceFeatures = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Carefully selected fabrics",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Across Bangladesh",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "Safe & secure checkout",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "We're always here to help",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="
                group
                px-5
                py-5
                sm:py-7
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  w-[210px]
                  items-center
                  gap-4
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-black/[0.035]
                    transition-all
                    duration-500
                    ease-out
                    group-hover:bg-black
                    group-hover:text-white
                  "
                >
                  <Icon
                    size={19}
                    strokeWidth={1.4}
                    className="
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Text */}
                <div
                  className="
                    min-w-0
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:translate-x-1
                  "
                >
                  <h3
                    className="
                      whitespace-nowrap
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-1
                      whitespace-nowrap
                      text-[11px]
                      leading-4
                      text-black/45
                      transition-colors
                      duration-500
                      group-hover:text-black/60
                    "
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceFeatures;