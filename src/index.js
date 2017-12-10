import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const Echo = React.createClass({
    getInitialState(){
        return { messages : [] }
    },
    componentDidMount(){
        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('wss://echo.websocket.org');
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                messages : this.state.messages.concat([ evt.data ])
            })
        };

        // for testing: sending a message to the echo service every 2 seconds,
        // the service sends it right back
        setInterval( _ =>{
            this.connection.send( Math.random() )
        }, 2000 )
    },
    render: function() {
        // render the messages from state:
        return <ul>{ this.state.messages.map( (msg, idx) => <li key={'msg-' + idx }>{ msg }</li> )}</ul>;
    }
});

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        axios.get("https://www.okex.com/api/v1/future_ticker.do?symbol=btc_usd&contract_type=quarter")
            // .then(res => res.json())
            .then(
                (result) => {
                	console.log(result);
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.ticker}
                </ul>
            );
        }
    }
}

ReactDOM.render(
  <MyComponent subreddit="Test"/>,
  document.getElementById('root')
);