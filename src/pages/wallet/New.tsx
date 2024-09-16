import React, { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";
import { fiat } from "@getalby/lightning-tools"; // Import the conversion function

export function New() {
  const [amount, setAmount] = React.useState(0); // Current input
  const [total, setTotal] = React.useState(0); // Total amount
  const [totalInSats, setTotalInSats] = React.useState(0); // Total amount in sats
  const [label, setLabel] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [currency, setCurrency] = React.useState("SATS"); // State for currency selection
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);

  useEffect(() => {
    // Load currency from local storage on component mount
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []); // Run once on mount

  useEffect(() => {
    const updateTotalInSats = async () => {
      if (currency !== "SATS") {
        const newTotalInSats = await fiat.getSatoshiValue({ amount: total, currency });
        setTotalInSats(newTotalInSats);
      } else {
        setTotalInSats(total); // Set totalInSats directly if currency is SATS
      }
    };

    updateTotalInSats();
  }, [total, currency]); // Re-run when total or currency changes

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!total) {
      return;
    }
    try {
      setLoading(true);
      const invoice = await provider?.makeInvoice({
        amount: totalInSats.toString(), // Use total for the invoice
        defaultMemo: label,
      });
      navigate(`../pay/${invoice.paymentRequest}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice: " + error);
      setLoading(false);
    }
  }

  const handleNumberClick = (num: string) => {
    const newAmount = parseInt(amount.toString() + num); // Concatenate the new number without leading zero
    const newTotal = total - amount + newAmount;
    setAmount(newAmount);
    setTotal(newTotal);
  };

  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency); // Save currency to local storage
    if (newCurrency !== "SATS") {
      const newTotalInSats = await fiat.getSatoshiValue({amount: total, currency: newCurrency}); // Convert total to sats
      setTotalInSats(newTotalInSats);
    } 
  };

  const handleDelete = () => {
    const newAmount = parseInt(amount.toString().slice(0, -1)) || 0; // Remove the last character
    const newTotal = total - amount + newAmount; // Update the total directly
    setAmount(newAmount);
    setTotal(newTotal);
  };

  const handleClear = () => {
    setAmount(0);
    setTotal(0); 
  };

  const handlePlus = () => {
    setAmount(0)
    
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full flex-col items-center justify-between">
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center justify-center w-full flex-1"
        >
          <div className="flex flex-col items-center justify-center w-full flex-1">
            <div className="flex flex-col my-8 items-center justify-center">
              <p className="text-6xl p-2 w-[21ch] whitespace-nowrap text-center mx-auto">
                {amount}
              </p>
              <select
                className="text-xl p-2 w-[12ch] whitespace-nowrap text-center mx-auto bg-transparent text-gray-400"
                value={currency}
                onChange={handleCurrencyChange} // Handle currency change
              >
                <option value="SATS">SATS</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button" // Prevent form submission
                  className="btn btn-primary w-full h-16 flex-grow text-3xl flex items-center justify-center"
                  onClick={() => handleNumberClick(`${num}`)}
                >
                  {num}
                </button>
              ))}
              
              <span
                className="w-full h-16 flex-grow text-3xl flex items-center justify-center"
              >
              </span>
              
              <button
                type="button" // Prevent form submission
                className="btn btn-primary w-full h-16 flex-grow text-3xl flex items-center justify-center"
                onClick={() => handleNumberClick(`${0}`)}
              >
                0
              </button>

              <span
                className="w-full h-16 flex-grow text-3xl flex items-center justify-center"
              >
              </span>

              <button
                type="button" // Prevent form submission
                className="btn btn-light w-full h-8 flex-grow text-l flex items-center justify-center text-gray-400"
                onClick={handleClear}
              >
                Clear
              </button>

              <button
                type="button" // Prevent form submission
                className="btn btn-light w-full h-8 flex-grow text-l flex items-center justify-center text-gray-400"
                onClick={handleDelete}
              >
                Del
              </button>

              <button
                type="button" // Prevent form submission
                className="btn btn-light w-full h-8 flex-grow text-2xl font-bold flex items-center justify-center"
                onClick={handlePlus} // Add to total
              >
                +
              </button>
              
            </div>
          </div>
          <button
            className="btn btn-primary w-full h-16 text-4xl font-bold"
            type="submit"
            disabled={isLoading || total <= 0} // Disable if total is 0
          >
            Charge {totalInSats} sats ({total} {currency})
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
