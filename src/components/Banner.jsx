import React from 'react'
import Button from './Button'

const Banner = () => {
    return (
        <>
            <section className='banner-section'>
                <div className="container">
                    <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="content">
                            <span className="promo-badge">New Collection 2025</span>
                            <h1>Discover Stylish <span>Fashion</span> For Every Season</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Vestibulum ante ipsum primis in faucibus.</p>
                            <Button title={"Shop Now"} />
                            <Button title={"View Collection"} />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="content-img position-relative">
                            <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-f-9.webp" alt="Banner Img" className='img-fluid' />

                            <div className="floating-product">
                                <div>
                                    <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-4.webp" alt="" className='img-fluid' />
                                </div>
                                <div className="product-info">
                                    <h4>Summer Collection</h4>
                                    <span className="price">$89.99</span>
                                </div>
                            </div>

                            <div className="floating-product-2">
                                <div>
                                    <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-4.webp" alt="" className='img-fluid' />
                                </div>
                                <div className="product-info">
                                    <h4>Summer Collection</h4>
                                    <span className="price">$89.99</span>
                                </div>
                            </div>

                            <div className="discount">
                                <span className="percent">30%</span>
                                <span className="text">OFF</span>
                            </div>

                        </div>
                    </div>
                </div>
                </div>
            </section>
        </>
    )
}

export default Banner