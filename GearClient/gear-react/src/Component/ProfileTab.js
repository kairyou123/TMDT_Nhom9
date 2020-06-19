import React from 'react';

class ProfileTab extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          currentUser: this.props.user1,
          cur : this.props.cur,
      }

      this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){}

    componentDidMount(){

    }

    render() {
        var tab = "tab-pane active profile";
        if(this.state.cur === "order")
          tab = "tab-pane profile";
        return (
          <div className={tab} id="profile">
            <form role="form">
              <div className="form-group row">
                <label htmlFor="Name" className="col-lg-3 col-form-label form-control-label">Tên</label>
                <div className="col-lg-9">
                <p className="p-d">{this.state.currentUser.name}</p>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="Email" className="col-lg-3 col-form-label form-control-label">Email</label>
                <div className="col-lg-9">
                  <p className="p-d">{this.state.currentUser.email}</p>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="Address" className="col-lg-3 col-form-label form-control-label">Địa chỉ</label>
                <div className="col-lg-9">
                  <p className="p-d">{this.state.currentUser.address}</p>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="Phone" className="col-lg-3 col-form-label form-control-label">Số điện thoại</label>
                <div className="col-lg-9">
                  <p className="p-d">{this.state.currentUser.phoneNumber}</p>
                </div>
              </div>
            </form>
          </div>
        );
    }
}
  
export default ProfileTab;
  