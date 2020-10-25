// =============================================================================
// IMPORTS
// =============================================================================
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Select,
    InputLabel,
    FormControl,
    Grid,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core'

import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone'
import InsuranceEntry from '@components/admin/InsuranceEntry'


// =============================================================================
// MAIN RENDER
// =============================================================================
const AppPlan = ({ CentroMap, DataMap, firebase }) => {

    // =========================================================================
    // PAGE STATES
    // =========================================================================
    const [activeStep, setActiveStep] = React.useState(0)
    const [rows, setRows] = React.useState([])
    const [done, setDone] = React.useState(false)
    const [insuranceEntry, setInsuranceEntry] = React.useState(false)
    const [file, setFile] = React.useState(null)


    // =========================================================================
    // ON INSURANCE ENTRY STATE CHANGE
    // =========================================================================
    React.useEffect(() => {
        if (localStorage.getItem('add-entry-state')) {
            localStorage.setItem('add-entry-state', JSON.stringify(EMPTY_ENTRY))
            setInsuranceEntry(JSON.parse(localStorage.getItem('add-entry-state')))
        }
        else {
            localStorage.setItem('add-entry-state', JSON.stringify(EMPTY_ENTRY))
            setInsuranceEntry(JSON.parse(localStorage.getItem('add-entry-state')))
        }
    }, [])

    React.useEffect(() => {
        console.log(insuranceEntry)
        localStorage.setItem('add-entry-state', JSON.stringify(insuranceEntry))

        // prevent errors on first load
        if (insuranceEntry) {
            let array = insuranceEntry.medical_centers.map(entry => entry)
            setRows(array)
        }

    }, [insuranceEntry])

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const postEntry = (fileURL) => {
        let PAYLOAD = {
            plan_name: insuranceEntry.plan_name,
            plan_contact: insuranceEntry.plan_contact,
            plan_type: insuranceEntry.plan_type,
            pdf_link: "url",
            uf_value: insuranceEntry.uf_value,
            provider: insuranceEntry.provider,
            plan_id: insuranceEntry.plan_id,
            region: insuranceEntry.region,
            medical_centers: insuranceEntry.medical_centers,
            libre_eleccion: insuranceEntry.libre_eleccion
        }


        // Post to FaunaDB
        console.log("PAYLOAD")
        console.log(PAYLOAD)

        firebase.firestore().collection('insurance_entries').doc().set(PAYLOAD)

    }


    const getS3 = () => {

        // First we must access S3 and request upload URLS
        fetch('/.netlify/functions/s3-upload')
            .then(response => response.json())
            .then(data => {
                let urls = JSON.parse(data)
                let putURL = urls.putUrl
                let fileURL = putURL.match(/http.+?pdf/g)[0]

                console.log(urls)
                console.log(fileURL)

                // Upload PDF to S3
                fetch(putURL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/pdf' },
                    body: file
                })
                    // Once PDF is uploaded, Upload entry to FAUNADB
                    .then(() => {
                        postEntry(fileURL)
                    })
                    .catch(err => {
                        console.log("Error Caught: ", err)
                    })
            })
            .catch(err => {
                console.log("Error Caught: ", err)
            })
    }

    const handleEntrySubmit = () => {
        console.log("submitting")
        postEntry()
    }
    // =========================================================================
    // RENDERS
    // =========================================================================
    return (
        insuranceEntry &&
        <div>
            <StepperContainer activeStep={activeStep} setActiveStep={setActiveStep} />

            <div>
                <InsuranceEntry
                    title={insuranceEntry.plan_name}
                    subTitle={insuranceEntry.subTitle}
                    description={insuranceEntry.description}
                    price={insuranceEntry.price}
                    logo={insuranceEntry.provider}
                    pdf={insuranceEntry.pdf}
                    quickDetails={insuranceEntry.quickDetails}
                    rows={rows}
                    CentroMap={CentroMap}
                    DataMap={DataMap}
                />
            </div>


            <div>
                {
                    getStepContent(
                        activeStep,
                        insuranceEntry,
                        setInsuranceEntry,
                        file,
                        setFile,
                        done,
                        setDone,
                        setActiveStep,
                        handleEntrySubmit,
                        CentroMap,
                        DataMap
                    )}
            </div>
        </div>
    )
}

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
const StepperContainer = ({ activeStep, setActiveStep }) => {
    const steps = getSteps();

    // =========================================================================
    // STEPPER STATES
    // =========================================================================
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Paper elevation={1} style={{ padding: '1em', marginBottom: '1em', }} className="insurance-add-stepper-container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button disabled={activeStep === 0} onClick={handleBack} variant="contained"
                    className="btn-primary">
                    Atrás
                    </Button>


                <Stepper activeStep={activeStep} style={{ flex: 1 }} className="insurance-add-stepper">
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps} >
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                <Button
                    variant="contained"
                    onClick={handleNext}
                    className="btn-primary"
                >
                    {activeStep === steps.length - 1 ? 'FINAL' : 'SIGUIENTE'}
                </Button>
            </div>
        </Paper>
    )
}

