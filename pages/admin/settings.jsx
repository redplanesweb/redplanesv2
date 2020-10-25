// =============================================================================
// IMPORTS
// =============================================================================
import { Button, CircularProgress, Grid, Modal, TextField } from '@material-ui/core';
import PageTemplate from '@components/admin/PageTemplate'
import Router from "next/router";

// =============================================================================
// DEMO PURPOSES
// =============================================================================

const SettingsContent = ({ useStore, firebase }) => {
    const [loaded, setLoaded] = React.useState(false)
    let state = useStore(state => state)

    // Check if Page info is loaded
    React.useEffect(() => { if (state.mapsLoaded) setLoaded(true) }, [state])


    return (
        <PageTemplate head={"Settings"} pageName={"Settings"} useStore={useStore} firebase={firebase}>
            {!loaded && <CircularProgress color="secondary" />}
            <section style={{ display: loaded ? 'block' : 'none' }}>
                <Grid container spacing={3}>

                    {/* <AgeWidget ageMap={state.ageMap} /> */}
                    <GesWidget gesMap={state.providerMap} />

                </Grid>
            </section>
        </PageTemplate >
    )
}

// =============================================================================
// WIDGETS
// =============================================================================
const AgeWidget = ({ ageMap }) => {
    const [groups, setGroups] = React.useState(null)
    const [modalOpen, setModalOpen] = React.useState(false)


    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleEditOpen = () => {
        setModalOpen(true)
    }

    // =========================================================================
    // EFFECTS
    // =========================================================================
    React.useEffect(() => {
        let ages = Object.keys(ageMap)
        let age0_19 = { ages: [] }
        let age20_24 = { ages: [] }
        let age25_34 = { ages: [] }
        let age35_44 = { ages: [] }
        let age45_54 = { ages: [] }
        let age55_64 = { ages: [] }
        let age65 = { ages: [] }


        for (var i = 0; i < ages.length; i++) {
            let age = ages[i]


            if (age < 20) {
                age0_19.group = "0-19"
                age0_19.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })


            }

            else if (age >= 20 && age < 25) {
                age20_24.group = "20-24"
                age20_24.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }

            else if (age >= 25 && age < 35) {
                age25_34.group = "25 - 34"
                age25_34.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }
            else if (age >= 35 && age < 45) {
                age35_44.group = "35 - 44"
                age35_44.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }

            else if (age >= 45 && age < 55) {
                age45_54.group = "45 - 54"
                age45_54.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }

            else if (age >= 55 && age < 65) {
                age55_64.group = "55 - 64"
                age55_64.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }
            else if (age >= 65) {
                age65.group = "65+"
                age65.ages.push({
                    "age": age,
                    "cotizantes": ageMap[age].cotizantes,
                    "cargas": ageMap[age].cargas
                })
            }
        }

        let age_groups = [age0_19, age20_24, age25_34, age35_44, age45_54, age55_64, age65]
        setGroups(age_groups)

    }, [ageMap])




    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <Grid item xs={12} md={6}>
            {
                groups &&
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <EditAgeModal currentAges={groups} modalOpen={modalOpen} setModalOpen={setModalOpen} />
                </Modal>
            }



            <div className="dm-panel-one-background" style={{ padding: '0.5em', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.2rem' }}>Age Bracket</h1>
                <span style={{ flex: 1 }}></span>
                <Button size="small" className="btn-secondary" onClick={handleEditOpen}>Edit</Button>
            </div>

            {
                groups &&
                groups.map((entry, index) => {
                    return (

                        <div className="dm-panel-two-background" style={{ display: 'flex', padding: '0.5em', margin: '.5em 0', borderRadius: '4px' }}>
                            <div style={{ width: '200px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Age Group</p>
                                <p>{entry.group}</p>
                            </div>
                            <div style={{ width: '200px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Cotizantes</p>
                                <p>{entry.ages.length > 0 ? entry.ages[0].cotizantes : ''}</p>
                            </div>
                            <div style={{ width: '200px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Cargas</p>
                                <p>{entry.ages.length > 0 ? entry.ages[0].cargas : ''}</p>
                            </div>
                        </div>
                    )
                })
            }


        </Grid>
    )
}

const GesWidget = ({ gesMap }) => {
    const [modalOpen, setModalOpen] = React.useState(false)

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <Grid item xs={12} md={6}>


            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <EditGesModal currentGES={gesMap} setModalOpen={setModalOpen} />
            </Modal>

            <div className="dm-panel-one-background" style={{ padding: '0.5em', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.2rem' }}>GES Values</h1>
                <span style={{ flex: 1 }}></span>
                <Button size="small" className="btn-secondary" onClick={() => setModalOpen(true)}>Edit</Button>
            </div>

            {
                Object.keys(gesMap).map(provider => {
                    let entry = gesMap[provider]
                    return (
                        <div className="dm-panel-two-background" style={{ display: 'flex', padding: '0.5em', margin: '.5em 0', borderRadius: '4px' }}>
                            <div style={{ width: '200px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Name</p>
                                <p>{entry.name}</p>
                            </div>
                            <div style={{ width: '200px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>GES Value</p>
                                <p>{entry.ges}</p>
                            </div>
                        </div>
                    )
                })
            }

        </Grid>
    )
}


// =============================================================================
// MODALS
// =============================================================================
const EditAgeModal = ({ currentAges, modelOpen, setModalOpen }) => {
    const [spinner, setSpinner] = React.useState(false)
    const [ages, setAges] = React.useState({
        age0_19: { cotizantes: 0, cargas: 0 },
        age20_24: { cotizantes: 0, cargas: 0 },
        age25_34: { cotizantes: 0, cargas: 0 },
        age35_44: { cotizantes: 0, cargas: 0 },
        age45_54: { cotizantes: 0, cargas: 0 },
        age55_64: { cotizantes: 0, cargas: 0 },
        age65: { cotizantes: 0, cargas: 0 },
    })

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleAgeChange = (e, cotizantes, group) => {
        let value = e.target.value

        let primaries = cotizantes ? value : ages[group].cotizantes
        let cargas = cotizantes ? ages[group].cargas : value
        let new_ages = { ...ages, [group]: { cotizantes: primaries, cargas: cargas } }

        setAges(new_ages)
    }


    const handleSubmit = () => {
        setModalOpen(false)
        // setSpinner(true)


        // // Make post
        // fetch('/.netlify/functions/change-age-map', {
        //     method: 'POST',
        //     body: JSON.stringify(ages)
        // })
        //     .then(response => response.json)
        //     .then(data => {
        //         setSpinner(false)
        //         setModalOpen(false)
        //         Router.reload()
        //     })
    }


    // =========================================================================
    // EFFECTS
    // =========================================================================
    React.useEffect(() => {
        if (currentAges[0].ages[0]) {
            setAges({
                age0_19: { cotizantes: currentAges[0].ages[0].cotizantes, cargas: currentAges[0].ages[0].cargas },
                age20_24: { cotizantes: currentAges[1].ages[0].cotizantes, cargas: currentAges[1].ages[0].cargas },
                age25_34: { cotizantes: currentAges[2].ages[0].cotizantes, cargas: currentAges[2].ages[0].cargas },
                age35_44: { cotizantes: currentAges[3].ages[0].cotizantes, cargas: currentAges[3].ages[0].cargas },
                age45_54: { cotizantes: currentAges[4].ages[0].cotizantes, cargas: currentAges[4].ages[0].cargas },
                age55_64: { cotizantes: currentAges[5].ages[0].cotizantes, cargas: currentAges[5].ages[0].cargas },
                age65: { cotizantes: currentAges[6].ages[0].cotizantes, cargas: currentAges[6].ages[0].cargas },
            })
        }

    }, [currentAges])



    return (
        <div style={{ maxWidth: '500px', padding: '1.5em', margin: '0 auto', marginTop: '10vh' }} className="dm-panel-three-background">
            <h1 style={{ fontSize: '1.3rem', marginBottom: '1em' }}>Change Age Groups</h1>

            {
                spinner ?
                    <CircularProgress />
                    :
                    <div>
                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 0-19</p>
                            <TextField value={ages["age0_19"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age0_19')} />
                            <TextField value={ages["age0_19"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age0_19')} />
                        </div>


                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 20-24</p>
                            <TextField value={ages["age20_24"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age20_24')} />
                            <TextField value={ages["age20_24"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age20_24')} />
                        </div>

                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 25-34</p>
                            <TextField value={ages["age25_34"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age25_34')} />
                            <TextField value={ages["age25_34"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age25_34')} />
                        </div>

                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 35-44</p>
                            <TextField value={ages["age35_44"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age35_44')} />
                            <TextField value={ages["age35_44"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age35_44')} />
                        </div>

                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 45-54</p>
                            <TextField value={ages["age45_54"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age45_54')} />
                            <TextField value={ages["age45_54"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age45_54')} />
                        </div>

                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 55-64</p>
                            <TextField value={ages["age55_64"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age55_64')} />
                            <TextField value={ages["age55_64"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age55_64')} />
                        </div>

                        <div style={{ "display": 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <p style={{ width: '11ch' }}>Age: 65+</p>
                            <TextField value={ages["age65"].cotizantes} label="Cotizante" variant="outlined" size="small" className="material-input" onChange={e => handleAgeChange(e, true, 'age65')} />
                            <TextField value={ages["age65"].cargas} label="Carga" variant="outlined" size="small" className="material-input" style={{ marginLeft: '1em' }} onChange={e => handleAgeChange(e, false, 'age65')} />
                        </div>

                    </div>
            }



            <div style={{ display: 'flex' }}>
                <Button className="btn-primary" onClick={() => setModalOpen(false)} disabled={spinner}>Cancel</Button>
                <span style={{ flex: 1 }}></span>
                <Button onClick={handleSubmit} className="btn-primary" disabled={spinner}>Submit</Button>
            </div>

        </div>
    )
}

const EditGesModal = ({ currentGES, setModalOpen }) => {
    const [spinner, setSpinner] = React.useState(false)
    const [newGES, setNewGES] = React.useState([])

    const handleSubmit = () => {
        alert('editing disabled')
        setModalOpen(false)

    }

    const handleGesChange = (e, entry) => {
        let value = e.target.value
        setNewGES({ ...newGES, [entry]: { ...newGES[entry], ges: value } })
    }


    React.useEffect(() => {
        if (Object.keys(currentGES).length) {
            setNewGES(currentGES)
        }
    }, [currentGES])

    return (
        <div style={{ maxWidth: '500px', padding: '1.5em', margin: '0 auto', marginTop: '10vh' }} className="dm-panel-three-background">
            <h1 style={{ fontSize: '1.3rem', marginBottom: '1em' }}>Change GES</h1>

            {
                spinner ?
                    <CircularProgress />
                    :
                    <div>

                        {
                            Object.keys(newGES).map(entry => {
                                return (
                                    <div style={{ display: 'flex', marginBottom: '1.2em', alignItems: 'center' }}>
                                        <p style={{ width: '150px' }}>{newGES[entry].name}</p>
                                        <TextField value={newGES[entry].ges} label="GES Value" variant="outlined" size="small" className="material-input" style={{ width: '100%' }} onChange={e => handleGesChange(e, entry)} />
                                    </div>
                                )
                            })
                        }
                    </div>
            }



            <div style={{ display: 'flex' }}>
                <Button className="btn-primary" onClick={() => setModalOpen(false)} disabled={spinner}>Cancel</Button>
                <span style={{ flex: 1 }}></span>
                <Button onClick={handleSubmit} className="btn-primary" disabled={spinner}>Submit</Button>
            </div>

        </div>
    )
}
export default SettingsContent