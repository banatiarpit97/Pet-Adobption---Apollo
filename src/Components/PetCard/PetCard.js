import React, { useState, useEffect, useRef } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

import DoneImage from './../../assets/images/giphy.webp';
import './index.scss';

const CHECKOUT_PET = gql`
    mutation Checkout($id: ID!){
        checkOut(id: $id){
            pet{
                id,
                name,
                photo{
                    full
                }
                weight,
                status,
                type: __typename
            }
        }
    }
`

const PetCard = ({
    pet
}) => {
    const progress = useRef();
    const [done, setDone] = useState(false);

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutMutation, {data, loading, error}] = useMutation(CHECKOUT_PET, {
        onError: (e) => {
            console.log(e.message)
            // cache.writeData({data: {toastOptions: {__typename: 'ToastOptions', color: 'red', message: e.message}}})
        },
        onCompleted: (data) => {
            console.log(data)
            setDone(true);
            setTimeout(() => {
                setDone(false)
            }, 2000)
        },
        update: (cache, {checkout}) => {
            cache.writeData({data: {toastOptions: {__typename: 'ToastOptions', color: 'green', message: checkout?.pet?.name}}})
        }
    });
    

    const startCheckout = () => {
        if(pet.status === ''){
            return;
        } else {
            setIsCheckingOut(true);
            console.log(pet.id);
        }
    }

    const cancelCheckout = () => {
        setIsCheckingOut(false);
    }

    const doCheckout = (animation) => {
        console.log(animation)
        if(animation.animationName === 'progress'){
            checkoutMutation({
                variables: {
                    id: pet.id
                }
            });
        }
    }

    useEffect(() => {
        progress.current.addEventListener("animationend", doCheckout);
        return () => {
            if(progress.current){
                progress.current.removeEventListener("animationend", doCheckout);   
            }
        }
    }, [])

    return (
        <div className="petCard" onMouseDown={startCheckout} onMouseUp={cancelCheckout}>
            <img src={pet.photo?.full} alt={pet.name} className="pet-image"/>
            { done && <img src={DoneImage} alt="Done" className="done-image" />}
            <div className="pet-detail-wrapper">
                <div className={`progress ${isCheckingOut && 'animate'}`} ref={progress} />
                <div className="pet-detail" style={{backgroundColor: isCheckingOut ? 'rgba(92,184,92,0.5)' : 'rgba(92,184,92,1)'}}>
                    <div className="row">
                        <h2 className="name">{pet.name}</h2>
                        <h3 className="type">{pet.type}</h3>
                    </div>
                    <p className="weight">Weight - {pet.weight} Kg</p>
                </div>
            </div>
        </div>
    )
}

export default PetCard;