// =============================================================================
// ADDITIONAL COMPONENTS
// =============================================================================
const GeneralDetails = ({ insuranceEntry, setInsuranceEntry, file, setFile, CentroMap, DataMap }) => {

    // =========================================================================
    // INSURANCE STATES
    // =========================================================================
    const [planName, setPlanName] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).plan_name || '')
    const [planUF, setPlanUF] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).uf_value || '')
    const [planProvider, setPlanProvider] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).provider || '')
    const [planType, setPlanType] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).plan_type || '')
    const [planID, setPlanID] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).plan_id || '')
    const [planContact, setPlanContact] = React.useState(JSON.parse(localStorage.getItem('add-entry-state')).plan_contact || '')


    // =========================================================================
    // EFFECTS
    // =========================================================================
    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, plan_name: planName })
    }, [planName])

    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, uf_value: planUF })
    }, [planUF])

    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, provider: planProvider })
    }, [planProvider])

    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, plan_type: planType })
    }, [planType])
    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, plan_id: planID })
    }, [planID])
    React.useEffect(() => {
        setInsuranceEntry({ ...insuranceEntry, plan_contact: planContact })
    }, [planContact])



    // =========================================================================
    // MAIN RETURN
    // =========================================================================
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} >
                <h1 style={{ marginBottom: '1em' }}>Detalles generales</h1>
                <form className="insurance-add-general-detail-form-container">
                    <TextField label="Nombre del plan" variant="outlined" onChange={e => setPlanName(e.target.value)} value={planName} className="material-input" />
                    <TextField type="number" label="Valor Base UF" variant="outlined" onChange={e => setPlanUF(e.target.value)} value={planUF} className="material-input" />

                    <FormControl variant="outlined" className="material-input">
                        <InputLabel htmlFor="isapre">Isapre</InputLabel>
                        <Select
                            native
                            value={planProvider}
                            onChange={event => { setPlanProvider(event.target.value) }}
                            inputProps={{ name: 'isapre' }}

                        >
                            <option aria-label="Isapre" value="" />
                            <option value={'banmedica'}>Banmedica</option>
                            <option value={'colmena'}>Colmena</option>
                            <option value={'cruz_blanca'}>CruzBlanca</option>
                            <option value={'consalud'}>Consalud</option>
                            <option value={'nueva_masvida'}>Nueva Masvida</option>
                            <option value={'vida_tres'}>Vida Tres</option>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" className="material-input">
                        <InputLabel htmlFor="plan_type">Tipo de plan</InputLabel>
                        <Select
                            native
                            value={planType}
                            onChange={event => { setPlanType(event.target.value) }}
                            inputProps={{ name: 'plan_type' }}
                        >
                            <option value=""></option>
                            <option value={'libre_eleccion'}>Plan Libre Eleccion</option>
                            <option value={'cerrado'}>Plan Cerrado</option>
                            <option value={'preferente'}>Plan Preferente</option>
                        </Select>
                    </FormControl>

                    <TextField label="Código del plan" variant="outlined" onChange={e => setPlanID(e.target.value)} value={planID} className="material-input" />


                    {/* <TextField label="Plan Contact" variant="outlined" onChange={e => setPlanContact(e.target.value)} value={planContact} className="material-input" /> */}
                </form>
            </Grid>


            <Grid item xs={12} md={3}>
                <h1 style={{ marginBottom: '1em' }}>Contrato del plan</h1>
                <div className="pdf-dropzone">
                    <DropzoneArea
                        filesLimit={1}
                        dropzoneText="Subir PDF"
                        acceptedFiles={['application/pdf']}
                        onChange={e => setFile(e[0])}
                        clearOnUnmount={false}
                    />
                    <p style={{ textAlign: 'center', fontSize: '.8rem', margin: '.5em 0' }}>{file ? file.name : ''}</p>
                </div>
            </Grid>

        </Grid>
    )
}

