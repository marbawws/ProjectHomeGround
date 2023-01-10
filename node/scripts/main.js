'use strict';

const e = React.createElement;

class TabHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button id={this.props.id} onClick={this.props.onClickedCallback}> {this.props.name}</button>
        );
    }
}

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active:false}
    }

    render() {
        if(this.state.active){
            return (
                <div style={{display: "block"}} id={this.props.id}>{this.props.id}</div>
            );
        } else{
            return (
                <div style={{display: "none"}} id={this.props.id} >{this.props.id}</div>
            );
        }
    }
}

class Tabs extends React.Component {
    state = {
        counter: 0,
        tabNames: [],
        tabActive:[]
    };
    handleClickedTabHeader =(id) =>{
        this.setState(prevState => ({

        }));
    };
    render() {
        return (
            <React.StrictMode>
                <div>
                    <div>
                        {[...Array(this.state.counter)].map((_, index) => (
                            <TabHeader
                                id={"reactHeader" + index}
                                index={index} key={index}
                                name={this.state.tabNames[index]}
                                onClickedCallback={this.handleClickedTabHeader(index)}
                            />
                        ))}
                        <button onClick={() => {
                            this.generateNewTab({name:"test"});
                        }}>
                            Add new tab
                        </button>
                    </div>
                    <div>
                        {[...Array(this.state.counter)].map((_, index) => (
                            <Tab
                                id={"reactTab" + index}
                                key={index}
                                name={this.state.tabNames[index]}
                                active={this.state.tabActive[index]}
                            />
                        ))}
                    </div>
                </div>
            </React.StrictMode>
        );
    }

    generateNewTab(props) {
        this.setState(prevState => ({
            counter: prevState.counter + 1,
            tabNames: [...prevState.tabNames, props.name]
        }));
    }
}

const domContainer = document.querySelector('#tabTest');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Tabs));
// Display a "Like" <button>
