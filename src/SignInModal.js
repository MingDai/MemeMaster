import React, { Component } from 'react';
import './modal.css';
import './global.css';
import firebase from './firebase.js';

class SignInModal extends Component {
    constructor(props){
        super(props);
        this.form = React.createRef();
        this.errorTxt = React.createRef();
        this.login = this.login.bind(this);
    }

    login(e){
        e.preventDefault();
        if(this.form.current.email && this.form.current.password){
            firebase.auth().signInWithEmailAndPassword(this.form.current.email.value, this.form.current.password.value)
            .then((user) => {
                this.props.history.push('/memes');
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/invalid-email') {
                    this.errorTxt.current.innerHTML = 'The email address is invalid.';
                } else if(errorCode === 'auth/user-not-found'){
                    this.errorTxt.current.innerHTML = 'There is no account tied to this email';
                } else if(errorCode === 'auth/wrong-password'){
                    this.errorTxt.current.innerHTML = "That's the wrong password";
                } else {
                    this.errorTxt.current.innerHTML = errorMessage;
                }
                console.log(error);
            })
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
                <form className="modal" ref={this.form} >
                    <span onClick={this.props.hideModal} className="floatRightContainer clickable">
                        <span>
                            &#10006;
                        </span>
                    </span>
                    <h2>Hello again!</h2>
                    <span>
                        <label htmlFor="email">Email: </label><input name="email" type="text"/>
                    </span>

                    <span>
                        <label htmlFor="password">Password: </label><input name="password" type="password"/>
                    </span>
                    <p className="errorMessage" ref={this.errorTxt}></p>
                    <button className="pushyButton" onClick={this.login}>Sign In</button>
                </form>
            </div>
        );
    }
}

export default SignInModal;