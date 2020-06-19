import React from 'react';
import axios from 'axios';
import isLogin from '../../Services/isLogin.js';

class UserAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : "" ,
            email:"",
            password: "",
            passwordCheck: "",
            address: null,
            phone: null,
            role: "",
            status: "",
            name: "",
            error1: "",
            success: "",
        }
        
    }
    async componentDidMount() {
        var user = await isLogin();
        axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
    }


    handleChange = (e) => {
        let inputName = e.target.name;
        this.setState({
            [inputName] : e.target.value
        })
    }

    handleSubmit = async  (e) => {
        e.preventDefault();
        try {
            await this.handleInputError();
            this.setState({
                error1 : ""
            });
        }
        catch (error_) {
            this.setState({
                error1 : error_
            })
            return 0;
        }
       
        var data = {
            'UserName': this.state.email,
            'Email': this.state.email,
            'Name': this.state.name,
            'Password': this.state.password,
            'Address': this.state.address,
            'PhoneNumber': this.state.phone,
            'Role': this.state.role,
            'Status': this.state.status,
        };

        axios.post("https://localhost:5001/api/user", data, {
            headers: {
                'Content-Type': 'application/json',
                    }
             })
             .then(result => {
                var success_ = "Tạo thành công tài khoản " + result.data.email;
                this.setState({
                    success: success_,
                })
             })
             .catch((error) => {
                if(error.response.status === 400)
                {
                    this.setState({
                        error1: "Email đã có người sử dụng",
                    })
                }
             });
    }

    handleInputError = () => {
        return new Promise((resolve, reject) => {
            if(!this.state.email.match(/^[A-Za-z0-9]+@+[a-z]+\.+[a-z]+$/) || !this.state.email){
                reject("Địa chỉ email không hợp lệ");
            }

            if(!this.state.password.match(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/) && this.state.password !== ""){
                reject("Mật khẩu ít nhất 4 chữ cái và có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số, với 1 chữ cái đặc biệt");
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
        return (
            <div>
                <div className="admin-content-title"><b>THÊM NGƯỜI DÙNG</b></div>
                <div className="admin-content">
                    <div className="admin-form">
                    {this.state.success ? (<div className="alert alert-success" role="sucess">
                        {this.state.success}
                    </div>) : null}
                    {this.showError()}
                    <form id="userAdd" name="userAdd" onSubmit={this.handleSubmit}>
                        
                        <div className="form-group row">
                            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Email</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="staticEmail" placeholder="example@gmail.com" name="email" onChange={this.handleChange} value={this.state.email || ""} />
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
                                <input type="text" className="form-control" id="Name" placeholder="Nhập họ tên" value={this.state.name || ""} onChange={this.handleChange} name="name"/>
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
                                <button className="btn btn-warning admin-form-edit-button" type="submit" form="userAdd" value="Submit" onClick={this.handleSubmit}>Tạo</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default UserAdd;