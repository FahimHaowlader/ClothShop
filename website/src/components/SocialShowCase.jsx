import React from "react";

import { FaFacebookF, FaYoutube } from "react-icons/fa";
import {Link } from "react-router";

const SocialShowcase = () => {
  const socials = [
    {
      icon: FaFacebookF,
      platform: "Facebook",
      title: "Follow Our Journey",
      description:
        "Discover new drops, styling ideas & daily updates.",
      action: "Visit Facebook",
      path: "#",
    },
    {
      icon: FaYoutube,
      platform: "YouTube",
      title: "Watch Our Stories",
      description:
        "Explore collections, styling guides & behind the scenes.",
      action: "Watch on YouTube",
      path: "#",
    },
  ];

  return (
    <section className="w-full px-5 py-16 sm:px-8 md:py-20 lg:px-12">
      <div className="">

        {/* Heading */}
       <div className="mb-6 flex items-end justify-between">
  <div>
    <div className="mb-2 flex items-center gap-2.5">
      <span className="h-px w-8 bg-black" />

      <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45 sm:text-[12px]">
        Stay Connected
      </span>
    </div>

    <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
      Follow Our World
    </h2>
  </div>

  <p className="hidden text-right text-[14px] leading-5 text-black/40 sm:text-base md:block">
    Follow us for new collections, styling inspiration
    <br />
    and everything happening at BachelorShop.
  </p>
</div>

        {/* Social Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.platform}
                to={social.path}
                className="
                  group
                  relative
                  overflow-hidden
                  border-t
                  sm:border-t-0
                
                  
                  border-black
                  px-6
                  py-10
                  sm:px-10
                  sm:py-12
                  md:min-h-[300px]
                  md:px-12
                "
              >
                {/* Hover line */}
                <span
                  className="
                    absolute
                    left-0
                    top-0
                    h-[2px]
                    w-0
                    bg-black
                    transition-all
                    duration-1500
                    ease-out
                    group-hover:w-full
                  "
                />

                {/* Top */}
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-black/10
                      transition-all
                      duration-1000
                      ease-out
                      group-hover:scale-110
                      group-hover:border-black
                    "
                  >
                    <Icon
                      size={18}
                      className="
                        transition-transform
                        duration-1000
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* <ArrowUpRight
                    size={22}
                    strokeWidth={1.2}
                    className="
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  /> */}
                </div>

                {/* Content */}
                <div
                  className="
                    mt-16
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover:translate-x-1
                  "
                >
                  <p
                    className="
                      mb-3
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-black/40
                    "
                  >
                    {social.platform}
                  </p>

                  <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                    {social.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      max-w-sm
                      text-sm
                      leading-6
                      text-black/45
                    "
                  >
                    {social.description}
                  </p>

                  <div
                    className="
                      mt-7
                      inline-flex
                      items-center
                      gap-3
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                    "
                  >
                    {social.action}

                    <span
                      className="
                        block
                        h-px
                        w-6
                        bg-black/40
                        transition-all
                        duration-1500
                        ease-out
                        group-hover:w-12
                      "
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialShowcase;