import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {ApolloProvider} from '@apollo/react-hooks'; 

import client from './Graphql/index';
import Login from './Containers/Login';
import Home from './Containers/Home';
import Toast from './Components/Toast';

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client} >
        <Toast />
        <Switch>
          <Route path="/login" component={Login} exact/>
          <Route path={['/pets', '/customers', '/me']} component={Home} exact/>
          <Route component={Login} exact/>   {/*fallback*/}
        </Switch>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
