import React from 'react'

const PlaceHolder = () => {
    return (
        <div className="col-md-3 my-4">
          <div className="card p-3 shadow border-0 h-100 product-card">
            <div className="card-img-top text-center">
              <div className="placeholder-glow">
                <div className="placeholder w-100" style={{ height: '200px' }}></div>
              </div>
            </div>
            <div className="card-body text-center">
              <div className="placeholder-glow mb-2">
                <div className="placeholder w-75" style={{ height: '1.5rem' }}></div>
              </div>
              <div className="placeholder-glow">
                <div className="placeholder w-50" style={{ height: '1rem' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    

export default PlaceHolder