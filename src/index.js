import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lowBTCvalue: 0,
            highBTCvalue: 99999,
            error: null,
            isLoaded: false,
            messages: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            lowBTCvalue: event.target.lowBTCvalue,
            highBTCvalue: event.target.highBTCvalue
        });
    }

    handleSubmit(event) {
        console.log("handleSubmit", this.state.lowBTCvalue, this.state.highBTCvalue);
    }

    checkPrice(last) {
        console.log(last, this.state.highBTCvalue, this.state.lowBTCvalue);
        if(last > this.state.highBTCvalue) {
            notifyMe("High price alert " + last);
        }
        if(last < this.state.lowBTCvalue) {
            notifyMe("Low price alert" + last);
        }
    }

    componentDidMount(){
        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('wss://real.okex.com:10440/websocket/okexapi');
        this.connection.onmessage = evt => {
            // listen to onmessage event
            var obj = JSON.parse(evt.data);
            if(obj[0]) {
                this.checkPrice(obj[0].data.last);

            }
            // add the new message to state
            this.setState({
                messages : this.state.messages.concat([evt.data])
            });
        };
        // var senddata = {'event':'addChannel','channel':'ok_sub_spot_usd_btc_ticker','binary','1'}
        this.connection.onopen = () => {
            this.connection.send( "{'event':'addChannel','channel':'ok_sub_futureusd_btc_ticker_this_week'}" )
            // for testing: sending a message to the echo service every 2 seconds,
            // the service sends it right back
            // setInterval( _ =>{
            //     this.connection.send( Math.random() )
            // }, 1000 )

        }
    }

    render() {
        // render the messages from state:
        return (
            <div>
            <form onSubmit={this.handleSubmit}>
                <label>
                    lowBTCvalue:
                    <input type="number" value={this.state.lowBTCvalue} onChange={this.handleChange} />
                    highBTCvalue:
                    <input type="number" value={this.state.highBTCvalue} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <ul>{ this.state.messages.map( (msg, idx) => <li key={'msg-' + idx }>{ msg }</li> )}</ul>
            </div>
        );
    }
}

function notifyMe(text) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        new Notification(text);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification(text);
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

ReactDOM.render(
  <MyComponent subreddit="Test"/>,
  document.getElementById('root')
);