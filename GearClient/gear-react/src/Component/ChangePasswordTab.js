import React from 'react';
import axios from 'axios';

class ChangePasswordTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: this.props.userdata2,
        password: "",
        passwordCheck: "",
        cur: this.props.cur,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({user:this.props.userdata2});
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
    data.password = this.state.password;

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
      if(this.state.password == "")
        {
          reject("Mật khẩu không được để trống ");
        }
        
      if(!this.state.password.match(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/) && this.state.password !== ""){
        reject("Mật khẩu ít nhất 4 chữ cái và có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số, với 1 chữ cái đặc biệt");
      }

      if(this.state.passwordCheck !== this.state.password){
        reject("Mật khẩu không khớp");
      }

        resolve("ok");
    })  
  }
    render() {
      var tab= "tab-pane";
        return (
          <div className={tab} id="pass">
            <h4 className="m-y-2">Change Password</h4>
            <form role="form">
              <div className="form-group row">
                <label htmlFor="NewPw" className="col-lg-3 col-form-label form-control-label">Mật khẩu mới</label>
                <div className="col-lg-9">
                  <input className="form-control" type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="********"/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="NewPwAgain" className="col-lg-3 col-form-label form-control-label">Nhập lại mật khẩu</label>
                <div className="col-lg-9">
                  <input className="form-control" type="password" name="passwordCheck" onChange={this.handleChange} value={this.state.passwordCheck} placeholder="********"/>
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
  
export default ChangePasswordTab;
  