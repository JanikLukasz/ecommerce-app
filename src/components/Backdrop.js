import React, { Component } from 'react';
import '../styles/backdrop.css'

class Backdrop extends Component {
    
    render() {
        return <div className='backdrop' onClick={this.props.closeCartOverlay}/>;
    }
}

export default Backdrop;