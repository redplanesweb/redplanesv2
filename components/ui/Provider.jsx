import { lightTheme, darkTheme } from '../../src/base_theme';
import { ThemeProvider } from 'styled-components'
import useDarkMode from 'use-dark-mode'

export default ({ children }) => {

    // =========================================================================
    // MOUNT HANDLING
    // =========================================================================
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => { setMounted(true) }, [])


    // =========================================================================
    // DARK MODE STUFF
    // =========================================================================
    const darkMode = useDarkMode(true)
    const theme = darkMode.value ? darkTheme : lightTheme

    return (
        <ThemeProvider theme={theme}>
            {mounted && children}
        </ThemeProvider>
    )
}