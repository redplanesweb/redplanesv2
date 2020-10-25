import { Button, CircularProgress, Grid, Modal, TextField } from '@material-ui/core';
import PageTemplate from '@components/admin/PageTemplate'

const MassUpload = ({ useStore, firebase }) => {
    const [loaded, setLoaded] = React.useState(false)
    let state = useStore(state => state)

    // Check if Page info is loaded
    React.useEffect(() => { if (state.mapsLoaded) setLoaded(true) }, [state])

    return (
        <PageTemplate head={"Settings"} pageName={"Settings"} useStore={useStore} firebase={firebase}>
            {!loaded && <CircularProgress color="secondary" />}
            <section style={{ display: loaded ? 'block' : 'none' }}>
                <Grid container spacing={3}>
                    <div>
                        <h1>Upload JSON</h1>
                        <input type="file"></input>

                        <h1 style={{ marginTop: '1em' }}>Upload PDFS</h1>
                        <input type="file" multiple></input>

                    </div>

                </Grid>
            </section>
        </PageTemplate >)
}

export default MassUpload