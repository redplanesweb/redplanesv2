// =============================================================================
// IMPORTS
// =============================================================================
import InsuranceEntry from '@components/search/InsuranceEntrySearch'
import {
    Button,
    Paper,
    Container,
    Grid,
    Slider,
    TextField,
    Select,
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Tooltip,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    CircularProgress,
    Switch
} from '@material-ui/core';
import useDarkMode from 'use-dark-mode'
import Head from 'next/head'
import ButtonWrapper from '@components/ui/MuiButtonWrapper'
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';

// =============================================================================
// DEMO PURPOSES
// =============================================================================
// import CentroMap from '@components/centro_map.json'
// import DataMap from '@components/data.json'
// import PlanTypeMap from '@components/plan_type_map.json'
// import ProviderMap from '@components/provider_map.json'


let iMin = 20000
let iMax = 400000

let risk_map = {
    "0_20": {
        'cotizantes': 0.6,
        'cargas': 0.6
    },
    "20_25": {
        'cotizantes': 0.9,
        'cargas': 0.7
    },
    "25_35": {
        'cotizantes': 1.0,
        'cargas': 0.7
    },
    "35_45": {
        'cotizantes': 1.3,
        'cargas': 0.9
    },
    "45_55": {
        'cotizantes': 1.4,
        'cargas': 1.0
    },
    "55_65": {
        'cotizantes': 2.0,
        'cargas': 1.40
    },
    "65": {
        'cotizantes': 2.4,
        'cargas': 2.20
    }
}

//let uf_to_peso = 28713.59

const calculateRisk = (age) => {
    if (!age || age == NaN) return { 'cotizantes': 0, 'cargas': 0 }

    if (age < 20) return risk_map['0_20']
    else if (age >= 20 && age < 25) return risk_map['20_25']
    else if (age >= 25 && age < 35) return risk_map['25_35']
    else if (age >= 35 && age < 45) return risk_map['35_45']
    else if (age >= 45 && age < 55) return risk_map['45_55']
    else if (age >= 55 && age < 65) return risk_map['55_65']
    else if (age >= 65) return risk_map['65']
}


// =============================================================================
// MAIN
// =============================================================================

const InitialPoint = () => {

    const [primary, setPrimary] = React.useState({ person_one: null, person_two: null })
    const [cargasList, setCargasList] = React.useState([])
    const [submit, setSubmit] = React.useState(false)

    // =========================================================================
    // MAIN RETURN
    // =========================================================================
    return (
        <React.Fragment>
            <Head>
                <title>Search</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <SearchPopUp primary={primary} setPrimary={setPrimary} cargasList={cargasList} setCargasList={setCargasList} setSubmit={setSubmit} submit={submit} />

            <SearchLayout submit={submit} primaries={primary} cargasList={cargasList} />

        </React.Fragment>
    )
}

