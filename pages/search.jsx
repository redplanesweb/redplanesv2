// =============================================================================
// IMPORTS
// =============================================================================
import Slide from "@material-ui/core/Slide";
import Grow from "@material-ui/core/Grow";
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
  Switch,
} from "@material-ui/core";

import useDarkMode from "use-dark-mode";
import Head from "next/head";

import InsuranceEntry from "@components/search/InsuranceEntrySearch";
import ButtonWrapper from "@components/ui/MuiButtonWrapper";
import SearchPopUp from "@components/search/SearchPopup";
import Sidebar from "@components/search/Sidebar";

let iMin = 20000;
let iMax = 400000;

// =============================================================================
// INITIAL POINT
// =============================================================================
const InitialPoint = ({ firebase }) => {
  const [primary, setPrimary] = React.useState({
    person_one: null,
    person_two: null,
  });
  const [cargasList, setCargasList] = React.useState([]);
  const [submit, setSubmit] = React.useState(false);

  const [people, setPeople] = React.useState(null);
  const [maps, setMaps] = React.useState(null);
  const [currentRate, setCurrentRate] = React.useState(null);

  // =========================================================================
  // HANDLE SUBMIT
  // =========================================================================
  const handleSubmit = async () => {
    // Validate Data
    if (!primary.person_one) {
      alert("Please submit at least one age");
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*                        GETTING LIVE UF TO PESO DATA                        */
    /* -------------------------------------------------------------------------- */

    const request = await (await fetch("https://mindicador.cl/api")).json();
    const price = request.uf.valor;
    console.log({ firebase });

    // Query Database
    firebase
      .firestore()
      .collection("maps")
      .get()
      .then(function (querySnapshot) {
        firebase
          .firestore()
          .collection("uf_to_peso")
          .get()
          .then(snapshot => {
            // get latest price
            // let rate = snapshot.docs[0].data()
            let rate = price;

            // get map data
            let docs = querySnapshot.docs.map(doc => {
              return {
                id: doc.id,
                data: doc.data(),
              };
            });

            // flatten map data
            let maps = {
              ageMap: docs[docs.map(e => e.id).indexOf("age_map")].data,
              centroMap: docs[docs.map(e => e.id).indexOf("centro_map")].data,
              providerMap:
                docs[docs.map(e => e.id).indexOf("provider_map")].data,
              regionMap: docs[docs.map(e => e.id).indexOf("region_map")].data,
              planTypeMap: docs[docs.map(e => e.id).indexOf("plan_type")].data,
            };

            // Update States
            setMaps(maps);
            setPeople({ primary: primary, beneficiaries: cargasList });
            // setCurrentRate(rate.uf_to_peso)
            setCurrentRate(rate);
            setSubmit(true);
          });
      });
  };

  // =========================================================================
  // MAIN RETURN
  // =========================================================================
  return (
    <React.Fragment>
      <Head>
        <title>Search</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <SearchPopUp
        primary={primary}
        setPrimary={setPrimary}
        cargasList={cargasList}
        setCargasList={setCargasList}
        submit={submit}
        handleSubmit={handleSubmit}
      />

      <SearchLayout
        submit={submit}
        people={people}
        maps={maps}
        firebase={firebase}
        currentRate={currentRate}
      />
    </React.Fragment>
  );
};

// =============================================================================
// SEARCH PAGE LAYOUT
// =============================================================================
const SearchLayout = ({ submit, people, maps, firebase, currentRate }) => {
  // =========================================================================
  // UI STATES
  // =========================================================================
  const darkMode = useDarkMode(true);
  const [darkModeSwitch, setDarkModeSwitch] = React.useState(darkMode.value);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // =========================================================================
  // DATA STATES
  // =========================================================================
  const [entries, setEntries] = React.useState(null);
  const [filter, setFilter] = React.useState(null);
  const [clients, setClient] = React.useState(people);

  // =========================================================================
  // FUNCTIONS
  // =========================================================================
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handeDarkModeSwitch = event => {
    let checked = event.target.checked;
    checked ? darkMode.enable() : darkMode.disable();
    setDarkModeSwitch(checked);
  };

  // =========================================================================
  // WHEN SUBMISSION IS SUCCESSFUL
  // =========================================================================
  React.useEffect(() => {
    if (!submit) return;

    console.log("Loading Search ...");

    // Query Entries
    firebase
      .firestore()
      .collection("insurance_entries")
      .get()
      .then(snapshot => {
        // Grab Raw Data
        let payload = snapshot.docs.map(doc => doc.data());

        // Inject entries with price
        let final_payload = payload.map((entry, index) => {
          let template = entry;

          let uf = entry.uf_value;
          console.log(maps.providerMap[entry.provider]);
          let ges_value = maps.providerMap[entry.provider].ges
            ? maps.providerMap[entry.provider].ges
            : 0;
          let final_uf = calculateUF(
            people.primary,
            people.beneficiaries,
            uf,
            ges_value,
          );
          let price = final_uf * currentRate;

          // inject
          template.price = parseInt(price.toFixed(0));
          template.total_uf = final_uf;
          return template;
        });

        // save local record of entries
        localStorage.setItem(
          "insurance_entries",
          JSON.stringify(final_payload),
        );

        // update states
        setFilter({
          providers: Object.keys(maps.providerMap),
          region: Object.keys(maps.regionMap),
          price_range: [iMin, iMax],
          clinics: Object.keys(maps.centroMap),
          people: people,
          first_time: true,
          coverage: { hospital: 0, ambulence: 0, urgent: 0, dental: 0 },
        });

        setClient(people);
        setEntries(final_payload);
      });
  }, [submit, people]);

  // =========================================================================
  // FILTER
  // =========================================================================
  React.useEffect(() => {
    if (!filter) return;

    console.log("CURRENT_FILTER:");
    console.log(filter);

    // if (filter.first_time) {
    //     setFilter({ ...filter, first_time: false })
    //     return
    // }

    let allEntries = JSON.parse(localStorage.getItem("insurance_entries"));

    let results = allEntries.filter((entry, index) => {
      // Filter Provider
      let provider = filter.providers.includes(entry.provider);

      // Filter Region

      console.log({ entry });
      let region = entry.region.some(region => filter.region.includes(region));

      // Filter By clinic
      let clinic = entry.medical_centers.some(center =>
        filter.clinics.includes(center.name),
      );

      // Filter by percentages
      let hospital = entry.medical_centers.some(
        center => parseInt(center.hospital) >= filter.coverage.hospital,
      );
      let ambulence = entry.medical_centers.some(
        center => parseInt(center.ambulence) >= filter.coverage.ambulence,
      );
      let urgent = entry.medical_centers.some(
        center => parseInt(center.urgent) >= filter.coverage.urgent,
      );
      //let dental = entry.data.medical_centers.some(center => parseInt(center.dental) >= filter.coverage.dental)

      console.log(provider);
      console.log(region);
      console.log(clinic);
      console.log(hospital);
      console.log(urgent);

      // If all these are true, we return the entry
      return provider && region && clinic & hospital & ambulence & urgent;
    });

    console.log(results);

    setEntries(results);
  }, [filter]);

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <main
      className="search-main-app-container dm-body-background"
      style={{ minHeight: "100vh" }}
    >
      <Paper
        elevation={1}
        style={{ marginBottom: "1em" }}
        className="dm-panel-three-background"
      >
        <Container
          style={{ padding: ".25em 0", display: "flex", alignItems: "center" }}
          className="menu-container"
        >
          {/* <h1 style={{ fontSize: '2rem' }} className="logo-title">Isapres.cl</h1> */}
          <img
            src="/images/logo.svg"
            style={{ maxHeight: "55px" }}
            className="logo"
          />
          <span style={{ flex: 1 }} className="mobile-hide"></span>
          <div className="mobile-hide">
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              className="dm-text-1"
            >
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
            <CircularProgress
              color="secondary"
              style={{
                display: entries ? "none" : "block",
                margin: "2em auto",
              }}
            />

            {entries &&
              entries
                .filter(
                  entry =>
                    parseInt(entry.price) < parseInt(filter.price_range[1]) &&
                    parseInt(entry.price) > parseInt(filter.price_range[0]),
                )
                .map((entry, index) => {
                  console.log(entry);
                  let isLibre = false;
                  let libre = entry?.libre_eleccion;
                  let libreRows = [];
                  let medicalRows = entry.medical_centers;

                  if (libre?.hospital) {
                    isLibre = true;
                    libreRows = [
                      {
                        name: "Cobertura Libre Elección",
                        hospital: libre.hospital,
                        ambulence: libre.ambulence,
                        urgent: libre.urgent,
                      },
                    ];
                  }

                  return (
                    <InsuranceEntry
                      title={entry.plan_name}
                      subTitle={entry.plan_type}
                      price={entry.price}
                      provider={entry.provider}
                      key={index}
                      rows={isLibre ? libreRows : medicalRows}
                      CentroMap={maps.centroMap}
                      DataMap={maps.regionMap}
                      PlanTypeMap={maps.planTypeMap}
                      ProviderMap={maps.providerMap}
                      totalUF={entry.total_uf}
                      baseUF={entry.uf_value}
                    />
                  );
                })}
          </Grid>
          <Grid item xs={12} md={4}>
            {entries && (
              <Sidebar
                CentroMap={maps.centroMap}
                DataMap={maps.regionMap}
                filter={filter}
                setFilter={setFilter}
                ProviderMap={maps.providerMap}
                iMin={iMin}
                iMax={iMax}
                people={clients}
                setPeople={setClient}
                currentRate={currentRate}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const calculateUF = (primaries, beneficiaries, base_uf, ges) => {
  // FORMULA TO USE:
  // [sum(risk_factor) x base ] + (ges x person_count)
  // (0.9 + 1.630) + (0.595) = 2.062

  // Get risk factor of person one
  let risk_factor = calculateRisk(parseInt(primaries.person_one)).cotizantes;

  // if there is a second person, add it to the risk factor
  if (primaries.person_two)
    risk_factor += calculateRisk(parseInt(primaries.person_two)).cotizantes;

  // cotizantes UF
  let person_count = primaries.person_two ? 2 : 1;

  // Calculate Cargas count
  person_count += beneficiaries.length;
  beneficiaries.forEach(
    carga => (risk_factor += calculateRisk(parseInt(carga.age)).cargas),
  );

  // Add the total rf to total ges x person count
  let final_uf = risk_factor * base_uf + ges * person_count;

  return final_uf.toFixed(3);
};

const calculateRisk = age => {
  if (!age || age == NaN) return { cotizantes: 0, cargas: 0 };

  if (age < 20) return risk_map["0_20"];
  else if (age >= 20 && age < 25) return risk_map["20_25"];
  else if (age >= 25 && age < 35) return risk_map["25_35"];
  else if (age >= 35 && age < 45) return risk_map["35_45"];
  else if (age >= 45 && age < 55) return risk_map["45_55"];
  else if (age >= 55 && age < 65) return risk_map["55_65"];
  else if (age >= 65) return risk_map["65"];
};

let risk_map = {
  "0_20": {
    cotizantes: 0.6,
    cargas: 0.6,
  },
  "20_25": {
    cotizantes: 0.9,
    cargas: 0.7,
  },
  "25_35": {
    cotizantes: 1.0,
    cargas: 0.7,
  },
  "35_45": {
    cotizantes: 1.3,
    cargas: 0.9,
  },
  "45_55": {
    cotizantes: 1.4,
    cargas: 1.0,
  },
  "55_65": {
    cotizantes: 2.0,
    cargas: 1.4,
  },
  65: {
    cotizantes: 2.4,
    cargas: 2.2,
  },
};

export default InitialPoint;
