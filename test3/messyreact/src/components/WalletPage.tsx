import React, { useMemo } from "react";
import "./WalletPage.css";

// WalletBalance Type
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// Mock implementation of missing hooks
const useWalletBalances = (): WalletBalance[] => [
  { currency: "ETH", amount: 1.5, blockchain: "Ethereum" },
  { currency: "OSMO", amount: 100, blockchain: "Osmosis" },
  { currency: "ARB", amount: 50, blockchain: "Arbitrum" },
  { currency: "ZIL", amount: 2000, blockchain: "Zilliqa" },
  { currency: "NEO", amount: 10, blockchain: "Neo" },
];

const usePrices = (): Record<string, number> => ({
  ETH: 2500,
  OSMO: 1.2,
  ARB: 0.9,
  ZIL: 0.03,
  NEO: 15,
});

// WalletRow component
const WalletRow = ({
  currency,
  amount,
  usdValue,
}: {
  currency: string;
  amount: number;
  usdValue: number;
}) => (
  <tr className="wallet-row">
    <td>{currency}</td>
    <td>{amount.toFixed(2)}</td>
    <td>${usdValue.toFixed(2)}</td>
  </tr>
);

// Props for WalletPage
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  // Priority mapping function
  const getPriority = (blockchain: string): number => {
    const priorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorities[blockchain] ?? -99;
  };

  // Memoized sorted balances
  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]);

  return (
    <div className="wallet-container" {...rest}>
      <h2 className="wallet-title">WALLET BALANCES</h2>
      <table className="wallet-table">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Amount</th>
            <th>USD Value</th>
          </tr>
        </thead>
        <tbody>
          {sortedBalances.map((balance: WalletBalance) => {
            const usdValue = (prices[balance.currency] || 0) * balance.amount;
            return (
              <WalletRow
                key={balance.currency}
                currency={balance.currency}
                amount={balance.amount}
                usdValue={usdValue}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WalletPage;
