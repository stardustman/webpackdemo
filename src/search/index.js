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

    constructor() {
        super(...arguments)
        this.state = {
            Text: null
        } 
    }

    // 懒加载
    loadComponent() {
        import('./text.js').then((Text)=> {
            this.setState({
                Text: Text.default
            })
        });
    }

    render() {
        const functionA = a();
        const {Text} = this.state
        return <div >
            {
                Text ? <Text/> : null
            }
            {functionA} Search text no webpack, hot replacement
        <img src={logo} onClick={this.loadComponent.bind(this)}/>
        </div>
    }
}


ReactDOM.render(
    <Search />,
        document.getElementById("root")

);
