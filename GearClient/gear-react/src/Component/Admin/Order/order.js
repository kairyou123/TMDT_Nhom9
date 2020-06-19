import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import isLogin from '../../../Services/isLogin.js';

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            search: "",
            filter: [],
            currentPage: 1,
            totalPage: 1,
            onePageShow: 7,
            currentUser: "",
            date: "ASC",
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
        else {

        }
        
        axios.get('https://localhost:5001/api/order').then(result => {
            this.setState({
                orders: result.data, 
                filter: result.data,
                totalPage: Math.ceil(result.data.length/this.state.onePageShow),
            });
        });
    }

    handleChange(e) {
        this.setState({[e.target.name] : e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var filter_search = this.state.orders.sort((a,b) => {
            if(this.state.date == "ASC") {
                return new Date(a.createDT) - new Date(b.createDT);
            }
            else return new Date(b.createDT) - new Date(a.createDT);
        }).filter((order) => {
            return  order.shippingReciver.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1;
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
            var orderId = e.target.attributes.getNamedItem('data-order').value;

            axios.delete('https://localhost:5001/api/order/' + orderId).then(result => {
                window.location.reload(false);
            })
            .catch(error => {
                alert("Gặp lỗi trong quá trình xóa");
            });
        }
        
    }


    render() {

        const {filter, totalPage,currentPage, onePageShow} = this.state;
        var offset = onePageShow * (currentPage -1);
        console.log(filter);
        let orders_list = filter.slice(offset,offset + onePageShow).map((order,i) => {
            var orderDate = order.createDT.slice(0, 19).replace(/-/g, "/").replace("T", " ");
            return (<tr key={i}>
            <th>{order.id}</th>
            <td>{order.shippingReciver}</td>
            <td>{order.shippingAddress}</td>
            <td>{order.shippingPhone}</td>
            <td>{order.totalPrice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
            <td>{order.orderStatus}</td>
            <td>{orderDate}</td>
            <td>
                <Link to={`/admin/order/${order.id}/edit`}><button className="admin-button edit"><i className="fas fa-edit" data-order={order.id}></i></button></Link>
                <button className="admin-button delete" data-order={order.id} onClick={this.DeleteButton}><i className="fas fa-trash-alt" data-order={order.id}></i></button>
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

        return (
            <div>
                <div className="admin-content-title"><b>QUẢN LÝ ĐƠN HÀNG</b></div>
                    <div className="admin-content">
                    
                        <div className="admin-filter">
                            <div className="row padding-top-30" >
                                <div className="col-2">
                                    <span>TÌM KIẾM</span>
                                </div>
                                <div className="col-10">
                                    <form id="search-form" name="searchForm" onSubmit={this.handleSubmit}>
                                        <input type="text" className="admin-input" name="search" value={this.state.search} onChange={this.handleChange} placeholder="Tìm theo tên người đặt"/>
                                        <select className="admin-select" name="date" id="date" value={this.state.date} onChange={this.handleChange}>
                                            <option value="ASC">Ngày đặt tăng dần</option>
                                            <option value="DESC">Ngày đặt giảm dần</option>
                                        </select>
                                        <button className="admin-button-submit" type="submit" form="searchForm" value="Submit" onClick={this.handleSubmit}><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="admin-content-title-1">
                            <span className="admin-border-title-1">THÔNG TIN ĐƠN HÀNG</span>
                        </div>
                        <div className="margin-top-20">
                        <table className="table table-striped table-condensed" width="100%">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Người đặt</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">SĐT</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Tình trạng</th>
                                <th scope="col">Ngày đặt</th>
                                <th scope="col">Chức năng</th>
                            </tr>
                            </thead>
                            <tbody>
                                {orders_list}
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
  
export default Order;
  