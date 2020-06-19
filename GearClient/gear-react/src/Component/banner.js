import React from 'react';
import Oidc from 'oidc-client';

class Banner extends React.Component {
  render() {
    return (
      <div id="header" className="carousel slide header" data-ride="carousel">
      <ul className="carousel-indicators">
        <li data-target="#header" data-slide-to={0} className="active" />
        <li data-target="#header" data-slide-to={1} />
        <li data-target="#header" data-slide-to={2} />
      </ul>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="images/m50-banner.jpg" alt="Los Angeles" width={1100} height={500} />
          <div className="carousel-caption">
          </div>
        </div>
        <div className="carousel-item">
          <img src="images/banner_sony.jpg" alt="Chicago" width={1100} height={500} />
          <div className="carousel-caption">
          </div>
        </div>
        <div className="carousel-item">
          <img src="images/banner_logitech.jpg" alt="New York" width={1100} height={500} />
          <div className="carousel-caption">
          </div>
        </div>
      </div>
      <a className="carousel-control-prev" href="#header" data-slide="prev">
        <span className="carousel-control-prev-icon" />
      </a>
      <a className="carousel-control-next" href="#header" data-slide="next">
        <span className="carousel-control-next-icon" />
      </a>
    </div>
    );
  }
}

export default Banner;