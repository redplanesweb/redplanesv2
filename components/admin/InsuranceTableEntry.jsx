import {
    Button,
    Paper,
    Modal,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const InsuranceTableEntry = ({ id, data, CentroMap, DataMap }) => {
    // =========================================================================
    // STATES
    // =========================================================================
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);


    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        alert("deleting disabled")
        setOpen(false)
    }

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <>
            <Paper elevation={1} className="entry-list-container">
                <h1 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '.5em' }}>{data.plan_name}</h1>

                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <EntryValue label="Plan ID" value={data.plan_id} />
                        <EntryValue label="Plan Type" value={data.plan_type} />
                        <EntryValue label="Provider" value={data.provider} />
                        <EntryValue label="Base UF" value={data.uf_value} />
                    </div>
                    <span style={{ flex: 1 }}></span>
                    <div>
                        <Button style={{ marginLeft: '1em' }} variant="contained" className="btn-primary">View PDF</Button>
                        <Button style={{ marginLeft: '1em' }} variant="contained" className="btn-primary">Edit</Button>
                        <Button style={{ marginLeft: '1em' }} variant="contained" color="secondary" onClick={handleOpen}>Delete</Button>
                    </div>
                </div>

                <div style={{ marginTop: '1em' }}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className="entry-list-accordion">
                        <AccordionSummary>
                            <h1>More Details</h1>
                        </AccordionSummary>
                        <AccordionDetails className="summary">
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
                                        {
                                            data.medical_centers.map((row) => {
                                                return (
                                                    <TableRow key={row.name}>
                                                        <TableCell component="th" scope="row" >
                                                            {
                                                                CentroMap[row.name] ? CentroMap[row.name].full_name : row.name
                                                            }
                                                        </TableCell>
                                                        <TableCell align="right">{row.hospital ? `${row.hospital}%` : ''}</TableCell>
                                                        <TableCell align="right">{row.ambulence ? `${row.ambulence}%` : ''}</TableCell>
                                                        <TableCell align="right">{row.urgent ? `${row.urgent}%` : ''}</TableCell>
                                                    </TableRow>
                                                )

                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </div>

            </Paper >

            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className="modal-confirm">
                    <h1 style={{ fontSize: '1.2rem' }}>Are you sure you want to delete the following plan?</h1>

                    <div style={{ margin: '1em 0' }}>
                        <h2>Plan: <span>{data.plan_name}</span></h2>
                        <h2>ID: <span>{data.plan_id}</span></h2>
                    </div>


                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button style={{ margin: '0 .5em' }} variant="contained" onClick={handleClose}>Cancel</Button>
                        <Button style={{ margin: '0 .5em' }} color="secondary" variant="contained" onClick={handleDelete}>Confirm</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

// =============================================================================
// ADDITIONAL COMPONENTS
// =============================================================================
const EntryValue = ({ label, value }) => {
    return (
        <div style={{ width: '150px' }}>
            <h2>{label}</h2>
            <p>{value}</p>
        </div>
    )
}

export default InsuranceTableEntry