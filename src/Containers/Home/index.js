import React from 'react';

import './index.scss';
import Sidebar from '../../Components/Sidebar';
import { Switch, Route } from 'react-router-dom';
import Pets from './../Pets'

const Home = () => {
    return (
        <div className="page-wrapper">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
            <div className="main-content">
                <Switch>
                    <Route path="/pets" component={Pets} />
                    <Route path="/customers" component={Pets} />
                    <Route path="/me" component={Pets} />
                </Switch>
            </div>
        </div>
    )
}

export default Home;