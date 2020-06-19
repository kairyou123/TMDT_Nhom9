import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import isLogin from '../../Services/isLogin.js';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            search: "",
            role: "All",
            filter: [],
            currentPage: 1,
            totalPage: 1,
            onePageShow: 7,
            currentUser: "",
        }

        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        try{
            var user = await isLogin();
        }
        catch(error) {
            this.props.history.push("/");
        }
        this.setState({
            currentUser: user,
        });

        if(user) {
            axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
        }
        else {

        }
        
        axios.get('https://localhost:5001/api/user', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(result => {
            
            this.setState({
                users: result.data, 
                filter: result.data,
                totalPage: Math.ceil(result.data.length/this.state.onePageShow),
            });
        });
    }

    handleChange(e) {
        this.setState({search : e.target.value})
    }

    handleChangeSelect(e) {
        this.setState({ 
            role : e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var filter_role = this.state.users.filter(user => {
            if(this.state.role === "All") {
                return user;
            }
            return user.role === this.state.role;
        });
        var filter_search = filter_role.filter((user) => {
            return  user.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 || user.email.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1;
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
            var userId = e.target.attributes.getNamedItem('data-user').value;

            axios.delete('https://localhost:5001/api/user/' + userId).then(result => {
                window.location.reload(false);
            })
            .catch(error => {
                
            });
        }
        
    }


    render() {

        const {filter, totalPage,currentPage, onePageShow} = this.state;
        var offset = onePageShow * (currentPage -1);
        let users_list = filter.slice(offset,offset + onePageShow).map((user,i) => {
            return (<tr key={i}>
            <th>{i+1}</th>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.address}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.role}</td>
            {user.status === "Ok" ? <td>Đang hoạt động</td> : <td>Ngừng hoạt động</td>}
            <td>
                <Link to={`/admin/user/${user.id}/edit`}><button className="admin-button edit"><i className="fas fa-edit" data-user={user.id}></i></button></Link>
                {user.id !== this.state.currentUser.profile.sub ?
                <button className="admin-button delete" data-user={user.id} onClick={this.DeleteButton}><i className="fas fa-trash-alt" data-user={user.id}></i></button>
                : null}
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
                <div className="admin-content-title"><b>QUẢN LÝ NGƯỜI DÙNG</b></div>
                    <div className="admin-content">
                    
                        <div className="admin-filter">
                            <div className="row">
                                <div className="col-2">
                                    <span>TÌM KIẾM</span>
                                </div>
                                <div className="col-10">
                                    <form id="search-form" name="searchForm" onSubmit={this.handleSubmit}>
                                        <input type="text" className="admin-input" name="search" value={this.state.search} onChange={this.handleChange}/>
                                        <select className="admin-select" name="role" id="role" value={this.state.role} onChange={this.handleChangeSelect}>
                                            <option value="All">Chức vụ</option>
                                            <option value="Member">Member</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                        <button className="admin-button-submit" type="submit" form="searchForm" value="Submit" onClick={this.handleSubmit}><i className="fas fa-search"></i></button>
                                    </form>
                                </div>
                                <Link to="/admin/user/add"><div className="admin-plus">
                                    <span><i className="fas fa-plus-circle"></i></span>
                                </div>
                                </Link>
                            </div>
                        </div>
                        <div className="admin-content-title-1">
                            <span className="admin-border-title-1">THÔNG TIN NGƯỜI DÙNG</span>
                        </div>
                        <div className="margin-top-20">
                        <table className="table table-striped table-condensed" width="100%">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Email</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Số điện thoại</th>
                                <th scope="col">Chức vụ</th>
                                <th scope="col">Tình trạng</th>
                                <th scope="col">Chức năng</th>
                            </tr>
                            </thead>
                            <tbody>
                                {users_list}
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
  
export default User;
  