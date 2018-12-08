import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import './global.css';

import SignInModal from './SignInModal.js'
import SignUpModal from './SignUpModal.js'
import ViewMemes from './ViewMemes.js'
import EditMeme from './EditMeme.js'


class App extends Component {
    constructor(props){
    super(props);
    this.state = {
        signInModalOpen: false,
        signUpModalOpen: false
    };
    this.showSignIn = this.showSignIn.bind(this);
    this.hideSignIn = this.hideSignIn.bind(this);

    this.showSignUp = this.showSignUp.bind(this);
    this.hideSignUp = this.hideSignUp.bind(this);
    }

    showSignIn() {
        this.setState({signInModalOpen: true});
    }

    hideSignIn() {
        this.setState({signInModalOpen: false});
    }

    showSignUp() {
        this.setState({signUpModalOpen:true});
    }  

    hideSignUp() {
        this.setState({signUpModalOpen:false});
    }

    render() {
        return (
            <Switch>
                <Route exact path={"/"} render={(history) => (
                    <div className="App">
                        <SignInModal 
                          status={this.state.signInModalOpen}
                          hideModal={this.hideSignIn}
                          {...history}
                        />

                        <SignUpModal
                          status={this.state.signUpModalOpen}
                          hideModal={this.hideSignUp}
                          {...history}
                        />
                        <header className="App-header">
                          <div className="floatRightContainer">
                            <button className="pushyButton" onClick={this.showSignIn}>Sign In</button>
                            <button className="pushyButton dark" onClick={this.showSignUp}>Sign Up</button>
                          </div>
                          <h1> Meme<span className="yellow">Master</span></h1>
                          <img src={logo} className="App-logo" alt="logo" />
                          <p className="yellow">
                            :o
                          </p>
                        </header>
                    </div>
                )}/>
                <Route exact path={"/memes"} render={(props)=>(
                    <ViewMemes {...props}/>
                )}/>
                <Route exact path={"/memes/edit"} render={(props)=>(
                    <EditMeme {...props}/>
                )}/>
            </Switch>
        );
    }
}

export default App;
