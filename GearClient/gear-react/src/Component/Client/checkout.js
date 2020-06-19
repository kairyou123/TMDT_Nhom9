import React from 'react';
import ProductCheckout from '../ProductCheckout.js';

class Checkout extends React.Component {
    
    render() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading text-uppercase">HHL CHECKOUT</h1>
                    </div>
                </div>
                <div className="container">
                    <ProductCheckout/>
                </div>
            </div>
        );
    }
}
  
export default Checkout;;
  