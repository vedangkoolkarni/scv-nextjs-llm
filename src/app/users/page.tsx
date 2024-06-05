/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { FC, useEffect, useState } from "react";

const users: FC = () => {
    const [_users, setUsers] = useState([]);
    const [_query, setQuery] = useState('');
    const [_answer, setAnswer] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        fetch('/api/users').then(async (response) => {
            const theUsers = await response.json();
            console.log('theUsers: ', theUsers);
            setUsers(theUsers);
        }).catch((error) => {
            setUsers([])
            console.log('error: ', error);
        });
    };

    const askQuery = () => {
        // Data to be sent in the body of the request
        const data = {
            query: _query,
        };

        // Options for the fetch request
        const options = {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json' // Setting the Content-Type header
            },
            body: JSON.stringify(data) // Converting JavaScript object to JSON
        };

        // Making the fetch request
        fetch('/api/chat', options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // Parsing the response as JSON
            })
            .then(data => {
                console.log('Success:', data); // Handling the response data
                setAnswer(data.text);
            })
            .catch(error => {
                console.error('Error:', error); // Handling errors
            });
    }

    const handleQueryChange = (event: any) => {
        setQuery(event.target.value);
    };

    return (
        <div className="btn btn-primary bg-white text-black">
            <p>Question : </p>
            <input value={_query} onChange={handleQueryChange} type="text" placeholder="enter query" className="m-4 w-1/2 block border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500" />
            <div>
                <p>Answer : </p>
                <p>{_answer}</p>
            </div>

            <button onClick={askQuery} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Submit
            </button>
            <p>this is list of all users</p>

            {
                _users.map((user: any, index: number) => {
                    return (
                        <div key={index}>
                            <p>{user.name} - {user.email}</p>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default users;
