import React, {Component} from 'react';
import firebase from './firebase.js'
import {Link, Route} from 'react-router-dom'

import LoggedInHeader from './LoggedInHeader.js'
import EditMeme from './EditMeme.js'

import hashCode from './hashFunc.js'
import './global.css';
import './ViewMemes.css';

class ViewMemes extends Component {
    constructor(props){
        super(props);
        this.readMemesFromDB = this.readMemesFromDB.bind(this);
        this.state = {
            store: []
        }
    }

    componentWillMount(){
        this.readMemesFromDB();
    }


    readMemesFromDB(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user){
                return firebase.database().ref('memes/' + user.uid).once('value').then((snapshot) => {
                    //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                    this.setState({store: [snapshot.val()]});
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment> 
                <LoggedInHeader history={this.props.history}/>
                <Link to={this.props.match.path + "/edit/"} className="pushyButton">Create New Meme</Link>
                <div className="gridView"> 
                    {this.state.store.map((memeObj) => (         
                        <div key={memeObj.created} className="memeCard centerColumnContainer">
                            <h4>{memeObj.title}</h4>
                            <img src={memeObj.meme}/>
                            <p>{memeObj.created}</p>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

export default ViewMemes;