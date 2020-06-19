import React from 'react';
import axios from 'axios';
import isLogin from '../Services/isLogin.js';
import Oidc from 'oidc-client';

class ProductDetail extends React.Component {
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
            product: [],
            producer: [],
            slug: this.props.slug,
            catalog :"",
            currentUser: "",
            quantity: "1",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
      window.scrollTo(0, 0);
      this.getProducts();
    }

    handleChange(e) {
      let inputName = e.target.name;
        this.setState({
            [inputName] : e.target.value
        })
    }

    getProducts = () => {
      axios.get('https://localhost:5001/api/product/'+this.state.slug).then(result => {    
        result.data.price= result.data.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        result.data.priceDiscount = result.data.priceDiscount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
          this.setState({
              product: result.data, 
              producer:result.data.producer,
          });
       })
      .catch(error => {
          
      });
    }

    Addcart = async(e)=>{
      var id = this.state.product.id;
      var user = await isLogin().catch(()=>{
        this.state.mgr.signinRedirect();
      });
          axios.get('https://localhost:5001/api/carts/user/'+user.profile.sub).then((result) => { 
              var item = result.data.filter((cartitem)=>{
                  return  parseInt(cartitem.productId) === parseInt(id); 
              });
              if(item[0] !== undefined)
              {   
                  item[0].quantity += Number(this.state.quantity);
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
                  'Quantity': Number(this.state.quantity),
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
      console.log(this.state);
        return (
          <div className="product-detail" id="product-detail">
            <div className="product-detail-title">
              <h1>{this.state.product.name}</h1>
            </div>
            <div className="product-detail-content row">
              <div className="product-detail-content-products col-md-6">
                <div id="custCarousel" className="carousel slide" data-ride="carousel" align="center">
                  <div className="carousel-inner">
                    <div className="carousel-item active"> <img src={'https://localhost:5001/image/' + this.state.product.image} alt="Hills" /> </div>
                    <div className="carousel-item"> <img src={'https://localhost:5001/image/' + this.state.product.subImage} alt="Hills" /> </div>
                  </div>
                  <a className="carousel-control-prev" href="#custCarousel" data-slide="prev"> <span
                      className="carousel-control-prev-icon"></span> </a>
                  <a className="carousel-control-next" href="#custCarousel" data-slide="next"> <span
                      className="carousel-control-next-icon"></span> </a>
                  <ol className="carousel-indicators list-inline">
                    <li className="list-inline-item active"> <a id="carousel-selector-0" className="selected" data-slide-to="0"
                        data-target="#custCarousel"> <img src={'https://localhost:5001/image/' + this.state.product.image} className="img-fluid" /> </a> </li>
                    <li className="list-inline-item"> <a id="carousel-selector-1" data-slide-to="1" data-target="#custCarousel">
                        <img src={'https://localhost:5001/image/' + this.state.product.subImage} className="img-fluid" /> </a> </li>
                  </ol>
                </div>
            </div>
              <div className="product-detail-content-products col-md-6 m-0">
            <div className="">
              <div className="product-detail-content-products-name">
                <h2><span className="name">{this.state.product.name}</span></h2>
              </div>
              <div className="product-detail-content-products-producer">
              <h2>Hãng sản xuất: <span className="producer">{this.state.producer.name}</span></h2>
              </div>
              <div className="product-detail-content-products-price">
                <p>Giá: <span className="price">{this.state.product.price}</span></p>
              </div>
              <div className="product-detail-content-products-price-sale">
                <b>Khuyến mãi: <span className="price-sale">{this.state.product.priceDiscount}</span></b>
              </div>
              <div className="product-detail-content-products-btn">
                <p>Số lượng: </p><input name="quantity" onChange={this.handleChange} type="number" defaultValue="1" min="1" max="1000" step="1" className="number" />
                <br />
                <button type="button" onClick={this.Addcart} className="btn btn-danger btn-lg buy-now">Đặt hàng</button>
              </div>
            </div>
          </div>
          </div>
            <div className="detail-tab">
              <ul className="nav nav-tabs m-0" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#menu1">Mô tả sản phẩm </a>
                </li>
              </ul>
              <div className="tab-content">
                <div id="home" className="container tab-pane active"><br />
                  <div dangerouslySetInnerHTML={{__html: this.state.product.description}}></div>
                </div>         
              </div>
            </div>
          </div>
        );
    }
}
  
export default ProductDetail;
  