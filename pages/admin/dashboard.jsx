// =============================================================================
// IMPORTS
// =============================================================================
import { Button, CircularProgress } from '@material-ui/core';
import AddPlan from '@components/admin/AddPlanV2'
import PageTemplate from '@components/admin/PageTemplate'


const DashboardContent = ({ useStore, firebase }) => {
    const [loaded, setLoaded] = React.useState(false)
    let state = useStore(state => state)
    let CentroMap = state.centerMap
    let DataMap = state.regionMap

    React.useEffect(() => {
        console.log(state)
        if (state.mapsLoaded) setLoaded(true)
    }, [state])


    return (
        <PageTemplate head={"Dashboard"} pageName={"Dashboard"} useStore={useStore} firebase={firebase}>
            {!loaded && <CircularProgress color="secondary" />}
            <section style={{ display: loaded ? 'block' : 'none' }}>
                <AddPlan CentroMap={CentroMap} DataMap={DataMap} firebase={firebase} />
            </section>
        </PageTemplate>
    )
}

export default DashboardContent

