import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            messages: []
        };
    }

    componentDidMount(){
        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('wss://real.okex.com:10440/websocket/okexapi');
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                messages : this.state.messages.concat([ evt.data ])
            })
            console.log(evt)
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
        return <ul>{ this.state.messages.map( (msg, idx) => <li key={'msg-' + idx }>{ msg }</li> )}</ul>;
    }
}

ReactDOM.render(
  <MyComponent subreddit="Test"/>,
  document.getElementById('root')
);