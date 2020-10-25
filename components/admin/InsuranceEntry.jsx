// =============================================================================
// IMPORTS
// =============================================================================
import {
    Button,
    Paper,
    Container,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';

// =============================================================================
// MAIN
// =============================================================================
const InsuranceEntry = (props) => {
    const {
        title,
        subTitle,
        description,
        price,
        logo,
        pdf,
        prestadores,
        hospitalaria,
        ambulatoria,
        urgencia,
        quickDetails,
        rows,
        CentroMap,
        DataMap,
    } = props



    // =========================================================================
    // STATES
    // =========================================================================
    const [expanded, setExpanded] = React.useState(false);
    const [topRow, setTopRow] = React.useState([])
    const [detailRow, setDetailRow] = React.useState([])

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
        let qrows = sorted.splice(3)

        setTopRow(sorted)
        setDetailRow(qrows)

    }, [rows])



    // =========================================================================
    // RETURN
    // =========================================================================
    return (
        <Paper elevation={1} className="insurance-search-entry dm-panel-three-background">
            <div style={{ display: 'flex', padding: '0.5em' }}>

                <div className="entry-content">

                    <div className="entry-upper-content">
                        <div className="content-left">

                            <h2 className="entry-title">{title}</h2>
                            <p className="entry-description">{subTitle}</p>
                            <span className="entry-span">{description}</span>
                        </div>
                        <div className="entry-quick-info">

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
                                        {topRow.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row" >
                                                    {/* {CentroMap[row.name].full_name} */}
                                                </TableCell>
                                                <TableCell align="right">{row.hospital ? `${row.hospital}%` : ''}</TableCell>
                                                <TableCell align="right">{row.ambulence ? `${row.ambulence}%` : ''}</TableCell>
                                                <TableCell align="right">{row.urgent ? `${row.urgent}%` : ''}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                    </div>


                    <div className="content-right">

                        <h3 className="entry-price">${price}</h3>
                        <Button variant="contained" color="primary" size="small" className="btn-primary">View PDF</Button>
                        <Button variant="contained" color="secondary" size="small">Contract</Button>

                        <div style={{ height: 50, marginTop: '1em' }}>

                            <img src={getLogoURL(logo)} style={{ height: '100%' }} />
                        </div>
                    </div>


                </div>
            </div>

            <div style={{ flex: 1, marginTop: '0em' }} className="insurance-entry-quick-detail">
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        style={{ display: 'flex' }}
                        className="panel-summary"
                    >
                        <p style={{ textAlign: 'center', flex: 1, margin: 0 }}>Quick Details</p>
                    </AccordionSummary>

                    <AccordionDetails className="panel-details">

                        <TableContainer component={Paper} style={{ width: '100%' }} className="insurance-entry-table">
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>PRESTADORES</TableCell>
                                        <TableCell align="right">HOSPITALARIA</TableCell>
                                        <TableCell align="right">AMBULATORIA</TableCell>
                                        <TableCell align="right">URGENCIA</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detailRow.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell component="th" scope="row" >
                                                {/* {CentroMap[row.name].full_name} */}
                                            </TableCell>
                                            <TableCell align="right">{row.hospital ? `${row.hospital}%` : ''}</TableCell>
                                            <TableCell align="right">{row.ambulence ? `${row.ambulence}%` : ''}</TableCell>
                                            <TableCell align="right">{row.urgent ? `${row.urgent}%` : ''}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                    </AccordionDetails>

                </Accordion>
            </div>
        </Paper>
    )
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const getLogoURL = (option_value) => {
    switch (option_value) {
        case 'banmedica':
            return "/images/insurance_companies/logo_banmedica.png"
        case 'colmena':
            return "/images/insurance_companies/logo_colmena.png"
        case 'cruz_blanca':
            return "/images/insurance_companies/logo_cruzblanca.png"
        case 'consalud':
            return "/images/insurance_companies/logo_consalud.png"
        case 'nueva_masvida':
            return "/images/insurance_companies/logo_nueva_masvida.png"
        case 'vida_tres':
            return "/images/insurance_companies/logo_vida_tres.png"
        default:
            return ''
    }
}
export default InsuranceEntry