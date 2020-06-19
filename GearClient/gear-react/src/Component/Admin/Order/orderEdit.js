import React from 'react';
import axios from 'axios';
import isLogin from '../../../Services/isLogin.js';

class OrderEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order : "",
            orderId: this.props.match.params.id,
            orderStatus: "",
            error1: "",
            orderItems: [],
            orderCancel: false,
            _loaded: false,
        }
        
    }
    async componentDidMount() {
        var user = await isLogin();
        var order_ = await this.getOrder(user.access_token);

        if(order_) {
            this.setState({
                order: order_,
                orderStatus: order_.orderStatus,
                orderItems: order_.orderItems,
                _loaded: true,
            })
            if(order_.orderStatus === "Đã hủy") {
                this.setState({
                    orderCancel: true,
                })
            }
        }
        

    }

    getOrder = (access_token) => {
        return new Promise((resolve, reject) => {
            
            axios.defaults.headers.common = {'Authorization': `Bearer ${access_token}`};
            axios.get('https://localhost:5001/api/order/' + this.state.orderId).then(result => {
               resolve(result.data);
            })
            .catch(error => {
               reject(error);
            });
        })
    }

    handleChange = (e) => {
        let inputName = e.target.name;
        console.log(e);
        this.setState({
            [inputName] : e.target.value
        })
    }

    handleSubmit = (e) => {
        var data = {
            "orderstatus": this.state.orderStatus
        };
        axios.put('https://localhost:5001/api/order/' + this.state.orderId, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
        })
        .then(result => {
            window.location.reload(false);
        })
        .catch(error => {
              
        });
    }



    render() {
        if(this.state._loaded === false) {
            return "Loading";
        }

        const {order, orderItems, orderStatus, orderCancel} = this.state;
        var totalPrice = parseInt(order.totalPrice).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        var product_lists = orderItems.map((orderItem,i) => {
            var product = orderItem.product;
            return (
            <tr key={i}>
                <th><img src={"https://localhost:5001/image/" + product.image} width="70px" height="70px" /></th>
                <td>{product.name}</td>
                <td>{orderItem.quantity}</td>
                <td>{(orderItem.quantity * product.priceDiscount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
            </tr>)
            
        }); 
        
        var status = (!orderCancel) ? 
        <select className="admin-order-select" name="orderStatus" value={orderStatus} onChange={this.handleChange}>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Giao hàng thành công">Giao hàng thành công</option>
            <option value="Đã hủy">Đã hủy</option>
        </select> : 
        <select className="admin-order-select" value={orderStatus} disabled="true">
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Giao hàng thành công">Giao hàng thành công</option>
            <option value="Đã hủy">Đã hủy</option>
        </select>;
        return (
            <div>
                <div className="admin-content-title"><b>SỬA ĐỔI ĐƠN HÀNG</b></div>
                <div className="admin-content">
                    <div className="admin-order ">
                        <div className="row">
                            <div className="col-6">
                                Đơn hàng thứ #{this.state.order.id}
                            </div>
                            <div className="col-6">
                                Ngày đặt: {this.state.order.createDT.slice(0, 19).replace(/-/g, "/").replace("T", " ")}
                            </div>
                        </div>
                        <div className="admin-order-id"><b>Mã số đơn hàng: {this.state.order.orderId}</b></div>
                        <div className="admin-order-info">
                            <div className="admin-order-info-title"><b>THÔNG TIN ĐƠN HÀNG</b></div>
                            <div className="admin-order-info-content row">
                                <div className="col-6">Tên người nhận: {this.state.order.shippingReciver}</div>
                                <div className="col-6">Tổng tiền: <b>{totalPrice}</b></div>
                                <div className="col-6">Địa chỉ: {this.state.order.shippingAddress}</div>
                                <div className="col-6">Tình trạng: 
                                    {status}
                                </div>
                                <div className="col-6">Số điện thoại: {this.state.order.shippingPhone}</div>
                                <div className="col-6">
                                    {!orderCancel ? <button className="btn btn-warning admin-order-button" onClick={this.handleSubmit}>SỬA</button> : <button className="btn btn-warning admin-order-button" disabled="true">SỬA</button>}
                                    
                                </div>
                            </div>
                        </div>
                        <div className="admin-order-info">
                            <div className="admin-order-info-title"><b>THÔNG TIN SẢN PHẨM CỦA ĐƠN HÀNG</b></div>
                            <div className="admin-order-info-content">
                            <table className="table table-striped table-condensed" width="100%">
                                <thead>
                                    <tr>
                                        <th scope="col">Hình</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product_lists}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        );
    }
}
export default OrderEdit;