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
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';

const menuConfig = [
    { name: "Subir planes", url: "/admin/dashboard" },
    { name: "Planes en el sistema", url: "/admin/entries" },
    { name: "Configuración", url: "/admin/settings" },
    { name: "Mass Upload", url: "/admin/mass-upload" },
]

// =============================================================================
// RENDER
// =============================================================================
const Sidebar = ({ menuOpen }) => {
    return (
        <List component="nav" aria-label="secondary mailbox folders" style={{ display: menuOpen ? 'block' : 'none' }}>
            {
                menuConfig.map(entry => {
                    return (
                        <ListItemLink href={entry.url}>
                            <ListItemText primary={entry.name} />
                        </ListItemLink>
                    )
                })
            }
        </List>
    )
}


const ListItemLink = (props) => {
    return <ListItem button component="a" {...props} />;
}


export default Sidebar