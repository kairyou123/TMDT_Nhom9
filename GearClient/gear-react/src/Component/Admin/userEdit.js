import React from 'react';
import axios from 'axios';
import isLogin from '../../Services/isLogin.js';

class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : "" ,
            userId: this.props.match.params.id,
            password: "",
            passwordCheck: "",
            address: null,
            phone: null,
            role: "",
            status: "",
            name: "",
            error1: "",
        }
        
    }
    async componentDidMount() {
        var user = await isLogin();
        var user_ = await this.getUser(user.access_token);

        if(user_) {
            this.setState({
                user: user_,
                address: user_.address,
                phone: user_.phoneNumber,
                role: user_.role,
                status: user_.status,
                name: user_.name,
            })
        }
        

    }

    getUser = (access_token) => {
        console.log(access_token);
        return new Promise((resolve, reject) => {
            
            axios.defaults.headers.common = {'Authorization': `Bearer ${access_token}`};
            axios.get('https://localhost:5001/api/user/' + this.state.userId).then(result => {
               resolve(result.data);
            })
            .catch(error => {
               reject(error);
            });
        })
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
            this.setState({
                error1 : error_
            })
            return 0;
        }
       
        var data = {
            'Name': this.state.name,
            'Password': this.state.password,
            'Address': this.state.address,
            'PhoneNumber': this.state.phone,
            'Role': this.state.role,
            'Status': this.state.status,
        };
        axios.put('https://localhost:5001/api/user/' + this.state.userId, data, {
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
            if(!this.state.password.match(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/) && this.state.password !== ""){
                reject("Mật khẩu ít nhất 4 chữ cái và có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số");
            }

            if(this.state.passwordCheck !== this.state.password){
                reject("Mật khẩu không khớp");
            }
            
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

    showError = () => {
        if(this.state.error1 !== "") {
            return (
                <div className="alert alert-danger" role="alert">
                    {this.state.error1}
                </div>
            )
        
        }
    }


    render() {
        const {user} = this.state;
        return (
            <div>
                <div className="admin-content-title"><b>SỬA ĐỔI NGƯỜI DÙNG</b></div>
                <div className="admin-content">
                    <div className="admin-form">
                    {this.showError()}
                    <form id="userEdit" name="userEdit" onSubmit={this.handleSubmit}>
                        
                        <div className="form-group row">
                            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Email</label>
                            <div className="col-sm-8">
                                <input type="text" readOnly disabled className="form-control" id="staticEmail" value={this.state.user.email || ""} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputPassword" className="col-sm-3 col-form-label">Mật khẩu</label>
                            <div className="col-sm-8">
                                <input type="password" className="form-control" id="inputPassword" placeholder="Mật khẩu" name="password" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="confirmPassword" className="col-sm-3 col-form-label">Nhập lại mật khẩu</label>
                            <div className="col-sm-8">
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Nhập lại mật khẩu" name="passwordCheck" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Name" className="col-sm-3 col-form-label">Tên</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="Name" value={this.state.name || ""} onChange={this.handleChange} name="name"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Address" className="col-sm-3 col-form-label">Địa chỉ</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="Address" placeholder="Địa chỉ" onChange={this.handleChange} value={this.state.address || ""} name="address" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Phone" className="col-sm-3 col-form-label">Số điện thoại</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" id="Phone" placeholder="Số điện thoại"  value={this.state.phone || ""} onChange={this.handleChange} name="phone"  />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Role" className="col-sm-3 col-form-label">Chức vụ</label>
                            <div className="col-sm-8" id="Role">
                                <select className="form-control" value={this.state.role} name="role" onChange={this.handleChange} >
                                    <option value="Member">Member</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Status" className="col-sm-3 col-form-label">Tình trạng</label>
                            <div className="col-sm-8">
                                <select className="form-control" id="Status" value={this.state.status} name="status" onChange={this.handleChange} >
                                    <option value="Ok">Đang hoạt động</option>
                                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="admin-form-edit-button">
                                <button className="btn btn-warning admin-form-edit-button" type="submit" form="userEdit" value="Submit" onClick={this.handleSubmit}>Sửa</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default UserEdit;