const AdditionalDetails = ({ insuranceEntry, setInsuranceEntry, CentroMap, DataMap }) => {
    // =========================================================================
    // INPUT STATES
    // =========================================================================
    const [allChecked, setAllChecked] = React.useState(false)
    const [freeElection, setFreeElection] = React.useState(false)
    const [regionCheckboxes, setRegionCheckbox] = React.useState(intialState(DataMap))
    const [medicalCheckboxes, setMedicalCheckboxes] = React.useState(intialState(CentroMap))

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleRegionCheckbox = (event) => {
        setRegionCheckbox({ ...regionCheckboxes, [event.target.name]: event.target.checked });
    };

    const handleMedicalCheckbox = (event) => {
        setMedicalCheckboxes({ ...medicalCheckboxes, [event.target.name]: event.target.checked });
    }

    const handleAllRegionCheck = (event) => {
        let checked = !allChecked

        if (checked) setInsuranceEntry({ ...insuranceEntry, region: Object.keys(DataMap) })
        else setInsuranceEntry({ ...insuranceEntry, region: [] })

        setAllChecked(checked)
    }


    // =========================================================================
    // EFFECTS
    // =========================================================================

    // Handles the checking of checkboxes based on what's in insurance entry
    React.useEffect(() => {

        // payloads
        let medicalPayload = {}
        let regionPayload = {}

        // Get List of Medical Names active
        let medical_names = insuranceEntry.medical_centers.map(entry => entry.name)
        Object.keys(medicalCheckboxes).forEach(key => {
            if (medical_names.includes(key)) medicalPayload[key] = true
            else medicalPayload[key] = false
        })

        // Get Region list
        let region_names = insuranceEntry.region.map(entry => entry)
        Object.keys(regionCheckboxes).forEach(key => {
            if (region_names.includes(key)) regionPayload[key] = true
            else regionPayload[key] = false
        })


        setMedicalCheckboxes(medicalPayload)
        setRegionCheckbox(regionPayload)
    }, [insuranceEntry])




    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <h1>Cobertura:</h1>
                <form >

                    <div style={{ width: '100%', display: 'flex' }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={allChecked}
                                    onChange={handleAllRegionCheck}
                                />
                            }
                            label="All Regions"
                            style={{ width: 285 }}
                        />


                    </div>



                    {
                        Object.keys(DataMap).map(key => {
                            let entry = DataMap[key]

                            return (
                                <CheckboxWrapper
                                    label={entry.name}
                                    name={key}
                                    state={regionCheckboxes}
                                    handler={handleRegionCheckbox}
                                    inputs={false}
                                    medicalCheckboxes={medicalCheckboxes}
                                    setMedicalCheckboxes={setMedicalCheckboxes}
                                    setInsuranceEntry={setInsuranceEntry}
                                    insuranceEntry={insuranceEntry}
                                    CentroMap={CentroMap}
                                    DataMap={DataMap}
                                />
                            )
                        })
                    }
                </form>
            </Grid>

            <Grid item xs={12} md={8} >
                <h1>Centros Medicos</h1>
                <form style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* SELECT ALL */}
                    <div style={{ width: '100%', display: 'flex' }}>

                        <FreeElectionWrapper
                            state={freeElection}
                            label={"Cobertura Libre Elección"}
                            name={"libre_eleccion"}
                            setFreeElection={setFreeElection}
                            setAllChecked={setAllChecked}
                            insuranceEntry={insuranceEntry}
                            setInsuranceEntry={setInsuranceEntry}
                            DataMap={DataMap}
                        />
                    </div>

                    {
                        Object.keys(CentroMap).map(key => {
                            let entry = CentroMap[key]

                            return (
                                <CheckboxWrapper
                                    label={entry.full_name}
                                    name={key}
                                    state={medicalCheckboxes}
                                    handler={handleMedicalCheckbox}
                                    inputs={true}
                                    setInsuranceEntry={setInsuranceEntry}
                                    insuranceEntry={insuranceEntry}
                                    CentroMap={CentroMap}
                                    DataMap={DataMap}
                                />
                            )
                        })
                    }

                </form>
            </Grid>
        </Grid>
    )
}

