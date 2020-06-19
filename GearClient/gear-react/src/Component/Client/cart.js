import React from 'react';
import ProductCart from '../ProductCart.js';

class Cart extends React.Component {
    
    render() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading text-uppercase">HHL SHOPPING CART</h1>
                    </div>
                </div>
                <div className="container">
                    <ProductCart/>
                </div>
            </div>
        );
    }
}
  
export default Cart;;
  