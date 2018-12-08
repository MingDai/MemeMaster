import React, {Component} from 'react';

import firebase from './firebase.js'

class LoggedInHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: ''
        };
        this.logout = this.logout.bind(this)
    }

    componentWillMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                const user = firebase.auth().currentUser;
                this.setState({email: user.email})
            }else{
                alert('please sign in');
            }
        });
    }

    logout(){
        firebase.auth().signOut().then(function() {
            this.props.history.push('/');
        }).catch(function(error) {
          // An error happened.
        });
    }

    render(){
        return(
            <header className="helloBanner">
                <h4>Hi {this.state.email}!</h4>
                <button className="noMargins" onClick={this.logout}>Logout</button>
            </header>
        )
    }
}

export default LoggedInHeader