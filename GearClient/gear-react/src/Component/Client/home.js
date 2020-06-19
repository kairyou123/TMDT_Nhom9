import React from 'react';
import Banner from '../banner.js';
import SlideProduct from '../SlideProduct.js';

class Home extends React.Component {
    
    render() {
        return (
            <div className="container">
                <Banner/>
                <SlideProduct/>
            </div>
        );
    }
}
  
export default Home;
  