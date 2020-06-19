import React from 'react';
import axios from 'axios';
import isLogin from '../../../Services/isLogin.js';

class CatalogAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
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
            'Name': this.state.name,
            'Description': this.state.description,
        };

        axios.post("https://localhost:5001/api/catalog", data, {
            headers: {
                'Content-Type': 'application/json',
                    }
             })
             .then(result => {
                var success_ = "Tạo thành công chủng loại " + result.data.name;
                this.setState({
                    success: success_,
                });
        });
    }

    handleInputError = () => {
        return new Promise((resolve, reject) => {
            if(!this.state.name){
                reject("Tên không được để trống");
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
                <div className="admin-content-title"><b>THÊM CHỦNG LOẠI</b></div>
                <div className="admin-content">
                    <div className="admin-form">
                    {this.state.success ? (<div className="alert alert-success" role="sucess">
                        {this.state.success}
                    </div>) : null}
                    {this.showError()}
                    <form id="catalogAdd" name="catalogAdd" onSubmit={this.handleSubmit}>
                        
                        <div className="form-group row">
                            <label htmlFor="Name" className="col-sm-3 col-form-label">Tên</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="Name" defaultValue={this.state.name || ""} onChange={this.handleChange} name="name"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Description" className="col-sm-3 col-form-label">Mô tả</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" cols="4" rows="5" name="description" value={this.state.description || ""} onChange={this.handleChange}></textarea>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="admin-form-edit-button">
                                <button className="btn btn-warning admin-form-edit-button" type="submit" form="catalogAdd" value="Submit" onClick={this.handleSubmit}>Tạo</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default CatalogAdd;