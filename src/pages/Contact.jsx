import React from 'react'
import Information from '../components/Information'
import Map from '../components/Map'

const Contact = () => {
  return (
    <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <Information/>
              <Map />
            </div>
          </div>
        </div>
    </>
  )
}

export default Contact