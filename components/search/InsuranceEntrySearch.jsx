// =============================================================================
// IMPORTS
// =============================================================================
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    TextField,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormGroup,
    Checkbox,
    FormHelperText
} from '@material-ui/core';
import ButtonWrapper from '@components/ui/MuiButtonWrapper'
import Zoom from '@material-ui/core/Zoom';
import Slide from '@material-ui/core/Slide';
import Provider from '@components/ui/Provider';

// =============================================================================
// MAIN
// =============================================================================
const InsuranceEntry = (props) => {
    const {
        title,
        subTitle,
        price,
        provider,
        rows,
        CentroMap,
        DataMap,
        PlanTypeMap,
        ProviderMap,
        totalUF,
        baseUF
    } = props



    // =========================================================================
    // STATES
    // =========================================================================
    const [expanded, setExpanded] = React.useState(false);
    const [topRow, setTopRow] = React.useState([])
    const [detailRow, setDetailRow] = React.useState([])
    const [modalOpen, setModalOpen] = React.useState(false)

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    // =========================================================================
    // EFFECTS
    // =========================================================================
    React.useEffect(() => {

        // get copy
        let copy = rows.map(entry => entry)

        // First Sort
        let sorted = copy.sort((first, second) => (parseInt(first.hospital) < parseInt(second.hospital)) ? 1 : -1)
        let allEntriesSorted = sorted.map(entry => entry)
        let qrows = sorted.splice(3)

        // Update States
        setTopRow(sorted)
        setDetailRow(allEntriesSorted)

    }, [rows])



    // =========================================================================
    // RETURN
    // =========================================================================
    return (
        <Zoom in={true} style={{ transitionDelay: true ? '500ms' : '0ms' }}>
            <Paper elevation={1} className="insurance-search-entry dm-panel-three-background" style={{ marginBottom: '1.5em' }}>


                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >

                    <ModalContent
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        rows={detailRow}
                        CentroMap={CentroMap}
                        title={title}
                        type={PlanTypeMap[subTitle].name}
                        logo={ProviderMap[provider].logo} />

                </Modal>


                <div style={{ display: 'flex' }}>
                    <div className="entry-content">

                        <div className="content-top">
                            <h2 className="entry-title">{title}</h2>
                            {/* <p className="entry-description">{PlanTypeMap[subTitle].name}</p>
                            <span className="entry-span">{PlanTypeMap[subTitle].description}</span> */}
                        </div>

                        <div className="content-bottom">
                            <div className="entry-upper-content">
                                <div className="entry-quick-info">
                                    <TableWrapper rows={rows} CentroMap={CentroMap} className="insurance-entry-table" />
                                </div>

                                <div className="entry-quick-info">
                                    <TableWrapper rows={topRow} CentroMap={CentroMap} className="insurance-entry-table-mobile mobile-show" />
                                </div>

                            </div>


                            <div className="content-right">
                                <PricingInfo ProviderMap={ProviderMap} PlanTypeMap={PlanTypeMap} subTitle={subTitle} totalUF={totalUF} price={price} provider={provider} setModalOpen={setModalOpen} />
                            </div>
                        </div>

                    </div>
                </div>
            </Paper>
        </Zoom>
    )
}