const SearchPopUp = ({ primary, setPrimary, cargasList, setCargasList, setSubmit, submit }) => {
    const [cargas, setCargas] = React.useState('no')
    const [single, setSingle] = React.useState('yes')
    const [primaryAge, setPrimaryAge] = React.useState("")
    const [seconadaryAge, setSecondaryAge] = React.useState("")

    const handleChange = (event) => {
        setSingle(event.target.value);

        // Remove any value of person two
        if (event.target.value == 'yes') {
            setSecondaryAge("")
            setPrimary({ ...primary, person_two: null })
        }
    };

    const handleCargasChange = (event) => {
        setCargas(event.target.value)
    }

    const addCargas = () => {
        let current_cargas = cargasList.map(entry => entry)
        current_cargas.push({
            "age": ""
        })

        setCargasList(current_cargas)
    }

    const handleSubmit = () => {
        setSubmit(true)
    }


    const handlePrimaryAge = event => {
        setPrimaryAge(event.target.value)
        setPrimary({ ...primary, person_one: event.target.value })
    }

    const handleSeconadaryAge = event => {
        setSecondaryAge(event.target.value)
        setPrimary({ ...primary, person_two: event.target.value })
    }


    return (

        <main style={{
            minHeight: submit ? '0vh' : '100vh',
            background: submit ? 'none' : 'rgba(0,0,0,0.5)',
            padding: submit ? '0' : '1.5em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            minWidth: '100vw',
            zIndex: 100
        }}>

            <Slide direction="down" in={!submit} mountOnEnter unmountOnExit>
                <div className="initial-modal" >
                    <h1 style={{ fontSize: '2rem', textAlign: 'center', color: "#333" }}>Compara Planes de Isapres</h1>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '2em', textAlign: 'center', color: "#333" }}>Ingresa tu edad para calcular los valores</h2>



                    <TextField type="number" label="Cual es tu edad?" variant="outlined" onChange={handlePrimaryAge} value={primaryAge} style={{ width: '100%' }} />
                    {
                        single == 'no' &&
                        <TextField type="number" label="Pareja edad?" variant="outlined" onChange={handleSeconadaryAge} value={seconadaryAge} style={{ width: '100%', margin: '1em 0' }} />
                    }

                    <FormControl component="fieldset" style={{ width: '100%', margin: '1em 0' }}>
                        <FormLabel component="legend" style={{ color: "#333" }}>Te incorporas solo o en paraja?</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={single} onChange={handleChange}>
                            <FormControlLabel value="yes" control={<Radio />} label="Solo yo" style={{ color: "#333" }} />
                            <FormControlLabel value="no" control={<Radio />} label="Me incorporo junto a mi pareja" style={{ color: "#333" }} />
                        </RadioGroup>
                    </FormControl>


                    <FormControl component="fieldset" style={{ width: '100%', margin: '1em 0' }}>
                        <FormLabel component="legend" style={{ color: "#333" }}>Quieres añadir beneficiarios? (cargas)</FormLabel>
                        <RadioGroup aria-label="gender" name="gender1" value={cargas} onChange={handleCargasChange}>
                            <FormControlLabel value="no" style={{ color: "#333" }} control={<Radio />} label="No" />
                            <FormControlLabel value="yes" style={{ color: "#333" }} control={<Radio />} label="Si, añadir cargas" />
                        </RadioGroup>
                    </FormControl>

                    {
                        cargas == 'yes' ?
                            <div>

                                <h2 style={{ fontSize: '1.5rem', color: "#333" }}>Cargas:</h2>
                                {
                                    cargasList.map((carga, index) => {
                                        return (
                                            <Carga number={index + 1} setCargasList={setCargasList} cargasList={cargasList} age={carga.age} />
                                        )
                                    })
                                }
                                <Button variant="contained" size="small" onClick={addCargas}>+</Button>
                            </div>
                            : undefined

                    }

                    <ButtonWrapper variant="contained" color="primary" className="hover-grow" style={{ width: '100%', marginTop: '1em' }} click={handleSubmit}>VER PLANES</ButtonWrapper>

                </div>
            </Slide>

        </main>
    )
}

const Carga = ({ number, cargasList, setCargasList, age }) => {
    //const [age, setAge] = React.useState('')

    const changeAge = (event) => {
        let current_cargas = cargasList.map(entry => entry)
        current_cargas[number - 1].age = event.target.value

        setCargasList(current_cargas)
    }

    const removeCarga = () => {
        let current_cargas = cargasList.map(entry => entry)
        let new_cargas = current_cargas.filter((entry, index) => index != (number - 1))

        console.log(new_cargas)

        setCargasList(new_cargas)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', margin: '.5em 0' }}>
            <p style={{ fontSize: '1.2rem', marginRight: '1em', color: "#333" }}>Carga {number}:</p>
            <TextField type="number" label="Carga Age" variant="outlined" onChange={changeAge} value={age} size="small" />
            <Button style={{ marginLeft: '1em' }} variant="contained" size="small" onClick={removeCarga}>Eliminar</Button>
        </div>
    )
}


