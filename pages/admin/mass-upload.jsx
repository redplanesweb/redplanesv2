import {
	Button,
	CircularProgress,
	Grid,
	Modal,
	TextField,
} from '@material-ui/core';
import PageTemplate from '@components/admin/PageTemplate';

const MassUpload = ({ useStore, firebase }) => {
	const [loaded, setLoaded] = React.useState(false);
	let state = useStore((state) => state);
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

	// Check if Page info is loaded
	React.useEffect(() => {
		if (state.mapsLoaded) setLoaded(true);
	}, [state]);

	return (
		<PageTemplate
			head={'Settings'}
			pageName={'Settings'}
			useStore={useStore}
			firebase={firebase}>
			{!loaded && <CircularProgress color='secondary' />}
			<section style={{ display: loaded ? 'block' : 'none' }}>
				<Grid container spacing={3}>
					<div>
						<h1>Upload JSON</h1>
						<input type='file' onChange={uploadJSON}></input>

						<h1 style={{ marginTop: '1em' }}>Upload PDFS</h1>
						<input type='file' multiple></input>
					</div>
				</Grid>
			</section>
		</PageTemplate>
	);
};

export default MassUpload;
