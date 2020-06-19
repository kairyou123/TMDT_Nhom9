import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import isLogin from '../../../Services/isLogin.js';

class Manufactuer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            manufactuers: [],
            search: "",
            filter: [],
            currentPage: 1,
            totalPage: 1,
            onePageShow: 7,
            currentUser: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        var user = await isLogin();

        this.setState({
            currentUser: user,
        });

        if(user) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
        }
        else {

        }
        
        axios.get('https://localhost:5001/api/producer').then(result => {
            this.setState({
                manufactuers: result.data, 
                filter: result.data,
                totalPage: Math.ceil(result.data.length/this.state.onePageShow),
            });
        });
    }

    handleChange(e) {
        this.setState({search : e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var filter_search = this.state.manufactuers.filter((manufactuer) => {
            return  manufactuer.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1;
        });
        this.setState({
            filter: filter_search,
            currentPage: 1,
            totalPage: Math.ceil(filter_search.length / this.state.onePageShow),
        })
    }

    goToPage = (e) => {
        this.setState({
            currentPage: e.target.attributes.getNamedItem('data-page').value,
        })

        

    }

    DeleteButton = (e) => {
        var choice = window.confirm("Bạn có chắc chắn muốn xóa?");

        if(choice) {
            var manufactuerId = e.target.attributes.getNamedItem('data-manufactuer').value;

            axios.delete('https://localhost:5001/api/producer/' + manufactuerId).then(result => {
                window.location.reload(false);
            })
            .catch(error => {
                
            });
        }
        
    }


    render() {

        const {filter, totalPage,currentPage, onePageShow} = this.state;
        var offset = onePageShow * (currentPage -1);
        let manufactuers_list = filter.slice(offset,offset + onePageShow).map((manufactuer,i) => {
            return (<tr key={i}>
            <th>{i+1}</th>
            <td>{manufactuer.name}</td>
            <td>{manufactuer.description}</td>
            <td>
                <Link to={`/admin/manufactuer/${manufactuer.id}/edit`}><button className="admin-button edit"><i className="fas fa-edit" data-manufactuer={manufactuer.id}></i></button></Link>
                <button className="admin-button delete" data-manufactuer={manufactuer.id} onClick={this.DeleteButton}><i className="fas fa-trash-alt" data-manufactuer={manufactuer.id}></i></button>
            </td>
            </tr>);
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
            <div>
                <div className="admin-content-title"><b>QUẢN LÝ HÃNG SẢN XUẤT</b></div>
                    <div className="admin-content">
                    
                        <div className="admin-filter">
                            <div className="row">
                                <div className="col-2">
                                    <span>TÌM KIẾM</span>
                                </div>
                                <div className="col-10">
                                    <form id="search-form" name="searchForm" onSubmit={this.handleSubmit}>
                                        <input type="text" className="admin-input" name="search" value={this.state.search} onChange={this.handleChange}/>
                                        <button className="admin-button-submit" type="submit" form="searchForm" value="Submit" onClick={this.handleSubmit}><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                                <Link to="/admin/manufactuer/add"><div className="admin-plus">
                                    <span><i className="fas fa-plus-circle"></i></span>
                                </div>
                                </Link>
                            </div>
                        </div>
                        <div className="admin-content-title-1">
                            <span className="admin-border-title-1">THÔNG TIN HÃNG SẢN XUẤT</span>
                        </div>
                        <div className="margin-top-20">
                        <table className="table table-striped table-condensed" width="100%">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Chức năng</th>
                            </tr>
                            </thead>
                            <tbody>
                                {manufactuers_list}
                            </tbody>
                        </table>
                        </div>
                        <div className="admin-pagination">
                        <ul className="pagination pagination-centered">
                            {pagination}
                        </ul>
                        </div>
                    </div>
            </div>
        )
    }
}
  
export default Manufactuer;
  