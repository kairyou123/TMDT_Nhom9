import React from 'react';
import axios from 'axios';

class OrdersTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: this.props.user2,
        orders:[],
        currentPage: 1,
        totalPage: 1,
        onePageShow: 8,
        cur: this.props.cur,
    }

    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){}

  async componentDidMount(){
    this.getorder();
  }

  componentWillReceiveProps(nextProps)
  {    
      this.setState({
        cur: nextProps.cur,
      });  
  }

  getorder(){
    axios.get('https://localhost:5001/api/order/user/'+this.state.currentUser.id).then(result => {
            var filter =result.data.sort((a,b) => {
                return new Date(b.createDT)-new Date(a.createDT);   
            })
            this.setState({
                orders: filter, 
                totalPage: Math.ceil(result.data.length/this.state.onePageShow),
            });
        }).catch(error => {
            
        });
  }

  getorderitem=(order)=>{
    let ilist = order.map((item,i)=>{
      return (
        <tbody key={i}>
          <tr>
              <td className="table-orders--img"><a href="#"><img src={'https://localhost:5001/image/' + item.product.image} alt="img" /></a></td>
              <td className="table-orders--name"><a href="#">{item.product.name}</a>
              </td>
              <td className="table-orders--quantily">{item.quantity}</td>
              <td className="table-orders--price text-center">{(item.quantity*item.product.priceDiscount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
          </tr>
        </tbody>
      )
    });
    return ilist;
  }

  cancelorder=(e) =>{

    var cur =  e.currentTarget.attributes.getNamedItem('cur').value;
    var order = this.state.orders[cur];
    if(window.confirm("Xác nhận hủy đơn hàng "+ order.orderId
      +" ?"))
      {
        order.orderStatus="Đã hủy";
        axios.put("https://localhost:5001/api/order/"+ order.id, order, {
          headers: {
          'Content-Type': 'application/json',
          }
           }).then(()=>{
              this.getorder();
           });
      }
  }

  goToPage = (e) => {
    this.setState({
        currentPage: e.target.attributes.getNamedItem('data-page').value,
    })
  }

  cancelbutton(order,i){
    if(order.orderStatus!="Đã hủy")
    {
      return (
        <tbody>
                      <tr className="table-orders--total">
                        <td colSpan ="4" className="text-center font-weight-bold">
                          <button type="button" className="btn btn-danger" onClick={this.cancelorder} cur={i}>Hủy Đơn</button></td>
                      </tr>
                    </tbody>
      )
    }
  }

    render() {
      var tab="tab-pane orders";
      if(this.state.cur === "order")
        tab = "tab-pane active order";
      const {totalPage,currentPage, onePageShow} = this.state;
      var offset = onePageShow * (currentPage -1);
      let oList = this.state.orders.slice(offset,offset + onePageShow).map((order,i) =>{
          return(
            <div className="card" key={i}>
            <div className="card-header" id={"heading"+i}>
              <h2 className="mb-0">
                <button className="btn btn-link w-100" type="button" data-toggle="collapse" data-target={"#collapse"+i}
                  aria-expanded="true" aria-controls={"collapse"+i}>
                  <div>
                    <p className="float-left">Ma don hang: <b className="code">{order.orderId}</b></p>
                    <p className="text-center status d-inline-block">{order.orderStatus}</p>
                    <p className="float-right date">{order.createDT}</p>
                  </div>
                </button>
              </h2>
            </div>
    
            <div id={"collapse"+i} className="collapse" aria-labelledby={"heading"+i} data-parent="#accordionExample">
              <div className="card-body orders">
                <div className="table-responsive">
                  <table className="table table-orders">
                    <thead>
                      <tr>
                        <th className="table-orders--img"></th>
                        <th className="table-orders--name">Sản phẩm</th>
                        <th className="table-orders--quantily">Số lượng</th>
                        <th className="table-orders--price text-center">Giá tiền</th>
                      </tr>
                    </thead>
                    {this.getorderitem(order.orderItems)}
                    {/* <tbody>
                      <tr>
                        <td className="table-orders--img"><a href="#"><img src="images/loa-1.jpg" alt="img" /></a></td>
                        <td className="table-orders--name"><a href="#">Bàn phím Leopold FC980C Black Silent Topre Switches</a>
                        </td>
                        <td className="table-orders--quantily">2</td>
                        <td className="table-orders--price text-center">4.000.000 VNĐ</td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td className="table-orders--img"><a href="#"><img src="images/tainghe-1.jpg" alt="img" /></a></td>
                        <td className="table-orders--name"><a href="#">Bàn phím Leopold FC980C Black Silent Topre Switches</a>
                        </td>
                        <td className="table-orders--quantily">2</td>
                        <td className="table-orders--price text-center">4.000.000 VNĐ</td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td className="table-orders--img"><a href="#"><img src="images/tainghe.jpg" alt="img" /></a></td>
                        <td className="table-orders--name"><a href="#">Bàn phím Leopold FC980C Black Silent Topre Switches</a>
                        </td>
                        <td className="table-orders--quantily">2</td>
                        <td className="table-orders--price text-center">4.000.000 VNĐ</td>
                      </tr>
                    </tbody> */}
                    <tbody>
                      <tr className="table-orders--total">
                        <td colSpan="2" className="text-right font-weight-bold">Tổng tiền:</td>
                        <td colSpan="2" className="text-right font-weight-bold">{(order.totalPrice).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                      </tr>
                    </tbody>
                    {this.cancelbutton(order,i)}
                    {/* <tbody>
                      <tr className="table-orders--total">
                        <td colSpan ="4" className="text-center font-weight-bold">
                          <button type="button" className="btn btn-danger" onClick={this.cancelorder} cur={i}>Hủy Đơn</button></td>
                      </tr>
                    </tbody> */}
                  </table>
                </div>
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
          <div className={tab} id="orders">
            <div className="accordion" id="accordionExample">
              {oList}
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
  
export default OrdersTab;
  