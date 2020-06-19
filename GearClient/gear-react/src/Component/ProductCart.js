import React from 'react';
import isLogin from '../Services/isLogin.js';
import Oidc from 'oidc-client';
import axios from 'axios';
import { Link } from "react-router-dom";

class ProductCart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          cart: [],
          currentUser: "",
      }

      this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
      var user = await isLogin().catch(()=>{
      });
      if(user) {
        axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
      }
      else {
  
      }
      this.setState({currentUser:user,});
      console.log(this.state);
      this.getcart();
    }

    handleChange(e) {
      // let inputName = e.target.name;
      //   this.setState({
      //       [inputName] : e.target.value
      //   })
      var cur= e.currentTarget.attributes.getNamedItem('cur').value;
      var quantity = e.currentTarget.value;
      var _cart = this.state.cart;
      _cart[cur].quantity = Number(quantity);
      console.log(_cart[cur]);
      axios.put("https://localhost:5001/api/carts/"+_cart[cur].id, _cart[cur], {
                  headers: {
                  'Content-Type': 'application/json',
                  }
                   });
      this.setState({
        cart : _cart,
      });

    }
    
    getcart() {
      console.log(this.state.currentUser.profile.sub);
      axios.get('https://localhost:5001/api/carts/user/'+this.state.currentUser.profile.sub).then(result => {      
        // this.setState({
        //     products: result.data, 
        //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
        // });
        console.log(result.data);
        this.setState({
            cart: result.data, 
        });  
     })   
    .catch(error => {
    });

    }

    deletecartitem=(e)=>{ 
      var pname = e.currentTarget.attributes.getNamedItem('product-name').value;
      var cid = e.currentTarget.attributes.getNamedItem('cart-id').value;
      if(window.confirm("Xác nhận xóa sản phẩm "+ pname
      +" khỏi giỏ hàng ?"))
      {
          axios.delete('https://localhost:5001/api/carts/'+ cid).then(()=>{
              this.getcart();
          }).then(()=>{
            window.location.reload(false);
        })
      }
    }


    render() {
        var totalprice = 0;
        let clist = this.state.cart.map((cart,i)=>{
          totalprice += cart.quantity*cart.product.priceDiscount;
          var price = (cart.quantity*cart.product.priceDiscount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
          return(
            <tbody key={i}>
                    <tr>
                      <td className="table-cart--img"><Link to={'/product-detail/'+cart.product.slug}><img src={'https://localhost:5001/image/' + cart.product.image} alt="img" /></Link></td>
                      <td className="table-cart--name"><Link to={'/product-detail/'+cart.product.slug}>{cart.product.name}</Link></td>
                      <td className="table-cart--quantily"><input type="number" cur={i} name="sl" onChange={this.handleChange} defaultValue={cart.quantity} size="5" className="quantily" />
                      </td>
                      <td className="table-cart--price text-center">{price}</td>
                      <td className="table-cart--trash"><button className="btn btn-sm btn-danger" name="abc"  product-name={cart.product.name} cart-id={cart.id} onClick={this.deletecartitem}><i className="fa fa-trash"></i>
                        </button></td>
                    </tr>
            </tbody>
          )
        })
        return (
          <div className="row cart">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-cart">
                  <thead>
                    <tr>
                      <th className="table-cart--img"></th>
                      <th className="table-cart--name">Sản phẩm</th>
                      <th className="table-cart--quantily">Số lượng</th>
                      <th className="table-cart--price text-center">Giá tiền</th>
                      <th className="table-cart--trash"></th>
                    </tr>
                  </thead>
                  {clist}
                  <tbody>
                    <tr className="table-cart--total">
                      <td colSpan="3" className="text-right font-weight-bold">Tổng tiền:</td>
                      <td colSpan="2" className="text-right font-weight-bold">{totalprice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col mb-2">
        <div className="row">
          <div className="col-sm-12  col-md-6">
            <Link to={'/'}><button className="btn btn-lg btn-block btn-light"><i className="fas fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Tiếp tục mua
              hàng</button></Link>
          </div>
          {this.state.cart.length >0 &&
            <div className="col-sm-12 col-md-6 text-right">
            <Link to={'check-out'}><button className="btn btn-lg btn-block btn-danger text-uppercase">Thanh toán</button></Link>
            </div>
          }
        </div>
      </div>
          </div>
        );
    }
}
  
export default ProductCart;
  