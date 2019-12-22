
// import React from 'react'
// import ReactDOM from 'react-dom'
// import './search.less'
// import logo from '../images/logo.png'

// 服务端打包

const React = require('react')
const ReactDOM = require('react-dom')
const logo = require('../images/logo.png')



class Search extends React.Component{

    render() {
        return <div >Search text no webpack, hot replacement
        <img src={logo}/>
        </div>
    }
}


module.exports = <Search />;
