import { Box, Container, Grid, Typography, Button } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InputAmount from "./components/InputAmount";
import SelectCountry from "./components/SelectCountry";
import SwitchCurrency from "./components/SwitchCurrency";
import { CurrencyContext } from "./context/CurrencyContext";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    firstAmount,
  } = useContext(CurrencyContext);
  const [resultCurrency, setResultCurrency] = useState(0);
  const codeFromCurrency = fromCurrency.split(" ")[1];
  const codeToCurrency = toCurrency.split(" ")[1];

  useEffect(() => {
    if (firstAmount) {
      axios("https://api.freecurrencyapi.com/v1/latest", {
        params: {
          apikey: import.meta.env.VITE_API_KEY,
          base_currency: codeFromCurrency,
          currencies: codeToCurrency,
        },
      })
        .then((response) =>
          setResultCurrency(response.data.data[codeToCurrency])
        )
        .catch((error) => console.log(error));
    }
  }, [firstAmount, fromCurrency, toCurrency]);

  const boxStyles = {
    backgroundColor: "rgb(241, 235, 235,0.8)",
    BackdropFilter: "blur(50px)",
    textAlign: "center",
    color: "#222",
    borderRadius: 2,
    padding: "2rem 2rem",
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
    position: "relative",
  };
  const [isValid, setIsValid] = useState(false);

  const validateAmount = (amount) => {
    let newErrors = {};

    if (!amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    }

    return newErrors;
  };
  const [loading, setLoading] = useState(false);
  const [prevAmount, setPrevAmount] = useState(firstAmount);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (firstAmount !== prevAmount) {
      setIsDisabled(false);
      setPrevAmount(firstAmount);
    }
  }, [firstAmount]);
  const handleSubmit = () => {
    let newErrors = validateAmount(firstAmount);

    if (Object.keys(newErrors).length > 0) {
      toast.error(newErrors.amount);
      setIsValid(false);
      return;
    }
    setLoading(true);
    setIsDisabled(true);

    setTimeout(() => {
      setIsValid(true);
      setLoading(false);
    }, 2000);
  };
  return (
    <Container maxWidth="sm" sx={boxStyles}>
      <ToastContainer />{" "}
      <img
        src="https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg"
        alt="SWTH Token"
        width="50"
      />
      <Typography
        variant="h5"
        sx={{ marginBottom: "1rem", fontWeight: "bold", color: "#27445D" }}
      >
        Currency Swap
      </Typography>{" "}
      <Grid sx={{ marginBottom: "2rem" }}>
        <InputAmount setIsValid={setIsValid} />
      </Grid>
      <Grid>
        <SelectCountry
          value={fromCurrency}
          setValue={setFromCurrency}
          label="From"
        />
        <SwitchCurrency />
        <SelectCountry value={toCurrency} setValue={setToCurrency} label="To" />
      </Grid>
      <Button
        disabled={isDisabled}
        loading={loading}
        sx={{ margin: "1rem" }}
        variant="contained"
        onClick={handleSubmit}
        loadingPosition="start"
      >
        Submit
      </Button>
      {loading && (
        <Box sx={boxStyles}>
          <img
            src="https://media4.giphy.com/media/xTk9ZvMnbIiIew7IpW/giphy.gif"
            alt="Loading animation"
            width="60"
          />
        </Box>
      )}
      {isValid && firstAmount ? (
        <Box sx={boxStyles}>
          <Typography>
            {firstAmount} {fromCurrency} =
          </Typography>
          <Typography
            variant="h5"
            sx={{ marginTop: "5px", fontWeight: "bold" }}
          >
            {resultCurrency * firstAmount} {toCurrency}
          </Typography>
        </Box>
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
