import { Autocomplete, Grid, TextField, Box } from "@mui/material";
import useAxios from "../hooks/useAxios";

const SelectCountry = (props) => {
  const { value, setValue, label } = props;
  const [data, loaded, error] = useAxios("https://restcountries.com/v3.1/all");

  if (loaded) {
    return (
      <Grid item xs={4} md={3}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
    );
  }
  if (error) {
    return "Something went wrong!";
  }


  const dataCountries = data
    .filter((item) => "currencies" in item)
    .map((item) => ({
      code: Object.keys(item.currencies)[0],
      name: item.name.common,
      flag: item.flags.png,
    }));

  return (
    <Grid item xs={4} md={3}>
      <Autocomplete
        value={value}
        disableClearable
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        options={dataCountries}
        getOptionLabel={(option) => `${option.code} - ${option.name}`}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            {...props}
          >
            <img
              src={option.flag}
              alt={option.name}
              loading="lazy"
              width="24"
              height="16"
              style={{ borderRadius: "2px", objectFit: "cover" }}
            />
            {option.code} - {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              startAdornment: value?.flag ? (
                <img
                  src={value.flag}
                  alt={value.name}
                  loading="lazy"
                  width="24"
                  height="16"
                  style={{
                    borderRadius: "2px",
                    objectFit: "cover",
                    marginRight: 8,
                  }}
                />
              ) : null,
            }}
          />
        )}
      />
    </Grid>
  );
};

export default SelectCountry;
