import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import isLogin from '../../../Services/isLogin.js';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            catalogs: [],
            manufactuers: [],
            search: "",
            catalog: "All",
            manufactuer: "All",
            filter: [],
            currentPage: 1,
            totalPage: 1,
            onePageShow: 7,
            currentUser: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        var user = await isLogin();

        this.setState({
            currentUser: user,
        });

        if(user) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
        }
        
        Promise.all([axios.get('https://localhost:5001/api/product'), 
                    axios.get('https://localhost:5001/api/catalog'),
                    axios.get('https://localhost:5001/api/producer')]
        ).then(result => {
            this.setState({
                products: result[0].data,
                catalogs: result[1].data,
                filter: result[0].data,
                totalPage: Math.ceil(result[0].data.length/this.state.onePageShow),
                manufactuers: result[2].data, 
            });
        });
    }

    handleChange(e) {
        var input = e.target.name;
        this.setState({[input] : e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var filter_catalog = this.state.products.filter(product => {
            if(this.state.catalog === "All") {
                return product;
            }
            return product.catalog.name === this.state.catalog;
        });

        var filter_manufactuer = filter_catalog.filter(product => {
            if(this.state.manufactuer === "All") {
                return product;
            }
            return product.producer.name === this.state.manufactuer;
        });
        var filter_search = filter_manufactuer.filter((product) => {
            return  product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1;
        });
        this.setState({
            filter: filter_search,
            currentPage: 1,
            totalPage: Math.ceil(filter_search.length / this.state.onePageShow),
        })
    }

    goToPage = (e) => {
        this.setState({
            currentPage: e.target.attributes.getNamedItem('data-page').value,
        })

    }

    DeleteButton = (e) => {
        var choice = window.confirm("Bạn có chắc chắn muốn xóa?");

        if(choice) {
            var productId = e.target.attributes.getNamedItem('data-product').value;

            axios.delete('https://localhost:5001/api/product/' + productId).then(result => {
                window.location.reload(false);
            })
            .catch(error => {
                console.log(error);
            });
        }
        
    }


    render() {

        const {filter, totalPage,currentPage, onePageShow, manufactuers, catalogs} = this.state;
        var offset = onePageShow * (currentPage -1);
        
        let products_list = filter.slice(offset,offset + onePageShow).map((product,i) => {
            var src = "https://localhost:5001/Image/" + product.image;
            return (<tr key={i}>
            <th><img src={src} width="60px" height="60px" /></th>
            <td>{product.name}</td>
            <td>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
            <td>{product.discount}%</td>
            <td>{product.stock}</td>
            <td>{product.catalog.name}</td>
            <td>{product.producer.name}</td>
            <td>
                <Link to={`/admin/product/${product.slug}/edit`}><button className="admin-button edit"><i className="fas fa-edit" data-product={product.id}></i></button></Link>
                <button className="admin-button delete" data-product={product.id} onClick={this.DeleteButton}><i className="fas fa-trash-alt" data-product={product.id}></i></button>
            </td>
            </tr>);
        });

        var pagination = [];
        pagination.push(<li className="page-item" key={0}>
                        <span className="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true" data-page={parseInt(currentPage) === 1 ? currentPage : (parseInt(currentPage) - 1)} onClick={this.goToPage}>&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </span>
                        </li>);

        for (var i = 0; i < totalPage; i++) {
            if((i+1) === parseInt(currentPage)){
                pagination.push(<li className="page-item active" key={i+1}><span className="page-link" data-page={i+1} onClick={this.goToPage}>{i+1}</span></li>);
            }
            else {
                pagination.push(<li className="page-item" key={i+1}><span className="page-link" data-page={i+1} onClick={this.goToPage}>{i+1}</span></li>);
            }
        }

        pagination.push(<li className="page-item" key={totalPage+1}>
                    <span className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true" data-page={parseInt(this.state.currentPage) === totalPage ? totalPage : (parseInt(currentPage) + 1)} onClick={this.goToPage}>&raquo;</span>
                        <span className="sr-only">Next</span>
                    </span>
                    </li>);

        var catalogs_select = catalogs.map((catalog, i) => {
             return <option value={catalog.name} key={i}>{catalog.name}</option>
        });

        var manufactuers_select = manufactuers.map((manufactuer, i) => {
            return <option value={manufactuer.name}>{manufactuer.name}</option>
       });

        return (
            <div>
                <div className="admin-content-title"><b>QUẢN LÝ SẢN PHẨM</b></div>
                    <div className="admin-content">
                    
                        <div className="admin-filter">
                            <div className="row">
                                <div className="col-2">
                                    <span>TÌM KIẾM</span>
                                </div>
                                <div className="col-10">
                                    <form id="search-form" name="searchForm" onSubmit={this.handleSubmit}>
                                        <input type="text" className="admin-input" name="search" value={this.state.search} onChange={this.handleChange}/>
                                        <select className="admin-select" name="catalog" id="catalog" value={this.state.catalog} onChange={this.handleChange}>
                                            <option value="All">Chủng loại</option>
                                            {catalogs_select}
                                        </select>
                                        <select className="admin-select" name="manufactuer" id="manufactuer" value={this.state.manufactuer} onChange={this.handleChange}>
                                            <option value="All">HSX</option>
                                            {manufactuers_select}
                                        </select>
                                        <button className="admin-button-submit" type="submit" form="searchForm" value="Submit" onClick={this.handleSubmit}><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                                <Link to="/admin/product/add"><div className="admin-plus">
                                    <span><i className="fas fa-plus-circle"></i></span>
                                </div>
                                </Link>
                            </div>
                        </div>
                        <div className="admin-content-title-1">
                            <span className="admin-border-title-1">THÔNG TIN SẢN PHẨM</span>
                        </div>
                        <div className="margin-top-20">
                        <table className="table table-striped table-condensed" width="100%">
                            <thead>
                            <tr>
                                <th scope="col">Hình</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Giảm giá</th>
                                <th scope="col">Tồn kho</th>
                                <th scope="col">Chủng loại</th>
                                <th scope="col">HSX</th>
                                <th scope="col">Chức năng</th>
                            </tr>
                            </thead>
                            <tbody>
                                {products_list}
                            </tbody>
                        </table>
                        </div>
                        <div className="admin-pagination">
                        <ul className="pagination pagination-centered">
                            {pagination}
                        </ul>
                        </div>
                    </div>
            </div>
        )
    }
}
  
export default Product;
  