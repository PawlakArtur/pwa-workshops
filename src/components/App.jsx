import React, { Fragment, Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import List from './List';
import EmptyPage from './EmptyPage';
import TabBar from './TabBar';
import ItemShow from './ItemShow';
import { AnimatedSwitch, withAnimatedWrapper } from './AnimatedRouter';

class App extends Component {
  state = {
    wines: [],
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch('https://api-wine.herokuapp.com/api/v1/wines')
      .then(res => res.json())
      .then(data => {
        this.setState({ wines: data });
      })

    };

  renderContent() {
    const AnimatedEmptyPage = withAnimatedWrapper(EmptyPage);
    const componentProps = { items: this.state.wines };

    if (!this.state.wines.length) {
      return <div />;
    }

    return (
      <Fragment>
        <AnimatedSwitch>
          <Route exact path="/" component={withAnimatedWrapper(List, componentProps)} />
          <Route path="/wine/:id" component={withAnimatedWrapper(ItemShow, componentProps)} />
          <Route path="/wishlist" component={AnimatedEmptyPage} />
          <Route path="/cellar" component={AnimatedEmptyPage} />
          <Route path="/articles" component={AnimatedEmptyPage} />
          <Route path="/profile" component={AnimatedEmptyPage} />
        </AnimatedSwitch>
        <TabBar />
      </Fragment>
    );
  }

  render() {
    return (
      <Router>
        <Fragment>
          {this.renderContent()}
        </Fragment>
      </Router>
    );
  }
}

export default App;
