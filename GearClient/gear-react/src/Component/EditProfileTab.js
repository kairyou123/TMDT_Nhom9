import React from 'react';
import axios from 'axios';

class EditProfileTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: this.props.userdata1,
        name: this.props.userdata1.name,  
        address:this.props.userdata1.address,
        phone: this.props.userdata1.phoneNumber,
        cur: this.props.cur,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({user:this.props.userdata1});
  }

  handleChange = (e) => {
    let inputName = e.target.name;
    this.setState({
        [inputName] : e.target.value
    })
  } 

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await this.handleInputError();
    }
    catch (error_) {
        alert(error_);
        return 0;
    }
    var data = this.state.user;
    data.name = this.state.name;
    data.address =this.state.address;
    data.phoneNumber = this.state.phone;

    axios.put('https://localhost:5001/api/user/' + data.id, data, {
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
      var tab= "tab-pane";
        return (
          <div className={tab} id="edit">
            <h4 className="m-y-2">Edit Profile</h4>
            <form role="form">
              <div className="form-group row">
                <label htmlFor="Name" className="col-lg-3 col-form-label form-control-label">Tên</label>
                <div className="col-lg-9">
                  <input className="form-control" name="name" onChange={this.handleChange} type="text" value={this.state.name} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="Address" className="col-lg-3 col-form-label form-control-label">Địa chỉ</label>
                <div className="col-lg-9">
                  <input className="form-control" name="address" type="text" onChange={this.handleChange} value={this.state.address}
                    placeholder="Street" />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="Phone" className="col-lg-3 col-form-label form-control-label">Số điện thoại</label>
                <div className="col-lg-9">
                  <input className="form-control" name="phone" onChange={this.handleChange} type="tel" value={this.state.phone} maxLength="10" />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-lg-3 col-form-label form-control-label"></label>
                <div className="col-lg-9">
                  <input type="reset" className="btn btn-secondary" value="Cancel" />
                  <input type="button" className="btn btn-primary" onClick={this.handleSubmit} value="Save Changes" />
                </div>
              </div>
            </form>
          </div>
        );
    }
}
  
export default EditProfileTab;
  