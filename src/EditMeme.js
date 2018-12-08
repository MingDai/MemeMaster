import React, { Component } from 'react';
import './global.css';
import './EditMeme.css';
import PIKACHU from './pikachuO.png';

import hashCode from './hashFunc.js'
import firebase from './firebase.js'
import LoggedInHeader from './LoggedInHeader.js'

class EditMeme extends Component {
    constructor(props) {
        super(props);
        this.editMemeForm = React.createRef();
        this.image = React.createRef();
        this.canvas = React.createRef();
        this.publishedResult = React.createRef();
        this.formSubmit = this.formSubmit.bind(this);
        this.publish = this.publish.bind(this);
        this.writeToDB = this.writeToDB.bind(this);
        console.log('wasup');
    }

    componentDidMount() {
        window.addEventListener('load', function() {
          document.querySelector('input[type="file"]').addEventListener('change', function() {
              if (this.files && this.files[0]) {
                  let img = document.getElementById('memePic');  // $('img')[0]
                  img.src = URL.createObjectURL(this.files[0]); // set src to file url
              }
          });
        });
    }

    publish(){
        const canvas = this.formSubmit();
        canvas.toBlob((blob) => {
            const memeURL = URL.createObjectURL(blob);
            var uniqueName = memeURL.substring(memeURL.lastIndexOf('/') + 1) + '.jpg';
            console.log(memeURL);
            console.log(uniqueName);
            const storageRef = firebase.storage().ref();
            const memeRef = storageRef.child(uniqueName);
            memeRef.put(blob).then((snapshot) => {
                return snapshot.ref.getDownloadURL();
            })
            .then((downloadURL) => {
                this.publishedResult.current.innerHTML = `<a href=${downloadURL} target="_blank">Uploaded Meme!</a>`;
                this.writeToDB(downloadURL);
                return downloadURL;
            }).catch((error) => {
                this.publishedResult.current.innerHTML = 'Failed to save! ' + error;
            });
        }, 'image/jpeg');
    }

    writeToDB(downloadURL){
        firebase.auth().onAuthStateChanged((user) => {
            if (user){
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1 // months start from 0
                const day = date.getDay()
                const hour = date.getHours();
                const minutes = date.getMinutes();

                const datetime = `${year}-${month}-${day} ${hour}:${minutes}`;
                const memeData = {
                    title: this.editMemeForm.current.title.value,
                    created: datetime,
                    caption: this.editMemeForm.current.captionText.value,
                    meme: downloadURL
                };
                firebase.database().ref('memes/' + user.uid).push().set(memeData);
            }
        });
    }

    formSubmit(){
        const canvas = this.canvas.current;
        const memeSettings = this.editMemeForm.current;
        const image = this.image.current;

        const ctx = canvas.getContext("2d");
        const wRatio = canvas.width / image.width;
        const hRatio = canvas.height / image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width*wRatio, image.height*hRatio);  

        const fontSize = ((memeSettings.fontSize.value) ? memeSettings.fontSize.value : 12);
        ctx.font =  fontSize + "px Impact";
        // Default caption position is bottom
        let caption_y = canvas.height - (canvas.height/10);
        if (memeSettings.captionPosition.value.toLowerCase() === "top"){
            caption_y = canvas.height/10 + parseInt(fontSize)/2;
        }

        ctx.strokeText(memeSettings.captionText.value, canvas.width/2, caption_y);
        ctx.textAlign = "center";
        return canvas
    }
    
    render(){
        if (this.props.match.params.uuid){
            if (parseInt(this.props.match.params.uuid) !== hashCode(this.props.memeObj.meme)) {
                return null;  // has UUID in params but is not equal to this memes UUid
            }else{
              console.log('load prexisting fields');
            }
        }
        return(
            <React.Fragment>
                <LoggedInHeader history={this.props.history}/>
                <form className="pageContent centerColumnContainer" ref={this.editMemeForm}>
                    <div className="floatLeftContainer">
                        <input className="bigInput" type="text" name="title" placeholder="Untitled Meme"/>
                    </div>
                    <div className="memeDemo">
                        <img src={PIKACHU} ref={this.image} id="memePic"/>
                        <canvas ref={this.canvas} id="memeCanvas">
                          Canvas requires a browser that supports HTML5.
                        </canvas>
                    </div>
                    <div className="editControls">
                        <div>
                            <div>
                                <label htmlFor="fileUpload">Upload Image: </label>
                                <input type="file" name="fileUpload"/>
                            </div>
    
                        </div>
                        <div>
                            <label htmlFor="captionText">Meme Caption: </label>
                                <input type="text" name="captionText"/>
                        </div>
                        <div>
                            <div>
                                <label>Position: </label>
                                <select name="captionPosition">
                                    <option value="bottom">Bottom</option>
                                    <option value="top">Top</option>
                                </select>
                            </div>
                            <div>
                                <label>Font Size: </label>
                                <input type="number" name="fontSize" placeholder="12"/>
                            </div>
                        </div>
                        <input type="button" onClick={this.formSubmit} value="Update"/>
                        <input type="button" onClick={this.publish} value="Publish"/>
                        <span ref={this.publishedResult}></span>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default EditMeme;