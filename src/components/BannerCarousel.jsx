import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banners = [
  {
    id: 1,
    image: "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/1558a721300c7f6d.jpg?q=60",
    title: "Summer Sale",
    subtitle: "Up to 50% Off",
    cta: "Shop Now"
  },
  {
    id: 2,
    image: "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/5b309e98775e22e4.jpg?q=60",
    title: "New Arrivals",
    subtitle: "Latest Collection",
    cta: "Explore"
  },
  {
    id: 3,
    image: "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/d948fb591b3f460e.jpeg?q=60",
    title: "Premium Quality",
    subtitle: "Best Brands",
    cta: "Discover"
  },
  {
    id: 4,
    image: "https://rukminim2.flixcart.com/fk-p-flap/2020/340/image/e69c29d7b04e2c31.png?q=60",
    title: "Fast Delivery",
    subtitle: "Quick Shipping",
    cta: "Order Now"
  }
];

const BannerCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    cssEase: 'ease-in-out',
    customPaging: (i) => (
      <div className="custom-dot"></div>
    )
  };

  return (
    <>
      <div className="modern-banner-carousel">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div className="banner-slide" key={banner.id}>
              <div className="banner-content">
                <img src={banner.image} alt={banner.title} className="banner-image" />
                <div className="banner-overlay">
                  <div className="banner-text">
                    <h1 className="banner-title">{banner.title}</h1>
                    <p className="banner-subtitle">{banner.subtitle}</p>
                    <button className="banner-cta">{banner.cta}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .modern-banner-carousel {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          margin: 0;
        }

        .banner-slide {
          position: relative;
          height: 500px;
          overflow: hidden;
        }

        .banner-content {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .banner-slide:hover .banner-image {
          transform: scale(1.05);
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.6) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-text {
          text-align: center;
          color: #fff;
          padding: 2rem;
          max-width: 600px;
        }

        .banner-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: fadeInUp 1s ease;
        }

        .banner-subtitle {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          animation: fadeInUp 1s ease 0.2s;
          animation-fill-mode: both;
        }

        .banner-cta {
          background: #fff;
          color: #667eea;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease 0.4s;
          animation-fill-mode: both;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .banner-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .custom-dot {
          width: 40px;
          height: 4px;
          background: rgba(255,255,255,0.5);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .slick-active .custom-dot {
          background: #fff;
          width: 60px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .banner-slide {
            height: 300px;
          }

          .banner-title {
            font-size: 2rem;
          }

          .banner-subtitle {
            font-size: 1.2rem;
          }

          .banner-cta {
            padding: 0.8rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default BannerCarousel;
