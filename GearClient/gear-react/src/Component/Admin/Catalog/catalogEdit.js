import React from 'react';
import axios from 'axios';
import isLogin from '../../../Services/isLogin.js';

class CatalogEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catalog: "" ,
            catalogId: this.props.match.params.id,
            name: "",
            description: "",
            error1: "",
        }
        
    }
    async componentDidMount() {
        var user = await isLogin();
        var catalog_ = await this.getCatalog(user.access_token);

        if(catalog_) {
            this.setState({
                catalog: catalog_,
                name: catalog_.name,
                description: catalog_.description,
            })
        }
        

    }

    getCatalog = (access_token) => {
        return new Promise((resolve, reject) => {
            axios.defaults.headers.common = {'Authorization': `Bearer ${access_token}`};
            axios.get('https://localhost:5001/api/catalog/' + this.state.catalogId).then(result => {
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
            'Id': parseInt(this.state.catalogId),
            'Name': this.state.name,
            'Description': this.state.description,
        };
        axios.put('https://localhost:5001/api/catalog/' + this.state.catalogId, data, {
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
                <div className="admin-content-title"><b>SỬA ĐỔI CHỦNG LOẠI</b></div>
                <div className="admin-content">
                    <div className="admin-form">
                    {this.showError()}
                    <form id="catalogEdit" name="catalogEdit" onSubmit={this.handleSubmit}>
                    
                        <div className="form-group row">
                            <label htmlFor="Name" className="col-sm-3 col-form-label">Tên</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="Name" value={this.state.name || ""} onChange={this.handleChange} name="name"/>
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
                                <button className="btn btn-warning admin-form-edit-button" type="submit" form="catalogEdit" value="Submit" onClick={this.handleSubmit}>Sửa</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default CatalogEdit;