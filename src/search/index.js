document.write('search page')

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from '../images/logo.png'


class Search extends React.Component{

    render() {
        return <div >Search text no webpack, hot replacement
        <img src={logo}/>
        </div>
    }
}


ReactDOM.render(
    <Search />,
        document.getElementById("root")

);
