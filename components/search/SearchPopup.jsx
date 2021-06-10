import ButtonWrapper from "@components/ui/MuiButtonWrapper";
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
  Radio,
  RadioGroup,
} from "@material-ui/core";

const SearchPopUp = ({
  primary,
  setPrimary,
  cargasList,
  setCargasList,
  submit,
  handleSubmit,
  people,
}) => {
  const [cargas, setCargas] = React.useState("no");
  const [single, setSingle] = React.useState("yes");
  const [primaryAge, setPrimaryAge] = React.useState("");
  const [seconadaryAge, setSecondaryAge] = React.useState("");

  const handleChange = (event) => {
    setSingle(event.target.value);

    // Remove any value of person two
    if (event.target.value == "yes") {
      setSecondaryAge("");
      setPrimary({ ...primary, person_two: null });
    }
  };

  const handleCargasChange = (event) => {
    setCargas(event.target.value);
  };

  const handleAddCarga = (event) => {
    let new_carga = people.beneficiaries.map((entry) => entry);
    new_carga.push({ age: "" });

    console.log(new_carga);
    setPeople({ ...people, beneficiaries: new_carga });
  };

  const addCargas = () => {
    let current_cargas = cargasList.map((entry) => entry);
    current_cargas.push({
      age: "",
    });

    setCargasList(current_cargas);
  };

  const handlePrimaryAge = (event) => {
    setPrimaryAge(event.target.value);
    setPrimary({ ...primary, person_one: event.target.value });
  };

  const handleSeconadaryAge = (event) => {
    setSecondaryAge(event.target.value);
    setPrimary({ ...primary, person_two: event.target.value });
  };

  return (
    <main
      style={{
        minHeight: submit ? "0vh" : "100vh",
        background: submit ? "none" : "rgba(0,0,0,0.5)",
        padding: submit ? "0" : "1.5em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        minWidth: "100vw",
        zIndex: 100,
      }}
    >
      <Slide direction="down" in={!submit} mountOnEnter unmountOnExit>
        <div className="initial-modal">
          <h1 style={{ fontSize: "2rem", textAlign: "center", color: "#333" }}>
            Compara Planes de Isapres
          </h1>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "400",
              marginBottom: "2em",
              textAlign: "center",
              color: "#333",
            }}
          >
            Ingresa tu edad para calcular los valores
          </h2>

          <TextField
            type="number"
            label="Cual es tu edad?"
            variant="outlined"
            onChange={handlePrimaryAge}
            value={primaryAge}
            style={{ width: "100%" }}
          />
          {single == "no" && (
            <TextField
              type="number"
              label="Pareja edad?"
              variant="outlined"
              onChange={handleSeconadaryAge}
              value={seconadaryAge}
              style={{ width: "100%", margin: "1em 0" }}
            />
          )}

          <FormControl
            component="fieldset"
            style={{ width: "100%", margin: "1em 0" }}
          >
            <FormLabel component="legend" style={{ color: "#333" }}>
              Te incorporas solo o en paraja?
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={single}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Solo yo"
                style={{ color: "#333" }}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="Me incorporo junto a mi pareja"
                style={{ color: "#333" }}
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            component="fieldset"
            style={{ width: "100%", margin: "1em 0" }}
          >
            <FormLabel component="legend" style={{ color: "#333" }}>
              Quieres añadir beneficiarios? (cargas)
            </FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={cargas}
              onChange={handleCargasChange}
            >
              <FormControlLabel
                value="no"
                style={{ color: "#333" }}
                control={<Radio />}
                label="No"
              />
              <FormControlLabel
                value="yes"
                style={{ color: "#333" }}
                control={<Radio />}
                label="Si, añadir cargas"
              />
            </RadioGroup>
          </FormControl>

          {cargas == "yes" ? (
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#333" }}>Cargas:</h2>
              {cargasList.map((carga, index) => {
                return (
                  <Carga
                    number={index + 1}
                    setCargasList={setCargasList}
                    cargasList={cargasList}
                    age={carga.age}
                  />
                );
              })}

              <Button variant="contained" size="small" onClick={addCargas}>
                +
              </Button>
            </div>
          ) : undefined}

          <ButtonWrapper
            variant="contained"
            color="primary"
            className="hover-grow"
            style={{ width: "100%", marginTop: "1em" }}
            click={handleSubmit}
          >
            VER PLANES
          </ButtonWrapper>
        </div>
      </Slide>
    </main>
  );
};

export default SearchPopUp;
