document.write('search page')

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from '../images/logo.png'

import '../../commons/index'

import {a} from './tree-shaking'
if (false) {
    b()
}
class Search extends React.Component{

    render() {
        const functionA = a();
        return <div > { functionA }Search text no webpack, hot replacement
        <img src={logo}/>
        </div>
    }
}


ReactDOM.render(
    <Search />,
        document.getElementById("root")

);
