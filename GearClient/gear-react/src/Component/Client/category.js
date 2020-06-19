import React from 'react';
import ProductList from '../ProductList.js';

class Category extends React.Component {
    
    render() {
        return (
            <div className="container">
                <ProductList id={this.props.match.params.id}/>
            </div>
        );
    }
}
  
export default Category;
  