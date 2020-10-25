// =============================================================================
// IMPORTS
// =============================================================================
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Switch,
    FormControlLabel
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useDarkMode from 'use-dark-mode'

// =============================================================================
// RENDER
// =============================================================================
const DashboardAppBar = ({ logout, setMenuOpen, menuOpen, page }) => {
    const darkMode = useDarkMode(true)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [darkModeSwitch, setDarkModeSwitch] = React.useState(darkMode.value)
    const open = Boolean(anchorEl);
    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    const handleLogout = () => {
        logout()
        setAnchorEl(null)
    }


    const handeDarkModeSwitch = event => {
        let checked = event.target.checked
        checked ? darkMode.enable() : darkMode.disable()
        setDarkModeSwitch(checked)
    }


    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <AppBar position="relative" style={{ height: '60px' }} className="app-bar-header dm-panel-one-background">
            <Toolbar style={{ display: 'flex' }}>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon onClick={() => setMenuOpen(!menuOpen)} />
                </IconButton>
                <h1 style={{ flex: 1 }}>{page}</h1>

                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={e => setAnchorEl(e.currentTarget)}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
            </Toolbar>
        </AppBar>
    )
}

export default DashboardAppBar