const SearchLayout = ({ primaries, cargasList, submit, setCargasList, setPrimary }) => {

    // =========================================================================
    // STATES
    // =========================================================================
    const darkMode = useDarkMode(true)
    const [entries, setEntries] = React.useState([])
    const [currentRate, setCurrentRate] = React.useState(1)
    const [allEntries, setAllEntries] = React.useState([])
    const [people, setPeople] = React.useState({ primary: primaries, beneficiaries: cargasList })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState({
        providers: Object.keys(ProviderMap),
        region: Object.keys(DataMap),
        price_range: [iMin, iMax],
        clinics: Object.keys(CentroMap),
        people: { primaries: null, beneficiaries: null },
        first_time: true,
        coverage: { hospital: 0, ambulence: 0, urgent: 0, dental: 0 }
    })

    const [darkModeSwitch, setDarkModeSwitch] = React.useState(darkMode.value)

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handeDarkModeSwitch = event => {
        let checked = event.target.checked
        checked ? darkMode.enable() : darkMode.disable()
        setDarkModeSwitch(checked)
    }


    // =========================================================================
    // LOAD FIRST ENTRIES
    // =========================================================================
    React.useEffect(() => {

        // Return if the intro dialogue was not submitted
        if (!submit) return

        // Get maps
        fetch('/.netlify/functions/get-maps')
            .then(response => response.json())
            .then(data => {
                if (data.success) state.setData(data)
                localStorage.setItem('data-maps', JSON.stringify(data))
            })
            .catch(err => {
                console.log("Error Caught: ", err)
            })

        // Get data
        fetch("/.netlify/functions/get-insurance-entries")
            .then(response => response.json())
            .then(data => {


                let payload = data.data
                let current_rate = data.current_rate.data.uf_to_peso

                localStorage.setItem('entryList', JSON.stringify(payload))

                let final_payload = payload.map((entry, index) => {
                    let template = entry
                    let uf = entry.data.uf_value
                    let ges_value = ProviderMap[entry.data.provider].ges
                    let final_uf = calculateUF(primaries, cargasList, uf, ges_value)
                    let price = final_uf * current_rate;



                    template.price = parseInt(price.toFixed(0))
                    template.total_uf = final_uf
                    return template
                })

                console.log("final payload v1")
                console.log(final_payload)

                setEntries(final_payload)
                setAllEntries(final_payload)
                setPeople({ primary: primaries, beneficiaries: cargasList })
                setCurrentRate(current_rate)
            })
            .catch(err => {
                console.log("Error Caught: ", err)
            })

    }, [submit])


    // =========================================================================
    // FILTER
    // =========================================================================
    React.useEffect(() => {

        if (!filter) return

        console.log('CURRENT_FILTER:')
        console.log(filter)

        // if (filter.first_time) {
        //     setFilter({ ...filter, first_time: false })
        //     return
        // }

        let allEntries = JSON.parse(localStorage.getItem('insurance_entries'))


        let results = allEntries.filter((entry, index) => {

            console.log("Entry")
            console.log(entry)

            // Filter Provider
            let provider = filter.providers.includes(entry.data.provider)

            // Filter Region
            let region = entry.data.region.some(region => filter.region.includes(region))

            // Filter By clinic
            let clinic = entry.data.medical_centers.some(center => filter.clinics.includes(center.name))

            // Filter by percentages
            let hospital = entry.data.medical_centers.some(center => parseInt(center.hospital) >= filter.coverage.hospital)
            let ambulence = entry.data.medical_centers.some(center => parseInt(center.ambulence) >= filter.coverage.ambulence)
            let urgent = entry.data.medical_centers.some(center => parseInt(center.urgent) >= filter.coverage.urgent)
            //let dental = entry.data.medical_centers.some(center => parseInt(center.dental) >= filter.coverage.dental)

            console.log(provider)
            console.log(region)
            console.log(clinic)
            console.log(hospital)
            console.log(urgent)

            // If all these are true, we return the entry
            return (provider && region && clinic & hospital & ambulence & urgent)
        })

        console.log(results)

        setEntries(results)

    }, [filter])


    // =========================================================================
    // AGE CHANGE
    // =========================================================================
    React.useEffect(() => {

        let payload = JSON.parse(localStorage.getItem('entryList'))
        if (!payload) return
        if (currentRate == 1) return // initial rate is 1 until calculated

        console.log("current_rate: ", currentRate)

        let final_payload = payload.map((entry, index) => {
            let template = entry
            let uf = entry.data.uf_value
            let ges_value = ProviderMap[entry.data.provider].ges
            let final_uf = calculateUF(people.primary, people.beneficiaries, uf, ges_value)
            let price = final_uf * currentRate;


            template.price = parseInt(price.toFixed(0))
            template.total_uf = final_uf
            return template
        })

        console.log("final payload v2")
        console.log(final_payload)

        setEntries(final_payload)
        setAllEntries(final_payload)
    }, [people])

    // =========================================================================
    // MAIN RETURN
    // =========================================================================
    return (
        <main className="search-main-app-container dm-body-background" style={{ minHeight: '100vh' }}>
            <Paper elevation={1} style={{ marginBottom: '1em' }} className="dm-panel-three-background">
                <Container style={{ padding: '.25em 0', display: 'flex', alignItems: 'center' }} className="menu-container">
                    {/* <h1 style={{ fontSize: '2rem' }} className="logo-title">Isapres.cl</h1> */}
                    <img src="/images/logo.svg" style={{ maxHeight: '55px' }} className="logo" />
                    <span style={{ flex: 1 }} className="mobile-hide"></span>
                    <div className="mobile-hide">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="dm-text-1">
                            MI CUENTA
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={darkModeSwitch}
                                            onChange={handeDarkModeSwitch}
                                            name="dm-switch"
                                            color="primary"
                                        />
                                    }
                                    label="Dark Mode"
                                />

                            </MenuItem>
                        </Menu>

                    </div>

                </Container>
            </Paper>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <CircularProgress color="secondary" style={{ display: entries.length == 0 ? 'block' : 'none', margin: '2em auto' }} />

                        {
                            entries.filter(entry => parseInt(entry.price) < parseInt(filter.price_range[1]) && parseInt(entry.price) > parseInt(filter.price_range[0])).map((payload, index) => {
                                let entry = payload.data

                                //console.log(entry)
                                let isLibre = false
                                let libre = entry?.libre_eleccion
                                let libreRows = []
                                let medicalRows = entry.medical_centers

                                if (libre?.hospital) {
                                    isLibre = true
                                    libreRows = [
                                        {
                                            "name": "Cobertura Libre Elección",
                                            "hospital": libre.hospital,
                                            "ambulence": libre.ambulence,
                                            "urgent": libre.urgent
                                        }]
                                }


                                return (
                                    <InsuranceEntry
                                        title={entry.plan_name}
                                        subTitle={entry.plan_type}
                                        price={payload.price}
                                        provider={entry.provider}
                                        key={index}
                                        rows={isLibre ? libreRows : medicalRows}
                                        CentroMap={CentroMap}
                                        DataMap={DataMap}
                                        PlanTypeMap={PlanTypeMap}
                                        ProviderMap={ProviderMap}
                                        totalUF={payload.total_uf}
                                        baseUF={entry.uf_value}
                                    />
                                )
                            })
                        }

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Sidebar
                            CentroMap={CentroMap}
                            DataMap={DataMap}
                            filter={filter}
                            setFilter={setFilter}
                            ProviderMap={ProviderMap}
                            iMin={iMin}
                            iMax={iMax}
                            people={people}
                            setPeople={setPeople}
                            currentRate={currentRate}
                            setCargasList={setCargasList}
                            setPrimary={setPrimary}
                            primaries={primaries}
                            cargasList={cargasList}
                        />
                    </Grid>
                </Grid>
            </Container>
        </main>
    )
}

