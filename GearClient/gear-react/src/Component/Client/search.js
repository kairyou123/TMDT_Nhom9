import React from 'react';
import SearchList from '../searchList.js';

class Search extends React.Component {
    
    render() {
        return (
            <div className="container">
                {/* <ProductList id={this.props.match.params.id}/> */}
                <SearchList search={this.props.match.params.search}/>
            </div>
        );
    }
}
  
export default Search;
  