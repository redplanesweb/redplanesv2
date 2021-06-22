import React from 'react';
import Head from 'next/head';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ContactsOutlined } from '@material-ui/icons';

const Home = ({ firebase }) => {
	React.useEffect(() => {
		// fetch("/.netlify/functions/test")
		//     .then(response => response)
		//     .then(data => {
		//         console.log(data)
		//     })

		console.log(firebase);
	}, []);

	const sendEmail = () => {
		fetch('/.netlify/functions/send-email/send-email', {
			method: 'POST',
			body: JSON.stringify({
				name: 'david',
				email: 'davidludemann0@gmail.com',
				details: 'These are the details of the email',
			}),
		});
	};
	const uploadJSON = (e) => {
		// const json = require(e.target.value);
		// console.log(e.target.files[0]);
		// var reader = new FileReader();
		// reader.readAsText(JSON.parse(e.target.files[0]));
		// var fs = require("fs");
		let db = firebase.firestore();
		const reader = new FileReader();
		reader.onload = function () {
			const json = JSON.parse(reader.result).data;
			json.forEach((isapre) => {
				db.collection('insurance_entries')
					.add(isapre)
					.then((docRef) => {
						console.log('Document written with ID: ', docRef.id);
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
					});
			});

			//   console.log(JSON.parse(reader.result).data);
		};
		reader.readAsText(e.target.files[0]);
		console.log(e.target.files[0]);

		// let db = firebase.firestore();
		// db.collection('insurance_entries')
	};

	const handleClick = () => {
		let db = firebase.firestore();
	};

	return (
		<div>
			<h1>Next.js on the [JAMstack](https://jamstack.org)</h1>
			<h3>
				Hooray 🎉 - you've built this with{' '}
				<a href='https://nextjs.org'>Next.js</a>!
			</h3>

			<button onClick={sendEmail}>Send Mail</button>
			<button onClick={handleClick}>Update</button>
			<input type='file' onChange={uploadJSON} />
		</div>
	);
};

// const Test = firebase => {
//     // const messagesRef = firebase.firebase.firestore().collection('recipes');
//     // const [messages] = useCollectionData(messagesRef, { idField: 'id' });

//     React.useEffect(() => {
//         console.log(messages)
//     })

//     return (
//         <h1>Hi</h1>
//     )
// }

export default Home;
