import React from 'react'
import Head from 'next/head'


const Home = ({ firebase }) => {

    React.useEffect(() => {
        fetch("/.netlify/functions/test")
            .then(response => response)
            .then(data => {
                console.log(data)
            })
    }, [])


    const sendEmail = () => {
        fetch('/.netlify/functions/send-email/send-email', {
            method: 'POST',
            body: JSON.stringify({
                name: "david",
                email: "davidludemann0@gmail.com",
                details: "These are the details of the email"
            })
        })
    }

    const firebaseFunction = () => {
        const db = firebase.firestore()
        db.collection('recipes').add({
            title: 'pears'
        })
    }

    return (
        <div>
            <h1>Next.js on the [JAMstack](https://jamstack.org)</h1>

            <h3>Hooray 🎉 - you've built this with <a href="https://nextjs.org">Next.js</a>!</h3>

            <button onClick={sendEmail}>Send Mail</button>
            <button onClick={firebaseFunction}>Firebase</button>

            <style jsx>{`
                :global(html,body) {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                }

                :global(body) {
                    font-size: calc(10px + 1vmin);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
                    'Droid Sans', 'Helvetica Neue', sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background-color: #282c34;
                    color: white;
                }

                a {
                    color: pink;
                    text-decoration: none;
                }

                .content {
                    padding: 0 32px;
                }
                `}
            </style>
        </div>
    )
}


export default Home
