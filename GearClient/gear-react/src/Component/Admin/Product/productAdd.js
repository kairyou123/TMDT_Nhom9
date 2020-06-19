import React from 'react';
import axios from 'axios';
import isLogin from '../../../Services/isLogin.js';
import CKEditor from 'react-ckeditor-component';

class ProductAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogs: [],
            manufactuers: [],
            srcImage: "",
            srcSubImage: "",
            image: undefined,
            subImage: undefined,
            name: "",
            price: null,
            discount: null,
            description: "",
            stock: null,
            catalog: 1,
            manufactuer: 1,
            error1: "",
            success: "",
        }
        
    }
    async componentDidMount() {
        var user = await isLogin();
        axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
        this.getData();
    }

    getData = () => {
        Promise.all([axios.get('https://localhost:5001/api/catalog'),
                    axios.get('https://localhost:5001/api/producer')]
        ).then(result => {
            this.setState({
                catalogs: result[0].data,
                manufactuers: result[1].data, 
            });
            
        })

        
        
    }

    handleChange = (e) => {
        let inputName = e.target.name;
        this.setState({
            [inputName] : e.target.value
        })
    }

    handleChangeFile = (e) => {
        this.previewImage();
        let inputName = e.target.name;
        this.setState({
            [inputName] : e.target.files,
        })

    }

    previewImage = () => {
        var file = this.refs.image.files[0];
        var file1 = this.refs.image1.files[0];

        if(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                this.setState({
                    srcImage: reader.result
                })
            }
        }
        else {
            this.setState({
                srcImage: undefined,
            })
        }

        if(file1) {
            var reader1 = new FileReader();
            reader1.readAsDataURL(file1);
            reader1.onloadend = () => {
                this.setState({
                    srcSubImage: reader1.result
                });
            }
        }
        else {
            this.setState({
                srcSubImage: undefined,
            })
        }
        
    }

    onEditorChange = (e) => {
        this.setState( {
            description: e.editor.getData()
        } );
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
        if(this.state.image && this.state.image.length !== 0)
        {
            var form_data = new FormData();
            form_data.append("file", this.state.image[0]);
            var result = await axios.post('https://localhost:5001/api/product/image', form_data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
                
            this.setState({
                image: result.data[0],
            });
        }

        if(this.state.subImage && this.state.subImage.length !== 0)
        {
            var form_data = new FormData();
            form_data.append("file", this.state.subImage[0]);
            var result = await axios.post('https://localhost:5001/api/product/image', form_data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
                
            this.setState({
                subImage: result.data[0],
            });
        }

        var image = (this.state.image !== "" && typeof this.state.image === 'string') ? this.state.image : null;
        var subImage = (this.state.subImage !== "" && typeof this.state.subImage === 'string') ? this.state.subImage : null;
        var data = {
            'Name': this.state.name,
            'Image': image,
            'SubImage': subImage,
            'Price': parseInt(this.state.price),
            'Discount': parseInt(this.state.discount),
            'CatalogID': parseInt(this.state.catalog),
            'ProducerID': parseInt(this.state.manufactuer),
            'Stock': parseInt(this.state.stock),
            'Description': this.state.description,
        };
        axios.post('https://localhost:5001/api/product/', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
        })
        .then(result => {
            this.props.history.push('/admin/product');
        })
        .catch(error => {
              console.log(error);
        });
    }

    handleInputError = () => {
        return new Promise((resolve, reject) => {
            if(!this.state.image || this.state.image.length === 0) {
                reject("Hình ảnh chính không được rỗng");
            }
            if(!this.state.name){
                reject("Tên không được để trống");
            }

            if(!this.state.price){
                reject("Giá không được để trống");
            }
            
            if(!this.state.discount){
                reject("Giảm giá không được để trống (nếu không có giảm sẽ là 0)");
            }

            if(!this.state.stock){
                reject("Tồn kho không được để trống");
            }

            if(!this.state.description){
                reject("Mô tả không được để trống");
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
        const {catalogs, manufactuers, srcSubImage, srcImage} = this.state;
        var catalogs_select = catalogs.map((catalog, i) => {
            return <option value={catalog.id} key={i}>{catalog.name}</option>
        });

       var manufactuers_select = manufactuers.map((manufactuer, i) => {
           return <option value={manufactuer.id} key={i}>{manufactuer.name}</option>
        });
        var Image = (srcImage) ? <img src={srcImage} width="100px" height="100px"></img> : null;
        var SubImage = (srcSubImage) ? <img src={srcSubImage} width="100px" height="100px"></img> : null;
        return (
            <div>
                <div className="admin-content-title"><b>THÊM SẢN PHẨM</b></div>
                <div className="admin-content">
                    <div className="admin-form">
                    {this.state.success ? (<div className="alert alert-success" role="sucess">
                        {this.state.success}
                    </div>) : null}
                    {this.showError()}
                    <form id="productEdit" name="productEdit" onSubmit={this.handleSubmit}>
                        
                        <div className="form-group row">
                            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Hình ảnh</label>
                            <div className="col-sm-8">
                                {Image}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-4">
                                <input type="file" id="customFile" name="image" ref="image" onChange={this.handleChangeFile}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Hình ảnh khác</label>
                            <div className="col-sm-8">
                                {SubImage}
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-4">
                                    <input type="file" id="customFile" name="subImage" ref="image1" onChange={this.handleChangeFile}/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="Name" className="col-sm-3 col-form-label">Tên</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="Name" placeholder="Nhập tên sản phẩm" value={this.state.name || ""} onChange={this.handleChange} name="name"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="price" className="col-sm-3 col-form-label">Giá gốc</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" id="price" placeholder="Nhập giá gốc sản phẩm" onChange={this.handleChange} value={this.state.price || ""} name="price" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="discount" className="col-sm-3 col-form-label">Giảm giá (%)</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" id="discount" placeholder="Nhập phần trăm giảm giá"  value={this.state.discount || ""} onChange={this.handleChange} name="discount"  />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="stock" className="col-sm-3 col-form-label">Tồn kho</label>
                            <div className="col-sm-8">
                                <input type="number" className="form-control" id="stock" placeholder="Nhập giá trị tồn kho"  value={this.state.stock || ""} onChange={this.handleChange} name="stock"  />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-3 col-form-label">Mô tả</label>
                            <div className="col-sm-8">
                                <CKEditor config={{height: 300}} content={this.state.description} data={this.state.description} events={{"change": this.onEditorChange}} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="catalog" className="col-sm-3 col-form-label">Chủng loại</label>
                            <div className="col-sm-8" id="catalog">
                                <select className="form-control" value={this.state.catalog} name="catalog" onChange={this.handleChange} >
                                    {catalogs_select}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="manufactuer" className="col-sm-3 col-form-label">Hãng sản xuất</label>
                            <div className="col-sm-8" id="manufactuer">
                                <select className="form-control" value={this.state.manufactuer} name="manufactuer" onChange={this.handleChange}>
                                    {manufactuers_select}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="admin-form-edit-button">
                                <button className="btn btn-warning admin-form-edit-button" type="submit" form="userEdit" value="Submit" onClick={this.handleSubmit}>Thêm</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProductAdd;