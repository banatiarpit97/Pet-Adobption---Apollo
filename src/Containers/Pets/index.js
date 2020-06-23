import React, { useState, useEffect } from 'react';
import {useQuery, useMutation, useLazyQuery, useApolloClient} from '@apollo/react-hooks';
import gql from 'graphql-tag';

import './index.scss';
import PetCard from '../../Components/PetCard/PetCard';

const FETCH_ALL_PETS = gql`
    query FetchAllPets {
        allPets{
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
`

const FETCH_AVAILABLE_PETS = gql`
    query FetchAvailablePets {
        allAvailablePets{
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
`

const FETCH_CHECKED_OUT_PETS = gql`
    query FetchCheckedOutPets {
        allCheckedOutPets{
            id,
            name,
            photo{
                full
            }
            weight,
            status,
            dueDate,
            inCareOf {
                name
            }
            type: __typename
        }
    }
`

const Pets = () => {
    const [petStatus, setPetStatus] = useState('all');
    const [petType, setPetType] = useState('all');
    const [dataToShow, setDataToShow] = useState([]);
    const [filteredDataToShow, setFilteredDataToShow] = useState([]);
    const client = useApolloClient();

    const [fetchAllPets, {called, loading, error, data: data}] = useLazyQuery(FETCH_ALL_PETS, {
        onCompleted: (data) => {
            setDataToShow(data.allPets);
            filterData(data.allPets);
        },
        // fetchPolicy: 'network-only',
        
        
    });
    const [fetchAvailablePets, {called: called1, loading1, error1, data: data1}] = useLazyQuery(FETCH_AVAILABLE_PETS, {
        onCompleted: (data) => {
            setDataToShow(data.allAvailablePets);
            filterData(data.allAvailablePets);
        }
    });
    const [fetchCheckedOutPets, {called: called2, loading2, error2, data: data2}] = useLazyQuery(FETCH_CHECKED_OUT_PETS, {
        onCompleted: (data) => {
            setDataToShow(data.allCheckedOutPets);
            filterData(data.allCheckedOutPets);
        }
    }); 
    // console.log(data, loading, error)
    
    useEffect(() => {
        console.log(petStatus)
        if(petStatus === 'all'){
            if(!called){
                fetchAllPets();
            } else {
                client.query({
                    query: FETCH_ALL_PETS
                }).then(res => {
                    setDataToShow(res.data.allPets)
                    if(petType !== 'all'){
                        filterData(res.data.allPets);
                    }
                })
            }
        } else if(petStatus === 'available') {
            if(!called1){
                fetchAvailablePets();
            } else {
                client.query({
                    query: FETCH_AVAILABLE_PETS
                }).then(res => {
                    setDataToShow(res.data.allAvailablePets)
                    if(petType !== 'all'){
                        filterData(res.data.allAvailablePets);
                    }
                })
            }
        } else if(petStatus === 'checked') {
            if(!called2){
                fetchCheckedOutPets();
            } else {
                client.query({
                    query: FETCH_CHECKED_OUT_PETS
                }).then(res => {
                    setDataToShow(res.data.allCheckedOutPets)
                    if(petType !== 'all'){
                        filterData(res.data.allCheckedOutPets);
                    }
                })
            }
        }
    }, [petStatus])

    useEffect(() => {
        if(petType !== 'all'){
            setFilteredDataToShow(dataToShow.filter((pet) => pet.type.toLowerCase() === petType.toLowerCase()));
        } else {
            setFilteredDataToShow([]);
        }
    }, [petType])
    // console.log(data1);

    const filterData = data => {
        if(petType !== 'all'){
            setFilteredDataToShow(data.filter((pet) => pet.type.toLowerCase() === petType.toLowerCase()));
        }
    }

    return (
        <>
            <div className="petsContainer">
                <div className="heading-wrapper">
                    <h1 className="heading">All Pets</h1>
                    <div>
                        <select value={petStatus} onChange={e => setPetStatus(e.target.value)}>
                            <option disabled>Pet Availability</option>           
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="checked">Checked out</option>
                        </select>
                        <select value={petType} onChange={e => setPetType(e.target.value)}>
                            <option disabled>Pet Type</option>           
                            <option value="all">All</option>
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="stingray">Stingray</option>
                            <option value="rabbit">Rabbit</option>
                        </select>
                    </div>
                </div>
                {
                    loading && <p>Loading...</p>
                }
                {
                    error && <p>Error {}</p>
                }
                {
                    (((petType !== 'all') && filteredDataToShow) || dataToShow)?.map(pet => (
                        <PetCard pet={pet} key={pet.id} />
                    ))
                }
            </div>
        </>
    )
}

export default Pets;