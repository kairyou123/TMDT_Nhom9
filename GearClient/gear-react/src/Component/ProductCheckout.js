import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import isLogin from '../Services/isLogin.js';

class ProductCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        carts: [],
        currentUser: "",
        name:"",
        phone:"",
        address:"",
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
    await this.getcart();
    await this.getuserdata();

  }

  handleChange(e) {
    let inputName = e.target.name;
    this.setState({
        [inputName] : e.target.value
    })
    console.log(this.state);
  }

  handleSubmit = async  (e) => {
    
    e.preventDefault();
    try {
        await this.handleInputError();

    }
    catch (error_) {
        alert(error_);
        return 0;
    }
    var data = {
        'userid': this.state.currentUser.profile.sub,
        'name': this.state.name,
        'address': this.state.address,
        'phone': this.state.phone,
    };
    console.log(data);
    axios.post("https://localhost:5001/api/order", data, {
        headers: {
            'Content-Type': 'application/json',
                }
         })
         .then(result => {
            var success_ = "Đặt hàng thành công ! Cảm ơn bạn đã mua hàng. ";
            alert(success_);
            window.location.href="/";
         })
         .catch((error) => {
            alert(error);
         });
}
  
  getcart() {
    return new Promise((resolve, reject) => {
    console.log(this.state.currentUser.profile.sub);
    axios.get('https://localhost:5001/api/carts/user/'+this.state.currentUser.profile.sub).then(result => {      
      // this.setState({
      //     products: result.data, 
      //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
      // });
      this.setState({
          carts: result.data, 
      });  
      console.log(this.state);
   })   
  .catch(error => {
  });
    resolve("OK");
  });

  }

  getuserdata(){
    return new Promise((resolve, reject) => {
    axios.get('https://localhost:5001/api/user/'+this.state.currentUser.profile.sub, {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(result => {
      console.log(result.data);
      this.setState({
          name : result.data.name,
          phone :result.data.phoneNumber,
          address : result.data.address,
      });
      console.log(this.state);
    }).catch(error=>{});
    resolve("OK");
  });
  }

  handleInputError = () => {
    return new Promise((resolve, reject) => {
        if(!this.state.name){
            reject("Tên không được để trống");
        }

        if(!this.state.address){
            reject("Địa chỉ không được để trống");
        }

        if(!this.state.phone || !this.state.phone.match(/^[0-9]{8,}$/)){
            reject("Số điện thoại phải có ít nhất 8 số");
        }

        resolve("ok");
    })
  }



    render() {
      var totalprice = 0;
      let ilist = this.state.carts.map((cart,i)=>{
        totalprice += cart.quantity*cart.product.priceDiscount;
        return(
                  <tbody key={i}>
                    <tr>
                      <td className="table-checkout--img"><a href="#"><img src={'https://localhost:5001/image/' + cart.product.image} alt="img" /></a></td>
                      <td className="table-checkout--name"><a href="#">{cart.product.name}</a>
                      </td>
                      <td className="table-checkout--quantily">{cart.quantity}</td>
                      <td className="table-checkout--price text-center">{(cart.quantity*cart.product.priceDiscount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                    </tr>
                  </tbody>
        )
      })
        return (
          <div className="row checkout">
            <div className="col-6">
              <h4 className="mb-3">Đơn Hàng</h4>
              <div className="table-responsive">
                <table className="table table-checkout">
                  <thead>
                    <tr>
                      <th className="table-checkout--img"></th>
                      <th className="table-checkout--name">Sản phẩm</th>
                      <th className="table-checkout--quantily">Số lượng</th>
                      <th className="table-checkout--price text-center">Giá tiền</th>
                    </tr>
                  </thead>
                  {ilist}
                  <tbody>
                    <tr className="table-checkout--total">
                      <td colspan="2" className="text-right font-weight-bold">Tổng tiền:</td>
                      <td colspan="3" className="text-right font-weight-bold">{totalprice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-6">
            <h4 className="mb-3">Thông Tin Thanh Toán</h4>
            <form className="needs-validation" novalidate="">
                <div className="mb-3">
                  <label for="Name">Tên</label>
                  <input type="text" className="form-control" id="Name" placeholder="" value={this.state.name} onChange={this.handleChange} name="name" required="" />
                  <div className="invalid-feedback">Không được để trống.</div>
                </div>
              <div className="mb-3">
                <label for="address">Address</label>
                <input type="text" className="form-control" id="address" placeholder="1234 Main St" value={this.state.address} onChange={this.handleChange} name="address" required="" />
                <div className="invalid-feedback">Không được để trống.</div>
              </div>
              <div className="mb-3">
                <label for="phone">Phone number</label>
                <input type="text" className="form-control" id="phone" placeholder="090123456" value={this.state.phone} onChange={this.handleChange} name="phone" required="" />
                <div className="invalid-feedback">Không được để trống.</div>
              </div>
              <hr className="mb-4" />
              <h4 className="mb-3">Phương thức thanh toán</h4>
              <div className="d-block my-3">
                <div className="custom-control custom-radio">
                  <input id="cod" name="paymentMethod" type="radio" className="custom-control-input" checked="true" required="" />
                  <label className="custom-control-label" for="cod">Thanh toán khi nhận hàng</label>
                </div>
                <div className="custom-control custom-radio">
                  <input id="momo" name="paymentMethod" type="radio" className="custom-control-input" required="" />
                  <label className="custom-control-label" for="momo">Thanh toán qua Momo</label>
                </div>
              </div>
              <hr className="mb-4" />
              <div className="row">
                <div className="col-sm-12  col-md-6">
                  <button className="btn btn-lg btn-block btn-light"><i className="fas fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Quay
                    lại</button>
                </div>
                {this.state.carts.length>0 &&
                  <div className="col-sm-12 col-md-6 text-right">
                  <button className="btn btn-lg btn-block btn-danger text-uppercase" onClick={this.handleSubmit} type="submit">Mua hàng</button>
                </div>
                }
              </div>
            </form>
          </div>
          </div>
        );
    }
}
  
export default ProductCheckout;
  