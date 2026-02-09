// BannerCarousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; // Import Slick styles
import "slick-carousel/slick/slick-theme.css";


const banners = [
  "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/1558a721300c7f6d.jpg?q=60",
  "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/5b309e98775e22e4.jpg?q=60",
  "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/d948fb591b3f460e.jpeg?q=60",
  "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/e69c29d7b04e2c31.png?q=60"
];

const BannerCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <div className="banner-carousel">
      <Slider {...settings}>
        {banners.map((url, index) => (
          <div className="banner-slide" key={index}>
            <img src={url} alt={`banner-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;
