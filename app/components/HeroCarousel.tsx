"use client";

import heroImages from "@/static/heroCarousel";
import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <Image
            src={image.url}
            alt={image.alt}
            width={484}
            height={484}
            key={image.alt}
            className="object-contain"
          />
        ))}
      </Carousel>
      <Image 
        src="assets/icons/hand-drawn-arrow.svg" 
        width={175}
        height={175}
        alt="arrow"
        className="absolute -left-[15%] bottom-[5%] max-xl:hidden"
      />
    </div>
  );
};

export default HeroCarousel;