// =============================================================================
// SIDEBAR
// =============================================================================
const Sidebar = (props) => {
    const { CentroMap, DataMap, filter, setFilter, ProviderMap, iMin, iMax, cargasList, setPeople, people, currentRate, setCargasList, primaries, setPrimary } = props

    // =========================================================================
    // STATES
    // =========================================================================
    const [filterPrice, setFilterPrice] = React.useState([iMin, iMax])
    const [filterIngresa, setFilterIngresa] = React.useState('todo_chile')
    const [filterPrestador, setFilterPrestador] = React.useState('todos')
    const [filterCheckboxes, setFilterCheckboxes] = React.useState({});
    // const [percentageFilter, setPercentageFilter] = React.useState({
    //     hospital: 0,
    //     ambulence: 0,
    //     urgent: 0,
    //     dental: 0
    // })


    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleCheckboxChange = (event) => {
        let checkboxFilter = { ...filterCheckboxes, [event.target.name]: event.target.checked }
        let providers = Object.keys(checkboxFilter).filter(entry => checkboxFilter[entry])

        if (providers.length == 0) setFilter({ ...filter, providers: Object.keys(ProviderMap) })
        else setFilter({ ...filter, providers: providers })

        setFilterCheckboxes(checkboxFilter);
    };

    const handleRegionChange = (event) => {
        let value = event.target.value

        if (value == 'todo_chile') setFilter({ ...filter, region: Object.keys(DataMap) })
        else setFilter({ ...filter, region: [event.target.value] })

        setFilterIngresa(event.target.value)
    }

    const handleFilterPriceLow = (event) => {
        setFilter({ ...filter, price_range: [event.target.value, filterPrice[1]] })
        setFilterPrice([parseInt(event.target.value), filterPrice[1]])
    }

    const handleFilterPriceHigh = (event) => {
        setFilter({ ...filter, price_range: [filterPrice[0], event.target.value] })
        setFilterPrice([filterPrice[0], parseInt(event.target.value)])
    }

    const handlePriceFilter = (event, newValue) => {
        setFilter({ ...filter, price_range: newValue })
        setFilterPrice(newValue)
    }

    const handleClinicFilter = (event) => {
        let value = event.target.value

        if (value == 'todos') setFilter({ ...filter, clinics: Object.keys(CentroMap) })
        else setFilter({ ...filter, clinics: value })
        setFilterPrestador(value)
    }

    const handlePercentChange = (event, newValue, name) => {
        let newPercentage = { ...filter.coverage, [name]: newValue }
        // setPercentageFilter({ ...percentageFilter, [name]: newValue })
        setFilter({ ...filter, coverage: newPercentage })
    }

    const handleAddCarga = (event) => {
        let new_carga = people.beneficiaries.map(entry => entry)
        new_carga.push({ "age": "" })

        console.log(new_carga)
        setPeople({ ...people, beneficiaries: new_carga })
    }

    const handleRemoveCarga = index => {
        let new_cargas = people.beneficiaries.filter((entry, i) => i != index)
        setPeople({ ...people, beneficiaries: new_cargas })
    }

    const handleCargaChange = (value, index) => {
        let new_cargas = people.beneficiaries.map(entry => entry)
        new_cargas[index].age = value
        setPeople({ ...people, beneficiaries: new_cargas })

    }

    const handlePrimaryChange = (event, person) => {
        let value = event.target.value
        let primaries = { ...people.primary, [person]: value }

        setPeople({ ...people, primary: primaries })

    }
    // =========================================================================
    // EFFECTS
    // =========================================================================


    // =========================================================================
    // RETURN
    // =========================================================================
    return (
        <>
            {/* Daily Rate */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Valor UF hoy</div>
                <div className="filter-content filter-price">
                    <h1>1 UF = {currentRate} peso</h1>
                </div>
            </Paper>


            {/* COTIZANTES */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Beneficiarios a incorporar</div>
                <div className="filter-content">

                    <div>
                        <h2 style={{ marginBottom: '1em' }}>Cotizantes</h2>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                size="small"
                                label="Age"
                                value={people.primary.person_one}
                                onChange={e => handlePrimaryChange(e, "person_one")}
                                className="material-input"
                                style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                            />
                            <p className="dm-text-1">Cotizante 1</p>
                        </div>

                        {
                            people.primary.person_two &&
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    label="Age"
                                    variant="outlined"
                                    size="small"
                                    value={people.primary.person_two}
                                    onChange={e => handlePrimaryChange(e, "person_two")}
                                    className="material-input"
                                    style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                                />
                                <p className="dm-text-1">Cotizante 2</p>

                            </div>
                        }

                    </div>

                    <div>
                        <h2 style={{ marginBottom: '1em' }}>Cargas</h2>
                        {
                            people.beneficiaries.map((carga, index) => {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            size="small"
                                            label="Age"
                                            onChange={e => handleCargaChange(e.target.value, index)}
                                            value={carga.age}
                                            className="material-input"
                                            style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                                        />
                                        <p className="dm-text-1">Carga {index + 1}</p>
                                        <span style={{ flex: 1 }}></span>
                                        <button className="dm-text-1" style={{ borderRadius: '2em', border: 'none', height: '2em', width: '2em', background: 'rgba(0,0,0,.2)', cursor: 'pointer' }} onClick={() => handleRemoveCarga(index)}>-</button>
                                    </div>
                                )
                            })
                        }

                    </div>


                    <div>
                        <Button variant="contained" color="primary" style={{ width: '100%' }} className="btn-primary hover-grow" onClick={handleAddCarga}>AGREGAR CARGA</Button>
                    </div>
                </div>
            </Paper>

            {/* PRECIO */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Precio</div>
                <div className="filter-content filter-price">
                    <TextField
                        id="outlined-number"
                        label="Valor mínimo"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        value={filterPrice[0]}
                        onChange={handleFilterPriceLow}
                        className="material-input"
                    />

                    <TextField
                        id="outlined-number"
                        label="Válor maximo"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        value={filterPrice[1]}
                        className="material-input"
                        onChange={handleFilterPriceHigh}
                    />
                    <Slider
                        value={filterPrice}
                        onChange={handlePriceFilter}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={() => `${filterPrice}`}
                        min={20000}
                        max={600000}
                        step={6000}
                        className="material-slider"
                        ValueLabelComponent={ValueLabelComponent}
                    />
                </div>
            </Paper>

            {/* MIN COVERAGE */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Cobertura deseada</div>
                <div className="filter-content filter-price">

                    <div>
                        <div>
                            <p className="dm-text-1">HOSPITALARIA</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                id="outlined-number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                                value={`${filter.coverage.hospital}%`}
                                className="material-input"
                                style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                            />

                            <Slider value={filter.coverage.hospital} name="test" onChange={(e, value) => handlePercentChange(e, value, 'hospital')} className="material-slider" />
                        </div>
                    </div>

                    <div>
                        <div>
                            <p className="dm-text-1">AMBULATORIA</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                id="outlined-number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                                value={`${filter.coverage.ambulence}%`}
                                className="material-input"
                                style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                            />

                            <Slider value={filter.coverage.ambulence} name="test" onChange={(e, value) => handlePercentChange(e, value, 'ambulence')} className="material-slider" />
                        </div>
                    </div>


                    <div>
                        <div>
                            <p className="dm-text-1">URGENCIA</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                id="outlined-number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                                value={`${filter.coverage.urgent}%`}
                                className="material-input"
                                style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                            />

                            <Slider value={filter.coverage.urgent} name="test" onChange={(e, value) => handlePercentChange(e, value, 'urgent')} className="material-slider" />
                        </div>
                    </div>

                    <div>
                        <div>
                            <p className="dm-text-1">DENTAL</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                id="outlined-number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                size="small"
                                value={`${filter.coverage.dental}%`}
                                className="material-input"
                                style={{ maxWidth: '4em', marginRight: '1em', marginBottom: 0 }}
                            />

                            <Slider value={filter.coverage.dental} name="test" onChange={(e, value) => handlePercentChange(e, value, 'dental')} className="material-slider" />
                        </div>
                    </div>


                </div>
            </Paper>

            {/* Ingresa */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Ingresa tu región</div>
                <div className="filter-content">
                    <Select
                        native
                        value={filterIngresa}
                        onChange={handleRegionChange}
                        style={{ width: '100%' }}
                        variant={'outlined'}
                        className="material-input"
                    >
                        <option value={'todo_chile'}>Todo Chile</option>
                        {
                            Object.keys(DataMap).map(entry => <option value={entry}>{DataMap[entry].name}</option>)
                        }
                    </Select>
                </div>
            </Paper>

            {/* Prestador */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Prestador</div>
                <div className="filter-content">
                    <Select
                        native
                        value={filterPrestador}
                        onChange={handleClinicFilter}
                        style={{ width: '100%' }}
                        variant={'outlined'}
                        className="material-input"
                    >
                        <option value={'todos'}>Todas las cinicas</option>
                        {
                            Object.keys(CentroMap).map(clinic => <option value={clinic}>{CentroMap[clinic].full_name}</option>)
                        }
                    </Select>
                </div>
            </Paper>

            {/* Isapres */}
            <Paper className="filter-container dm-panel-three-background" elevation={1}>
                <div className="filter-title dm-panel-one-background">Isapres</div>
                <div className="filter-content filter-checkboxes">
                    {
                        Object.keys(ProviderMap).map(entry => {
                            return (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filterCheckboxes[entry]}
                                            onChange={handleCheckboxChange}
                                            name={entry}
                                        />
                                    }
                                    className="dm-text-1"
                                    label={ProviderMap[entry].name}
                                />
                            )
                        })
                    }


                </div>
            </Paper>
        </>
    )
}

const ValueLabelComponent = (props) => {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const calculateUF = (primaries, beneficiaries, base_uf, ges) => {
    // FORMULA TO USE:
    // [sum(risk_factor) x base ] + (ges x person_count)
    // (0.9 + 1.630) + (0.595) = 2.062


    // Get risk factor of person one
    let risk_factor = calculateRisk(parseInt(primaries.person_one)).cotizantes


    // if there is a second person, add it to the risk factor
    if (primaries.person_two) risk_factor += calculateRisk(parseInt(primaries.person_two)).cotizantes


    // cotizantes UF
    let person_count = primaries.person_two ? 2 : 1


    // Calculate Cargas count
    person_count += beneficiaries.length
    beneficiaries.forEach(carga => risk_factor += calculateRisk(parseInt(carga.age)).cargas)

    // Add the total rf to total ges x person count
    let final_uf = (risk_factor * base_uf) + (ges * person_count)

    return (final_uf).toFixed(3)
}

export default InitialPoint

