import React from 'react';
import Swiper from 'react-id-swiper';
import axios from 'axios';
import isLogin from '../Services/isLogin.js';
import Oidc from 'oidc-client';
import { Link } from "react-router-dom";

class SlideProduct extends React.Component{
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
        currentUser: "",
    }

    this.handleChange = this.handleChange.bind(this);
    }
  async componentDidMount() {
  this.getProducts();
  console.log(this.state);
  } 

getProducts = () => {
  axios.get('https://localhost:5001/api/product').then(result => {      
      // this.setState({
      //     products: result.data, 
      //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
      // });
      var filter =result.data.filter((p) => {  
      return parseInt(p.catalogID) === 1;
      }); 
      this.setState({
          products: filter, 
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

render(){
  const params = {
    calculateHeight: true,
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    autoplay: {
    delay: 5500,
    disableOnInteraction: false,
    },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev'
    // }
  }
   
  let plist = this.state.products.map((product,i)=>{
    return(
      <div className="swiper-slide" key={i}>
            <Link to={"/product-detail/"+product.slug}>
              <div className="products">
                <div className="products-img">
                  <img  src={'https://localhost:5001/image/' + product.image}  style={{flex: 1, resizeMode: 'stretch', width: '100%', height: '200px'}} alt="img"/>
                  <div className="products-hover">
                    <p className="products-hover-see-more">
                      <Link to={"/product-detail/"+product.slug}>Nhấn để xem chi tiết</Link>
                    </p>
                    <div className="products-hover-btn">
                      <p><Link to="#" onClick={this.Addcart} data-product={product.id}>Thêm vào giỏ hàng</Link></p>
                    </div>
                  </div>
                </div>
                <div className="products-name">
                  <h4>{product.name}</h4>
                </div>
                <div className="products-price">
                  <p>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                </div>
                <div className="products-price-sale">
                  <p>{product.priceDiscount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                </div>
              </div>
            </Link>
          </div>
    )
  })
  
   
  
  return (
    <div>
      <div className="title-content-index">
        <p className="title-content-index-name">Chuột máy tính</p>
        <p className="title-content-index-more"><Link to="/product-category/1">Xem thêm</Link></p>
      </div>
      <div className="content-index">
      <Swiper key={this.state.products.length} {...params}>
            {plist}
      </Swiper>
      </div>
    </div>
  )
  } 
}

export default SlideProduct;