import React from 'react';
import ProductDetail from '../ProductDetail.js';

class Detail extends React.Component {
    
    render() {
        return (
            <div className="container">
                <ProductDetail slug={this.props.match.params.slug}/>
            </div>
        );
    }
}
  
export default Detail;;
  