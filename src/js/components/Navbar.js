import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Inbox from './Inbox'

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
    
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light bg-dark" id="ftco-navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Krowd
          </Link>
          <div>
              {this.props.accountAddress && (
                <button
                  className="btn btn-outline-warning ml-2 my-sm-0"
                  type="submit"
                >
                  {this.props.accountAddress.slice(0, 8) + '...'}
                </button>
              )}
            </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu" /> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Working">
                  How it works
                </Link>
              </li>
            </ul>
            <button
              className="btn btn-success my-2 my-sm-0"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              Create Campaign
            </button>
            <button className="btn btn-outline-success ml-2 my-sm-0" onClick={() => this.toggle()}>Inbox</button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className="inboxModal" >
            <ModalHeader toggle={this.toggle}></ModalHeader>
            <ModalBody>
              <Inbox />
            </ModalBody>
          </Modal>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
