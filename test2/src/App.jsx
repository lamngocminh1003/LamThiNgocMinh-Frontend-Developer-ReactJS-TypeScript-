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
  const codeFromCurrency = fromCurrency?.code || "";
  const codeToCurrency = toCurrency?.code || "";

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
  const [prevFromCurrency, setPrevFromCurrency] = useState(fromCurrency);
  const [prevToCurrency, setPrevToCurrency] = useState(toCurrency);

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (
      firstAmount !== prevAmount ||
      fromCurrency !== prevFromCurrency ||
      toCurrency !== prevToCurrency
    ) {
      setIsDisabled(false);
      setIsValid(false);

      setPrevAmount(firstAmount);
      setPrevFromCurrency(fromCurrency);
      setPrevToCurrency(toCurrency);
    }
  }, [firstAmount, fromCurrency, toCurrency]);
  const handleSubmit = async () => {
    let newErrors = validateAmount(firstAmount);

    if (Object.keys(newErrors).length > 0) {
      toast.error(newErrors.amount);
      setIsValid(false);
      return;
    }

    setLoading(true);
    setIsDisabled(true);

    setTimeout(async () => {
      setIsValid(true);
      setLoading(false);

      if (firstAmount) {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${codeFromCurrency}/${codeToCurrency}/${firstAmount}`;
        try {
          const res = await axios.get(API_URL);
          if (res?.data?.conversion_rate) {
            setResultCurrency(res.data.conversion_rate);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }, 2000);
  };

  return (
    <Container maxWidth="sm" sx={{ ...boxStyles, marginTop: "65px" }}>
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
          <Typography
            variant="h5"
            sx={{ marginTop: "5px", fontWeight: "bold", color: "#27445D" }}
          >
            {firstAmount} {fromCurrency?.code} = {resultCurrency * firstAmount}{" "}
            {toCurrency?.code}
          </Typography>
        </Box>
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
