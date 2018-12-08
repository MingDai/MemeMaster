import React, { Component } from 'react';
import './modal.css';
import './global.css';

import firebase from './firebase.js';

class SignUpModal extends Component {
    constructor(props){
        super(props);
        this.form = React.createRef();
        this.errorTxt = React.createRef();
        this.newUser = this.newUser.bind(this);
    }

    newUser(e){
        e.preventDefault();
        if(this.form.current.email && this.form.current.password && this.form.current.confirmPass){
            if (this.form.current.password.value === this.form.current.confirmPass.value){
                firebase.auth().createUserWithEmailAndPassword(
                    this.form.current.email.value, this.form.current.password.value)
                    .then((user) => {
                        this.props.history.push('/memes');
                    })
                    .catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/weak-password') {
                        this.errorTxt.current.innerHTML = 'The password is mad weak.';
                    } else if(errorCode === 'auth/email-already-in-use'){
                        this.errorTxt.current.innerHTML = 'The email is already in use.';
                    } else {
                        this.errorTxt.current.innerHTML = errorMessage;
                    }
                    console.log(error);
                });
            }else{
                this.errorTxt.current.innerHTML = 'The two passwords do not match.';
            }
        }
    }

    render() {
        if(this.props.status){
            this.showHideToggle = "background display-flex";
        }else{
            this.showHideToggle = "background display-none";
        }
        return (
            <div className={this.showHideToggle}>
                <form className="modal" ref={this.form}>
                    <span onClick={this.props.hideModal} className="floatRightContainer clickable">
                        <span>
                            &#10006;
                        </span>
                    </span>
                    <h2>Welcome to MemeMaster!</h2>
                    <span>
                        <label htmlFor="email">Email: </label><input name="email" type="text"/>
                    </span>

                    <span>
                        <label htmlFor="password">Password: </label><input name="password" type="password"/>
                    </span>
                    <span>
                        <label htmlFor="confirmPass">Confirm Password: </label><input name="confirmPass" type="password"/>
                    </span>
                    <p className="errorMessage" ref={this.errorTxt}></p>
                    <button className="pushyButton" onClick={this.newUser}>Sign Up</button>
                </form>
            </div>
        );
    }
}

export default SignUpModal;