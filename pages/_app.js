// =============================================================================
// IMPORTS
// =============================================================================
import firebase from '@components/firebase'
import Head from 'next/head';
import create from 'zustand'
import Providers from '@components/ui/Provider'
import { GlobalStyles } from '../src/global'
import '../src/framework.css'


// =============================================================================
// GLOBAL STATES
// =============================================================================
const useStore = create(set => ({
    regionMap: {},
    centerMap: {},
    providerMap: {},
    ageMap: {},
    planType: {},
    mapsLoaded: false,
    setData: (data) => set(state => ({
        regionMap: data.region,
        centerMap: data.center,
        providerMap: data.provider,
        ageMap: data.age,
        planType: data.planType,
        mapsLoaded: data.success
    }))
}))


// =============================================================================
// EXPORT
// =============================================================================
const MyApp = ({ Component, pageProps }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <Providers>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <GlobalStyles />
                <Component {...pageProps} useStore={useStore} firebase={firebase} />
            </Providers>

        </React.Fragment>
    )

}

export default MyApp