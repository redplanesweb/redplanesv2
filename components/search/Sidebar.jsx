
// =============================================================================
// IMPORTS
// =============================================================================
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


// =============================================================================
// MAIN
// =============================================================================
const Sidebar = (props) => {
    const { CentroMap, DataMap, filter, setFilter, ProviderMap, iMin, iMax, setPeople, people, currentRate } = props

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


export default Sidebar