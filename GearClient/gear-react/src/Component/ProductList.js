import React from 'react';
import axios from 'axios';
import isLogin from '../Services/isLogin.js';
import Oidc from 'oidc-client';
import { Link } from "react-router-dom";

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        var config = {
            authority: "http://localhost:5000",
            client_id: "spa",
            client_serect: "api_secret",
            redirect_uri: "http://localhost:5003/redirect",
            response_type: "code",
            scope:"openid profile email address phone gearapi",
            post_logout_redirect_uri : "http://localhost:5003/",
            userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
          };
        this.state = {
            mgr : new Oidc.UserManager(config),
            products_without: [],
            products: [],
            search: "",
            currentPage: 1,
            totalPage: 1,
            onePageShow: 8,
            categoryId: this.props.id,
            catalog :"",
            sort : "saab",
            filter:[],
            currentUser: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        this.getProducts();
    }
    
    getProducts = () => {
        axios.get('https://localhost:5001/api/product').then(result => {      
            // this.setState({
            //     products: result.data, 
            //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
            // });
            var filter =result.data.sort((a,b) => {
                return a.priceDiscount-b.priceDiscount;   
            }).filter((p) => {  
            return parseInt(p.catalogID) === parseInt(this.state.categoryId);
            }); 
            this.setState({
                products_without: result.data,
                products: filter, 
                catalog : filter[0].catalog.name,
                totalPage: Math.ceil(filter.length / this.state.onePageShow),
            });  
         })   
        .catch(error => {
            
        });
    }
    componentWillReceiveProps(nextProps)
    {
        if (nextProps.id !== this.state.categoryId) {
            this.setState({
                categoryId: nextProps.id,
            });  
            var filter =this.state.products_without.sort((a,b) => {
                return a.priceDiscount-b.priceDiscount;   
            }).filter((p) => {  
            return parseInt(p.catalogID) === parseInt(nextProps.id);
            }); 

            this.setState({
                products: filter, 
                catalog : filter[0].catalog.name,
                currentPage: 1,
                totalPage: Math.ceil(filter.length / this.state.onePageShow),
            });  
        }
    }

    handleChange(e) {
        return new Promise((resolve) => {
            this.setState({[e.target.name] : e.target.value});
            resolve('OK');
        });
        
    }


    handleSubmit = async (e) => {
        await this.handleChange(e);
        e.preventDefault();
        var filter_search = this.state.products.sort((a,b) => {
            if(this.state.sort == "saab") {
                return a.priceDiscount-b.priceDiscount;
            }
            else 
            if(this.state.sort == "opel")
            {
            return b.priceDiscount-a.priceDiscount;
            }
        }).filter((product) => {
            // return  parseInt(product.catalogID) === parseInt(this.state.categoryId);
            return product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >-1;
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
        });
        window.scrollTo(0, 0);
    }

    Addcart = async(e)=>{
        var id = e.target.attributes.getNamedItem('data-product').value;
        var user = await isLogin().catch(()=>{
            this.state.mgr.signinRedirect();
          });
        axios.get('https://localhost:5001/api/carts/user/'+user.profile.sub).then((result) => { 
            var item = result.data.filter((cartitem)=>{
                return  parseInt(cartitem.productId) === parseInt(id); 
            });
            if(item[0] !== undefined)
                {   
                    item[0].quantity += 1;
                    console.log(item[0])
                    axios.put("https://localhost:5001/api/carts/"+item[0].id, item[0], {
                    headers: {
                    'Content-Type': 'application/json',
                }
                });
            }
            else
            {
            var data = {
                'UserId': user.profile.sub,
                'ProductId': Number(id),
                'Quantity':1,
            };
            axios.post("https://localhost:5001/api/carts", data, {
            headers: {
            'Content-Type': 'application/json',
                }
            });
            }
        }).then(()=>{
            window.location.reload(false);
        })
        
    }

    render() {
        const {totalPage,currentPage, onePageShow} = this.state;
        var offset = onePageShow * (currentPage -1);
        let pList = this.state.products.slice(offset,offset + onePageShow).map((product,i) =>{
            return(
                <div className="product-category-content-products col-md-3" key={i}>
                        <div className="border">
                            <div className="product-category-content-products-img">
                            <Link to={"/product-detail/"+product.slug}>
                                <img src={'https://localhost:5001/image/' + product.image} alt="img" />
                            </Link>
                            <div className="products-hover">
                                <p className="products-hover-see-more">
                                <Link to={"/product-detail/"+product.slug}>Nhấn để xem chi tiết</Link>
                                </p>
                                <div className="products-hover-btn">
                                <p><a href="#" onClick={this.Addcart} data-product={product.id}>Thêm vào giỏ hàng</a></p>
                                </div>
                            </div>
                            </div>
                            <div className="product-category-content-products-name">
                                <h5>{product.name}</h5>
                            </div>
                            <div className="product-category-content-products-price">
                                <p>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                            </div>
                            <div className="product-category-content-products-price-sale">
                                <p>{product.priceDiscount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                            </div>
                        </div>
                    </div>
                
            )
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

        return (
            <div className="product-category" id="product-category">
                <div className="product-category-title">
                    <h1>{this.state.catalog}</h1>
                    <div className="row product-category-title-sort">
                        <div className="col-sm-12 wrap-sort-by">
                            <div className="product-category-title-sort-style">
                                <label for="products">Sắp xếp theo:&nbsp;</label>
                                <select name="sort" id="sort" value={this.state.sort} onChange={this.handleSubmit}>
                                    <option value="saab">Giá: Tăng dần </option>
                                    <option value="opel">Giá Giảm dần</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-category-content row">
                    {pList}
                   
                </div>
                <div className="admin-pagination">
                        <ul className="pagination pagination-centered">
                            {pagination}
                        </ul>
                </div>
            </div>
        );
    }
}
  
export default ProductList;
  