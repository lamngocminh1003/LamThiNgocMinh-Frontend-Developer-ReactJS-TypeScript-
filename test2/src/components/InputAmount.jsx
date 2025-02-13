import { Grid, InputAdornment, TextField } from "@mui/material";
import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

const InputAmount = (props) => {
  const { firstAmount, setFirstAmount } = useContext(CurrencyContext);
  const { setIsValid } = props;
  const handleChange = (e) => {
    setFirstAmount(e.target.value);
    setIsValid(false);
  };
  return (
    <Grid item xs={12} md>
      <TextField
        required
        value={firstAmount}
        onChange={handleChange}
        label="Amount"
        fullWidth
        InputProps={{
          type: "number",
          min: 0,
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        inputProps={{
          min: 1,
        }}
      />
    </Grid>
  );
};

export default InputAmount;
