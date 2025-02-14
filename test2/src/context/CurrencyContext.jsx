import { createContext, useState } from "react";

export const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [fromCurrency, setFromCurrency] = useState({
    code: "USD",
    name: "United States",
    flag: "https://flagcdn.com/w40/us.png",
  });

  const [toCurrency, setToCurrency] = useState({
    code: "AUD",
    name: "Australia",
    flag: "https://flagcdn.com/w40/au.png",
  });
  const [firstAmount, setFirstAmount] = useState("");

  const value = {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    firstAmount,
    setFirstAmount,
  };
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
