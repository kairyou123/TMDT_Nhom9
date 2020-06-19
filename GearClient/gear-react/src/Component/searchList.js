import React from 'react';
import axios from 'axios';
import isLogin from '../Services/isLogin.js';
import Oidc from 'oidc-client';

class SearchList extends React.Component {
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
            products: [],
            search: this.props.search,
            currentPage: 1,
            totalPage: 1,
            onePageShow: 8,
            sort : "saab",
            currentUser: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        console.log(this.state.categoryId);
        this.getProducts();
    }
    
    getProducts = () => {
        axios.get('https://localhost:5001/api/product').then(result => {      
            var filter =result.data.sort((a,b) => {
                return a.priceDiscount-b.priceDiscount;   
            }).filter((product) => {  
                return product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >-1;
            }); 
            console.log(filter);
            this.setState({
                products: filter, 
                totalPage: Math.ceil(filter.length / this.state.onePageShow),
            });  
         })   
        .catch(error => {
            
        });
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
        console.log(this.state.sort);
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
        })
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
                <div class="search-content-products col-md-3">
                    <div class="border">
                        <div class="search-content-products-img">
                        <a href={"/product-detail/"+product.slug}>
                            <img src={'https://localhost:5001/image/' + product.image} alt="img" />
                        </a>
                        <div class="products-hover">
                            <p class="products-hover-see-more">
                            <a href={"/product-detail/"+product.slug}>Nhấn để xem chi tiết</a>
                            </p>
                            <div class="products-hover-btn">
                            <p><a href="#" onClick={this.Addcart} data-product={product.id}>Thêm vào giỏ hàng</a></p>
                            </div>
                        </div>
                        </div>
                        <div class="search-content-products-name">
                        <h5>{product.name}</h5>
                        </div>
                        <div class="search-content-products-price">
                        <p>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                        </div>
                        <div class="search-content-products-price-sale">
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
            <div class="search" id="search">
                <div class="search-title">
                    <h1>Tìm Kiếm</h1>
                    <div class="row search-title-sub">
                        <div class="col-sm-12 wrap-sort-by">
                            <p class="d-inline-block"><i class="fas fa-info-circle"></i>&nbsp;<span>Kết quả tìm kiếm cho từ khóa
                                "</span><b class="key-word"><i>{this.state.search}</i></b><span>"</span></p>
                            <div class="float-right">
                                <label for="Sort">Sắp xếp theo:&nbsp;</label>
                                <select id="sort">
                                    <option value="default">Mặc định </option>
                                    <option value="saab">Giá: Tăng dần </option>
                                    <option value="opel">Giá: Giảm dần </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search-content row">
                    {pList}
                </div>
                {this.state.products.length===0 && 
                    <div class="search-content text-center not-found">
                    <i class="fas fa-info-circle fa-9x"></i>
                    <br />
                    <br />
                    <h2 class="text-center">Rất tiếc, không có sản phẩm nào phù hợp với từ khóa của bạn.</h2>
            </div>
                }
                <div className="admin-pagination">
                        <ul className="pagination pagination-centered">
                            {pagination}
                        </ul>
                </div>
                
            </div>
        );
    }
}
  
export default SearchList;
  