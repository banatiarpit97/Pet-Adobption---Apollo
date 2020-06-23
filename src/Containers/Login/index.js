import React, { useState } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './index.scss';
import DogImage from './../../assets/images/dog.png';
import CatImage from './../../assets/images/cat.png';
import RabbitImage from './../../assets/images/rabbit.png';
import { useHistory } from 'react-router-dom';

const LOGIN_USER = gql`
    mutation Login($username : ID!, $password: String!) {
        logIn(username: $username, password: $password) {
            customer {
                username
                name                
            }
            token
        }
    }
`;

const REGISTER_USER = gql`
    mutation Register($input : CreateAccountInput!) {
        createAccount(input: $input) {
            name,
            username,
        }
    }
`

const Login = () => {
    const [formType, setFormType] = useState('login');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    let history = useHistory();

    // const [errorState, setErrorState] = useState('');

    const [register, {data: registerData, loading: registerLoading, error: registerError}] = useMutation(REGISTER_USER, {
        onError: e => {
            console.log(e.message)
            // setErrorState(e.message)
        },
        onCompleted: (registerData) => {
            console.log(registerData)
            setFormType('login');
            setUsername(registerData.createAccount.username);
            setPassword(password);
        },
        update: (cache, {data}) => {
            cache.writeData({data: {__typename: 'ToastOptions', color: 'green', message: 'Registration Successfull!!'}})
        }
    });

    const [login, {data: loginData, loading: loginLoading, error: loginError}] = useMutation(LOGIN_USER, {
        onError: e => {
            console.log(e.message)
            // setErrorState(e.message)
        },
        onCompleted: (data) => {
            localStorage.setItem('authToken', data.logIn.token);
            history.push("/pets");
        },
        update: (cache, {data}) => {
            cache.writeData({data: {toastOptions: {__typename: 'ToastOptions', color: 'green', message: 'Login Successfull!!'}}})
        }
    });


    const submitForm = () => {
        if(formType === 'login'){
            login({variables: {username, password}})
        } else if(formType === 'register'){
            register({variables: {input :{name, username, password}}});
        }
    }
    return (
        <div className="background">
            <div className="wrapper-card">
                <div className="intro">

                    <div>
                        <div className="pet-img-wrapper">
                            <img src={DogImage} className="pet-img" alt="dog"/>
                            <img src={CatImage} className="pet-img" alt="cat"/>
                            <img src={RabbitImage} style={{height: 100, width: 100, marginLeft: 20}} alt="rabbit" />
                        </div>
                        <h1 className="intro-heading">
                            { formType === 'login' ? 'Welcome Back!' : 'Welcome Aboard!'}
                        </h1>
                        <p className="intro-text">Are you looking for a pet? Worry no more, you have come to the right place.</p>
                        <p className="intro-text">Why Buy a pet when you can adopt one easily.</p>
                        <p className="intro-text">So what are you waiting for! Go ahead and adopt a <span className="line-through">pet</span> friend for you.</p>
                    </div>


                    <div onClick={() => setFormType('login')} className={`badge login ${formType === 'login' && 'selected'}`}>LOGIN</div>
                    <div onClick={() => setFormType('register')} className={`badge register ${formType === 'register' && 'selected'}`}>REGISTER</div>
                </div>
                <div className="form">
                    <h1 className="form-heading">
                        { formType === 'login' ? 'LOGIN' : 'REGISTER'}
                    </h1>
                    {formType === 'register' && <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>}
                    <input type="text" placeholder="Username" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    {(registerError || loginError) && <p className="error">{(registerError || loginError)?.message}</p>}
                    <button onClick={submitForm} disabled={registerLoading || loginLoading || !username || !password || (formType === 'register' && !name)}>
                        Sign { formType === 'login' ? 'In' : 'Up'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;