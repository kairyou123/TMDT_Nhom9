import React from 'react';

class ProductTab extends React.Component {
    render() {
        return (
          <div className="detail-tab">
              <ul className="nav nav-tabs m-0" role="tablist">
                {/* <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#home">Bình luận</a>
                </li> */}
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu1">Mô tả sản phẩm </a>
                </li>
              </ul>
              <div className="tab-content">
                {/* <div id="home" className="container tab-pane active"><br />
                  <div className="tab-pane-cmt">
                    <div className="detailBox">
                      <div className="actionBox">
                        <ul className="commentList">
                          <li>
                            <div className="commenterImage">
                              <img src="http://placekitten.com/50/50" />
                            </div>
                            <div className="commentText">
                              <p className="">Hello this is a test comment.</p> <span className="date sub-text">on March 5th,
                                2014</span>
                            </div>
                          </li>
                          <li>
                            <div className="commenterImage">
                              <img src="http://placekitten.com/45/45" />
                            </div>
                            <div className="commentText">
                              <p className="">Hello this is a test comment and this comment is particularly very long and it goes
                                on
                                and on and on.</p> <span className="date sub-text">on March 5th, 2014</span>
                            </div>
                          </li>
                          <li>
                            <div className="commenterImage">
                              <img src="http://placekitten.com/40/40" />
                            </div>
                            <div className="commentText">
                              <p className="">Hello this is a test comment.</p> <span className="date sub-text">on March 5th,
                                2014</span>
                            </div>
                          </li>
                        </ul>
                        <form className="form-inline" role="form">
                          <div className="form-group">
                            <input className="form-control" type="text" placeholder="Your comments" />
                          </div>
                          <div className="form-group">
                            <button className="btn btn-primary">Add</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div id="home" className="container tab-pane active"><br />
                {/* <div id="menu1" className="container tab-pane fade"><br /> */}
                  <h3>{this.state.product.name}</h3>
                  <p>{this.state.product.description}</p>
                </div>         
              </div>
            </div>
        );
    }
}
  
export default ProductTab;
  