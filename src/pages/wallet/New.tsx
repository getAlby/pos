import React, { FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";
import { fiat } from "@getalby/lightning-tools"; 
import { Edit } from "../../components/icons/Edit";

export function New() {
  const [amount, setAmount] = React.useState(0); // Current input
  const [total, setTotal] = React.useState(0); // Total amount
  const [totalInSats, setTotalInSats] = React.useState(0); // Total amount in sats
  const [label, setLabel] = React.useState("BuzzPay");
  const [isLoading, setLoading] = React.useState(false);
  const [currency, setCurrency] = React.useState("SATS"); // State for currency selection
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Load currency and label from local storage on component mount
    const savedCurrency = localStorage.getItem("selectedCurrency");
    const savedLabel = localStorage.getItem("label");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    if (savedLabel) {
      setLabel(savedLabel);
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Load label from query parameter and save it to local storage
    const queryParams = new URLSearchParams(location.search);
    const labelFromQuery = queryParams.get("label") || queryParams.get("name");
    if (labelFromQuery) {
      setLabel(labelFromQuery); // Set the label if it exists in the query
      localStorage.setItem("label", labelFromQuery); // Save the label to local storage
    }
  }, [location]); // Run once on mount and when location changes

  useEffect(() => {
    const updateTotalInSats = async () => {
      if (currency !== "SATS") {
        const newTotalInSats = await fiat.getSatoshiValue({ amount: total/100, currency });
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

  const handleSetLabel = () => {
    const newLabel = prompt("Enter a label:");
    if (newLabel) setLabel(newLabel); // Set the label if provided
  };

  const formatNumber = (num: number) => {
    if (currency === "SATS") {
      return num.toString();
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(num / 100);
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
            <div className="flex flex-col mb-4 items-center justify-center">
              <p className="text-4xl pb-2 w-[21ch] whitespace-nowrap text-center mx-auto">
                {formatNumber(amount)}
              </p>
              <div className="flex items-center justify-center">
                <select
                  className="text-l m-2 w-[12ch] whitespace-nowrap text-center mx-auto bg-transparent text-gray-400 text-center"
                  value={currency}
                  onChange={handleCurrencyChange} // Handle currency change
                >
                  <option value="SATS">SATS</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="CHF">CHF</option>
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                  <option value="NZD">NZD</option>
                  <option value="SEK">SEK</option>
                  <option value="NOK">NOK</option>
                  <option value="DKK">DKK</option>
                  <option value="CNY">CNY</option>
                  <option value="RUB">RUB</option>
                  <option value="INR">INR</option>
                  <option value="BRL">BRL</option>
                  <option value="MXN">MXN</option>
                  <option value="TRY">TRY</option>
                  <option value="ZAR">ZAR</option>
                </select>
                <span className="mb-2 text-gray-400 ml-4">{label}</span>
                <button 
                  onClick={handleSetLabel}
                  style={{ opacity: 0.3 }} 
                  className="ml-2"
                >
                  <Edit />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button" // Prevent form submission
                  className="btn btn-primary w-full h-16 flex-grow text-2xl flex items-center justify-center"
                  onClick={() => handleNumberClick(`${num}`)}
                >
                  {num}
                </button>
              ))}
              
              <span
                className="w-full h-16 flex-grow text-2xl flex items-center justify-center"
              >
              </span>
              
              <button
                type="button" // Prevent form submission
                className="btn btn-primary w-full h-16 flex-grow text-2xl flex items-center justify-center"
                onClick={() => handleNumberClick(`0`)}
              >
                0
              </button>

              <button
                type="button" // Prevent form submission
                className="btn btn-primary w-full h-16 flex-grow text-2xl flex items-center justify-center"
                onClick={() => handleNumberClick(`00`) }
              >
                .00
              </button>

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
            className="btn btn-primary w-full h-16 text-xl font-bold flex-grow-0"
            type="submit"
            disabled={isLoading || total <= 0} // Disable if total is 0
          >
            Charge {totalInSats} sats{currency !== "SATS" && ` (${formatNumber(total)})`}
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
