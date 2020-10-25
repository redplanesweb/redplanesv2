// =============================================================================
// IMPORTS
// =============================================================================
import {
    Button,
} from '@material-ui/core';
import AddPlan from '@components/admin/AddPlanV2'
import netlifyAuth from '../../netlifyAuthentication.js'
import DashAppBar from '@components/admin/DashboardAppBar'
import Sidebar from '@components/admin/Sidebar'
import Head from 'next/head'

// =============================================================================
// PRIVATE ROUTE WRAPPER
// =============================================================================
const Page = ({ pageName, children, head, useStore, firebase }) => {
    let [loggedIn, setLoggedIn] = React.useState(netlifyAuth.isAuthenticated)
    let [user, setUser] = React.useState(null)

    // Global State Zustand
    let state = useStore(state => state)

    // FIRST LOAD
    React.useEffect(() => {

        // Load maps if not available
        if (!state.mapsLoaded) {
            firebase.firestore().collection("maps").get().then(function (querySnapshot) {

                // get map data
                let docs = querySnapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        data: doc.data()
                    }
                })

                // flatten map data
                let maps = {
                    age: docs[docs.map(e => e.id).indexOf('age_map')].data,
                    center: docs[docs.map(e => e.id).indexOf('centro_map')].data,
                    provider: docs[docs.map(e => e.id).indexOf('provider_map')].data,
                    region: docs[docs.map(e => e.id).indexOf('region_map')].data,
                    planType: docs[docs.map(e => e.id).indexOf('plan_type')].data,
                    success: true
                }


                state.setData(maps)
            });
        }


        // Check if Authenticated
        let isCurrent = true
        netlifyAuth.initialize((user) => {
            if (isCurrent) {
                setLoggedIn(!!user)
            }
        })


        return () => {
            isCurrent = false
        }


    }, [])

    // =========================================================================
    // IDENTITY FUNCTIONS
    // =========================================================================
    let login = () => {
        netlifyAuth.authenticate((user) => {
            setLoggedIn(!!user)
            setUser(user)
        })
    }

    let logout = () => {
        netlifyAuth.signout(() => {
            setLoggedIn(false)
            setUser(null)
        })
    }


    return (

        <React.Fragment>
            <Head>
                <title>{head}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {
                loggedIn
                    ?
                    <AdminLayout logout={logout} content={children} pageName={pageName} />
                    :
                    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={login} variant="contained" color="primary">Login</Button>
                    </div>
            }


        </React.Fragment>

    )
}

// =============================================================================
// RENDER
// =============================================================================
const AdminLayout = ({ logout, content, pageName }) => {
    const [menuOpen, setMenuOpen] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleLogout = () => {
        logout()
        setAnchorEl(null)
    }

    return (
        <main style={{ height: '100vh', overflow: 'hidden' }}>
            <DashAppBar logout={logout} setMenuOpen={setMenuOpen} menuOpen={menuOpen} page={pageName} />


            <main className="dashboard-main-container dm-panel-two-background" style={{ height: 'calc(100vh - 60px)', gridTemplateColumns: menuOpen ? '275px 1fr' : '0px 1fr' }}>
                <aside className="dashboard-sidebar">
                    <Sidebar menuOpen={menuOpen} />
                </aside>

                <section className="dashboard-right-content dm-body-background" style={{ overflowY: 'scroll' }}>
                    {content}
                </section>
            </main>
        </main>
    )
}

export default Page