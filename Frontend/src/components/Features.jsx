import React from 'react'
import { FaHeadset, FaMoneyBill, FaPercent, FaTruck } from "react-icons/fa6";

function Features() {
  return (
    <>
                <section className='features-section my-5'>
                    <div className="container">
                        <div className="row text-center ">
                        <div className="col-lg-3">
                            <FaTruck className='icon' />
                            <h3>Free Shipping</h3>
                            <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                        </div>
        
                        <div className="col-lg-3">
                            <FaMoneyBill className='icon' />
                            <h3>Money Back</h3>
                            <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                        </div>
        
                        <div className="col-lg-3">
                            <FaPercent className='icon' />
                            <h3>Discount Offers</h3>
                            <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                        </div>
        
                        <div className="col-lg-3">
                            <FaHeadset className='icon' />
                            <h3>24/7 Support</h3>
                            <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                        </div>
                    </div>
                    </div>
                </section>
            </>
          )
        }
        
        export default Features
    