// =============================================================================
// ENTRY CONTENT
// =============================================================================
const TableWrapper = ({ rows, CentroMap, className }) => {
    return (
        <TableContainer component={Paper} className={className}>
            <Table size="small" aria-label="a dense table" >
                <TableHead>
                    <TableRow >
                        <TableCell style={{ width: '100%' }}>PRESTADORES</TableCell>
                        <TableCell align="right">HOSPITALARIA</TableCell>
                        <TableCell align="right">AMBULATORIA</TableCell>
                        <TableCell align="right">URGENCIA</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {


                        return (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row" >
                                    {CentroMap[row.name] ? CentroMap[row.name].full_name : row.name}
                                </TableCell>
                                <TableCell align="right">{row.hospital ? `${row.hospital}${parseInt(row.hospital) >= 0 ? '%' : ''}` : ''}</TableCell>
                                <TableCell align="right">{row.ambulence ? `${row.ambulence}${parseInt(row.ambulence) >= 0 ? '%' : ''}` : ''}</TableCell>
                                <TableCell align="right">{row.urgent ? `${row.urgent}${parseInt(row.urgent) >= 0 ? '%' : ''}` : ''}</TableCell>
                            </TableRow>
                        )
                    }

                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const PricingInfo = ({ ProviderMap, PlanTypeMap, subTitle, totalUF, price, provider, setModalOpen }) => {
    return (
        <>
            <div className="price-content">
                <h3 className="entry-price dm-text-1">${price}</h3>
                <p className="dm-text-2" style={{ fontSize: '12px', textAlign: 'center' }}>Valor en UF: {totalUF}</p>
                {/* <p style={{ marginTop: '-.5em', marginBottom: '.5em', textAlign: 'center' }}>Base UF: {baseUF}</p> */}
                <p className="entry-description">{PlanTypeMap[subTitle].name}</p>
                <img className="" src={ProviderMap[provider].logo} style={{ height: 30 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="button-content">


                <ButtonWrapper variant="contained" style={{ width: '186px', marginTop: '5px', marginBottom: '7px' }} click={() => setModalOpen(true)} className="btn-primary hover-grow">VER DETALLES</ButtonWrapper>

                <ButtonWrapper variant="contained" className="hover-grow btn-secondary">CONTRATAR</ButtonWrapper>

            </div>

            {/* <div style={{ height: 50 }}>
                <img className="mobile-hide" src={ProviderMap[provider].logo} style={{ height: '100%' }} />
            </div> */}
        </>
    )
}
// =============================================================================
// MODAL
// =============================================================================
const ModalContent = ({ setModalOpen, rows, CentroMap, title, type, logo, modalOpen }) => {
    // =========================================================================
    // STATES
    // =========================================================================
    const [inputRUT, setInputRUT] = React.useState('')
    const [inputEMAIL, setInputEMAIL] = React.useState('')
    const [inputNUMBER, setInputNUMBER] = React.useState('')
    const [value, setValue] = React.useState('no');
    const [state, setState] = React.useState({
        dental: false,
        cesantia: false,
        discount: false,
    });


    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSelectChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    React.useEffect(() => {
        console.log("modal rows")
        console.log(rows)
    })

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <Slide direction="down" in={modalOpen} mountOnEnter unmountOnExit>


            <Paper style={{ maxWidth: '90vw', padding: '1.5em', margin: '0 auto', marginTop: '10vh', maxHeight: '80vh' }} className="dm-panel-three-background detail-modal" >

                <img src={logo} style={{ height: '50px' }} />
                <div className="detail-modal-container">
                    <div className="detail-modal-left">
                        <div>
                            <h1>{title}</h1>
                            <h2>{type}</h2>
                        </div>

                        <div style={{ padding: '1em' }}>

                            {/* DESKTOP TABLE */}
                            <TableContainer component={Paper} className="insurance-entry-table">
                                <Table size="small" aria-label="a dense table" >
                                    <TableHead>
                                        <TableRow >
                                            <TableCell >PRESTADORES</TableCell>
                                            <TableCell align="right">HOSPITALARIA</TableCell>
                                            <TableCell align="right">AMBULATORIA</TableCell>
                                            <TableCell align="right">URGENCIA</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => {
                                            console.log("stats")
                                            console.log(row.hospital)

                                            return (
                                                <TableRow key={row.name}>
                                                    <TableCell component="th" scope="row" >
                                                        {CentroMap[row.name] ? CentroMap[row.name].full_name : row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.hospital ? `${row.hospital}${parseInt(row.hospital) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                    <TableCell align="right">{row.ambulence ? `${row.ambulence}${parseInt(row.ambulence) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                    <TableCell align="right">{row.urgent ? `${row.urgent}${parseInt(row.urgent) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                </TableRow>
                                            )
                                        }

                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* MOBILE TABLE */}
                            <TableContainer component={Paper} className="insurance-entry-table-mobile mobile-show">
                                <Table size="small" aria-label="a dense table" >
                                    <TableHead>
                                        <TableRow >
                                            <TableCell align="right">HOSPITALARIA</TableCell>
                                            <TableCell align="right">AMBULATORIA</TableCell>
                                            <TableCell align="right">URGENCIA</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.name} style={{ position: 'relative' }}>
                                                <TableCell align="right">{row.hospital ? `${row.hospital}${parseInt(row.hospital) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                <TableCell align="right">{row.ambulence ? `${row.ambulence}${parseInt(row.ambulence) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                <TableCell align="right">{row.urgent ? `${row.urgent}${parseInt(row.urgent) >= 0 ? '%' : ''}` : ''}</TableCell>
                                                {/* <p style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{CentroMap[row.name] ? CentroMap[row.name].full_name : row.name}</p> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>


                        </div>

                        <div>
                            <p>¿Deseas contratar beneficios adicionales de Banmédica?</p>
                            <FormControl component="fieldset" >
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={state.dental} onChange={handleSelectChange} name="dental" />}
                                        label={<p>Cobertura 90% Dental por $9.149 (0.32UF)<span className="mas-vendido">MAS VENDIDO</span></p>} />
                                    <FormControlLabel
                                        control={<Checkbox checked={state.cesantia} onChange={handleSelectChange} name="cesantia" />}
                                        label="Sesgura de cesantia 5 meses por $15.295 (0.53UF)"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={state.discount} onChange={handleSelectChange} name="discount" />}
                                        label="Descuento de 40% en farmacias salcobrand for $4.792 (0.17UF)"
                                    />
                                </FormGroup>
                            </FormControl>
                        </div>
                    </div>

                    <Paper className="detail-modal-right">
                        <h1>Solicita este plan a un ejecutivo de ventas.</h1>
                        <ul style={{ listStyle: 'none', margin: '.5em 0 1em 0' }}>
                            <li><img src="/images/icons/check-mark.svg" />Contrata online en minutos</li>
                            <li><img src="/images/icons/check-mark.svg" />El valor del plan es el orginal</li>
                            <li><img src="/images/icons/check-mark.svg" />Tus datos están protegidos</li>
                        </ul>

                        <TextField value={inputRUT} onChange={e => setInputRUT(e.target.value)} label="RUT" variant="outlined" size="small" />
                        <TextField value={inputEMAIL} onChange={e => setInputEMAIL(e.target.value)} label="Correo electronico" variant="outlined" size="small" />
                        <TextField value={inputNUMBER} onChange={e => setInputNUMBER(e.target.value)} label="Numero de telefono" variant="outlined" size="small" />


                        <FormControl component="fieldset" style={{ margin: '1em 0' }}>
                            <FormLabel component="legend">Ya estás en esta isapre?</FormLabel>
                            <RadioGroup name="gender1" value={value} onChange={handleChange} style={{ flexDirection: 'row' }}>
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                <FormControlLabel value="yes" control={<Radio />} label="Si" />
                            </RadioGroup>
                        </FormControl>
                        <Button style={{ width: '100%', marginBottom: '1em' }} variant="contained" color="secondary" className="hover-grow">CONTRATAR</Button>

                        <p style={{ textAlign: 'center' }}>Recibirás la llamada de un ejecutivo que resolverá todas tus dudas y te guiará en el proceso de suscripción a este plan.</p>

                        <p style={{ textAlign: 'center', fontSize: '.75rem' }}>Aceptas los términos y condiciones.</p>
                    </Paper>
                </div>

                <div style={{ display: 'flex' }}>
                    <span className="mobile-hide" style={{ flex: 1 }}></span>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 1.5em' }} className="button-container">
                        <Button style={{ width: '100%', marginTop: '1em' }} onClick={() => setModalOpen(false)} variant="contained" color="primary" className="hover-grow">VER CONTRATO</Button>

                    </div>
                </div>
            </Paper>
        </Slide>
    )
}

export default InsuranceEntry