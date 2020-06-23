import React, { useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import './index.scss';

const GET_TOAST_OPTIONS = gql`
    query Toast {
        toastOptions @client {
            color
            message
        }
    }
`;


const Toast = () => {
    const toastRef = useRef();
    const {data, loading, error} = useQuery(GET_TOAST_OPTIONS);
    console.log(data?.toastOptions);
    
    useEffect(() => {
        if(toastRef.current){
            toastRef.current.style.animation = 'toastEnter 1s linear'
            setTimeout(() => {
                toastRef.current.style.animation = 'toastLeave 1s linear'
            }, 3000)
        }
    }, [data])

    return (
        data?.toastOptions?.message ? (<div className="wrapper" ref={toastRef}>
            <p className="text">{data.toastOptions.message}</p>
        </div>) : null
    )
}

export default Toast