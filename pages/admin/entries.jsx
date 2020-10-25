// =============================================================================
// IMPORTS
// =============================================================================
import { TextField, CircularProgress } from '@material-ui/core';

import PageTemplate from '@components/admin/PageTemplate'
import InsuranceTableEntry from '@components/admin/InsuranceTableEntry'

// =============================================================================
// CONTENT
// =============================================================================
const EntriesContent = ({ useStore, firebase }) => {
    const [loaded, setLoaded] = React.useState(false)
    const [entries, setEntries] = React.useState([])
    const [searchValue, setSearchValue] = React.useState('')
    let state = useStore(state => state)
    let CentroMap = state.centerMap
    let DataMap = state.regionMap

    // =========================================================================
    // INITIAL LOAD
    // =========================================================================
    React.useEffect(() => {
        // Query Entries
        firebase.firestore().collection('insurance_entries').get().then(snapshot => {

            // Grab Raw Data
            let payload = snapshot.docs.map(doc => {
                return {
                    data: doc.data(),
                    id: doc.id
                }
            })
            setEntries(payload)

        })
    }, [])

    // =========================================================================
    // GLOBAL STATE CHANGE
    // =========================================================================
    React.useEffect(() => {
        if (state.mapsLoaded) setLoaded(true)

    }, [state])


    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleNameFilter = (e) => {
        let value = e.target.value.trim().toLowerCase()

        if (!value) {
            console.log('no value')
            setEntries(JSON.parse(localStorage.getItem('entry-list')))
        }
        else {
            let newEntries = entries.filter(entry => entry.data.plan_name.trim().toLowerCase().startsWith(value))
            setEntries(newEntries)
        }

        setSearchValue(value)
    }

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <PageTemplate head={"Entries"} pageName={"Entries"} useStore={useStore} firebase={firebase}>
            {!loaded && <CircularProgress color="secondary" />}
            <section style={{ display: loaded ? 'block' : 'none' }}>
                <div>
                    <TextField
                        id="filled-search"
                        label="Search field"
                        type="search"
                        variant="outlined"
                        className="material-input"
                        style={{ width: '100%', marginBottom: '1em' }}
                        onChange={handleNameFilter}
                        value={searchValue}
                    />
                </div>

                {
                    entries.map((entry, index) => <InsuranceTableEntry id={entry.id} data={entry.data} CentroMap={CentroMap} DataMap={DataMap} />)
                }
            </section>
        </PageTemplate>
    )
}


export default EntriesContent