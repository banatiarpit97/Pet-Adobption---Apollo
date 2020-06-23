import React from 'react';
import { useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {Link} from 'react-router-dom';

import LogoImage from './../../assets/images/logo.jpg';
import './index.scss';

const LOGOUT_USER = gql`
    mutation Logout{
        logout @client
    }
`

const Sidebar = () => {
    const history = useHistory();
    const [logoutMutation, {data, loading, error}] = useMutation(LOGOUT_USER, {
        update: (cache, {data}) => {
            localStorage.clear();
            cache.writeData({data: {toastOptions: {__typename: 'ToastOptions', color: 'green', message: 'Logout Successfull!!'}}})
        },
        refetchQueries:[{
            query: gql`
            query Toast1 {
                toastOptions @client {
                    color
                    message
                }
            }
        `
        }]
    })

    const logout = () => {
        logoutMutation();
        history.push('/login');
    }

    return (
        <div className="sidebar">
            <div>
                <div className="header">
                    <img src={LogoImage} alt="logo" className="logo" />
                    <h2 className="title">Pets n Pets</h2>
                </div>
                <div className="category-wrapper">
                    <Link to="/pets">
                        <h2 className="category">Pets</h2>
                    </Link>
                </div>
                <div className="category-wrapper">
                    <Link to="/customers">
                        <h2 className="category">Customers</h2>
                    </Link>
                </div>
                <div className="category-wrapper">
                    <Link to="/me">
                        <h2 className="category">Me</h2>
                    </Link>
                </div>
            </div>
            <div className="category-wrapper" onClick={logout}>
                <h2 className="category">Sign Out</h2>
            </div>
        </div>
    )
}

export default Sidebar;