const Summary = ({ done, handleEntrySubmit, setActiveStep, setDone, CentroMap, DataMap }) => {
    return (
        <div>
            <h1>Click Submit To Upload</h1>
            {
                done ?
                    <Button variant="contained" color="secondary" onClick={() => { setActiveStep(0), setDone(false) }} className="btn-primary">Done. Add Another</Button>
                    :
                    <Button variant="contained" color="primary" onClick={handleEntrySubmit} className="btn-primary">Submit</Button>
            }
        </div>
    )
}

// =============================================================================
// CHECKBOX WRAPPER
// =============================================================================
const CheckboxWrapper = ({ name, label, state, handler, inputs, insuranceEntry, setInsuranceEntry, medicalCheckboxes, setMedicalCheckboxes, CentroMap, DataMap }) => {
    const [H, setH] = React.useState(0)
    const [A, setA] = React.useState(0)
    const [U, setU] = React.useState(0)


    const handleClick = () => {

        // opposite because state hasn't been updated yet
        let checked = !state[name]

        // =====================================================================
        // MEDICAL CENTER INPUT
        // =====================================================================
        if (inputs) {

            // If we are selecting
            if (checked) {
                // Region Coverage
                let current_regions = insuranceEntry.region.map(entry => entry)
                let new_region = CentroMap[name].covered_by

                // Medical Coverage
                let current_medical_centers = insuranceEntry.medical_centers.map(entry => entry)
                current_medical_centers.push({
                    name: name,
                    hospital: H,
                    ambulence: A,
                    urgent: U
                })

                // Check if region is already being provided for
                if (!current_regions.includes(new_region)) {
                    current_regions.push(new_region)
                }

                // Update state
                setInsuranceEntry({ ...insuranceEntry, medical_centers: current_medical_centers, region: current_regions })
            }

            // If we're deselecting
            else {
                let current_regions = insuranceEntry.region.map(entry => entry)
                let current_medical_centers = insuranceEntry.medical_centers.map(entry => entry)
                let regionName = CentroMap[name].covered_by

                // Remove entry from medical_centers
                let filtered_centers = current_medical_centers.filter(entry => entry.name != name)

                // Remove region entry
                let filtered_regions = current_regions.filter(region => region != regionName)


                // if another medical entry is still providing in a region
                // just append it back to filtered region
                for (var i = 0; i = filtered_centers.length; i++) {
                    let center = filtered_centers[i];
                    let coverage = CentroMap[name].covered_by

                    // if (coverage == regionName) {
                    //     filtered_regions.push(regionName)
                    //     break
                    // }
                }

                // Update state
                setInsuranceEntry({ ...insuranceEntry, medical_centers: filtered_centers, region: filtered_regions })
            }
        }

        // =====================================================================
        // REGION INPUT
        // =====================================================================
        else {
            if (checked) {
                let current_regions = insuranceEntry.region.map(entry => entry)
                current_regions.push(name)
                setInsuranceEntry({ ...insuranceEntry, region: current_regions })
            }
            else {
                let current_regions = insuranceEntry.region.map(entry => entry)
                let filtered_region = current_regions.filter(entry => entry != name)
                setInsuranceEntry({ ...insuranceEntry, region: filtered_region })
            }
        }

    }

    const handleValueCHange = (e, letter) => {
        let value = e.target.value

        // Update medical records
        let current_medical_centers = insuranceEntry.medical_centers.map(entry => entry)
        current_medical_centers.forEach(center => {
            if (center.name == name) {
                center.hospital = letter == 'H' ? value : H
                center.ambulence = letter == 'A' ? value : A
                center.urgent = letter == 'U' ? value : U
            }
        })

        // Update State
        setInsuranceEntry({ ...insuranceEntry, medical_centers: current_medical_centers })

        // Change state on the cell
        if (letter === 'H') setH(value)
        if (letter === 'A') setA(value)
        if (letter === 'U') setU(value)
    }

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div style={{ width: inputs ? '50%' : '100%', display: 'flex' }}>
            <FormControlLabel
                control={<Checkbox checked={state[name]} onChange={handleClick} name={name} />}
                label={label}
                style={{ width: 285 }}
                className="checkbox-label"
            />
            {
                (state[name] && inputs) &&
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField type="text" label="H" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'H')} value={H ? H : ''} />
                    <TextField type="text" label="A" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'A')} value={A ? A : ''} />
                    <TextField type="text" label="U" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'U')} value={U ? U : ''} />
                </div>
            }
        </div>

    )
}

