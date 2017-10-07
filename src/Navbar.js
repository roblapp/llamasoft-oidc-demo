import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from  'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.renderMenu = this.renderMenu.bind(this);
  }

  handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.auth.redirectToLogin();
  }

  handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.auth.redirectToLogout();
  }

  //http://getbootstrap.com/examples/theme/
  renderMenu() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li><Link to="/Landing"><i style={{ paddingRight: "7px" }} className="fa fa-home" aria-hidden="true"></i>Landing</Link></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><Link to="/Settings"><i style={{ paddingRight: "7px" }} className="fa fa-edit" aria-hidden="true"></i>Settings</Link></li>
            <li><Link to="/Account"><i style={{ paddingRight: "7px" }} className="fa fa-id-card-o" aria-hidden="true"></i>Account</Link></li>
            <li><Link to="/Help"><i style={{ paddingRight: "7px" }} className="fa fa-question-circle-o" aria-hidden="true"></i>Help</Link></li>
            <li><a href="#" onClick={this.handleLogout}><i style={{ paddingRight: "7px" }} className="fa fa-sign-out" aria-hidden="true"></i>Sign Out</a></li>
          </ul>
          <form className="navbar-form navbar-right">
            <input type="text" className="form-control" placeholder="Search..."/>
          </form>
        </div>
      );
    }

    return (
      <div id="navbar" className="navbar-collapse collapse">
        <ul className="nav navbar-nav">
          <li><Link to="/"><i style={{ paddingRight: "7px" }} className="fa fa-home" aria-hidden="true"></i>Home</Link></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="/Help"><i style={{ paddingRight: "7px" }} className="fa fa-question-circle-o" aria-hidden="true"></i>Help</Link></li>
          <li><a href="#" onClick={this.handleLogin}><i style={{ paddingRight: "7px" }} className="fa fa-sign-in" aria-hidden="true"></i>Sign In</a></li>
        </ul>
      </div>
    );
  }

  render() {
      const menuContent = this.renderMenu();

      return (
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/"><i style={{ paddingRight: "15px" }} className="fa fa-users" aria-hidden="true"></i>React App</Link>
            </div>
              {menuContent}
          </div>
        </nav>
      );
  }
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired
};

export default Navbar;