const FreeElectionWrapper = ({ state, name, label, setFreeElection, setAllChecked, insuranceEntry, setInsuranceEntry, DataMap }) => {
    const [H, setH] = React.useState(0)
    const [A, setA] = React.useState(0)
    const [U, setU] = React.useState(0)


    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleClick = () => {

        let checked = !state

        let libre_value = {
            hospital: H,
            ambulence: A,
            urgent: U,
            dental: null
        }

        if (checked) setInsuranceEntry({ ...insuranceEntry, region: Object.keys(DataMap), libre_eleccion: libre_value })
        else setInsuranceEntry({ ...insuranceEntry, region: [], libre_eleccion: { hospital: null, ambulence: null, urgent: null, dental: null } })

        setAllChecked(checked)
        setFreeElection(checked)
    }


    const handleValueCHange = (e, letter) => {
        let value = e.target.value


        let libre_values = {
            hospital: letter == 'H' ? value : H,
            ambulence: letter == 'A' ? value : A,
            urgent: letter == 'U' ? value : U,
            dental: null
        }


        if (state) setInsuranceEntry({ ...insuranceEntry, libre_eleccion: libre_values })

        // Change state on the cell
        if (letter === 'H') setH(value)
        if (letter === 'A') setA(value)
        if (letter === 'U') setU(value)
    }

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div style={{ width: '50%', display: 'flex' }}>
            <FormControlLabel
                control={<Checkbox checked={state} onChange={handleClick} name={name} />}
                label={label}
                style={{ width: 285 }}
                className="checkbox-label"
            />
            {
                (state) &&
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField type="text" label="H" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'H')} value={H ? H : ''} />
                    <TextField type="text" label="A" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'A')} value={A ? A : ''} />
                    <TextField type="text" label="U" variant="outlined" size="small" className="material-input no-arrows short" onChange={e => handleValueCHange(e, 'U')} value={U ? U : ''} />
                </div>
            }
        </div>
    )
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
// Step Names
const getSteps = () => {
    return ['Enter Details', 'Select Options', 'Review'];
}

// Step Content
const getStepContent = (step, insuranceEntry, setInsuranceEntry, file, setFile, done, setDone, setActiveStep, handleEntrySubmit, CentroMap, DataMap) => {
    switch (step) {
        case 0:
            return <GeneralDetails insuranceEntry={insuranceEntry} setInsuranceEntry={setInsuranceEntry} file={file} setFile={setFile} CentroMap={CentroMap} DataMap={DataMap} />;
        case 1:
            return <AdditionalDetails insuranceEntry={insuranceEntry} setInsuranceEntry={setInsuranceEntry} CentroMap={CentroMap} DataMap={DataMap} />;
        case 2:
            return <Summary done={done} setActiveStep={setActiveStep} handleEntrySubmit={handleEntrySubmit} setDone={setDone} CentroMap={CentroMap} DataMap={DataMap} />;
        default:
            return 'Unknown step';
    }
}

// Fill out initial Checkbox state to all false
const intialState = (mapping) => {
    const payload = {}

    Object.keys(mapping).forEach(entry => {
        payload[entry] = false
    })

    return payload
}

// =============================================================================
// UTILITY CONSTS
// =============================================================================
const EMPTY_ENTRY = {
    plan_name: "",
    plan_contact: "",
    plan_type: "",
    pdf_link: "",
    uf_value: "",
    provider: "",
    plan_id: "",
    region: [],
    medical_centers: [],
    libre_eleccion: { hospital: null, ambulence: null, urgent: null, dentist: null },
}

export default AppPlan