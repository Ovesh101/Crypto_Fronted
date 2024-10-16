import { useState, useEffect } from "react";
import { HOST_URL } from "../utils/constant";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import LoadingIcon from "./LoadingIcon";
import MessageBox from "./MessageBox";

const WithDrawal = () => {
  const [userId] = useLocalStorage("authToken"); // 1 hour expiry
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [successWithdrawals, setSuccessWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getPendingUrl = `${HOST_URL}/user+withdrawal/getsingle+pending+withdrawals/${userId}`;
    const getSuccessUrl = `${HOST_URL}/user+withdrawal/getsingle+success+withdrawals/${userId}`;

    // Fetch pending withdrawals
    const fetchPendingWithdrawals = async () => {
      try {
        const response = await fetch(getPendingUrl);
        const data = await response.json();
        setPendingWithdrawals(data);
      } catch (error) {
        console.error("Error fetching pending withdrawals:", error);
      }
    };

    // Fetch successful withdrawals
    const fetchSuccessWithdrawals = async () => {
      try {
        const response = await fetch(getSuccessUrl);
        const data = await response.json();
        setSuccessWithdrawals(data);
      } catch (error) {
        console.error("Error fetching successful withdrawals:", error);
      }
    };

    if (!userId) {
      navigate("/login");
    } else {
      // Start loading
      setLoading(true);

      // Fetch data
      Promise.all([
        fetchPendingWithdrawals(),
        fetchSuccessWithdrawals(),
      ]).finally(() => setLoading(false)); // Stop loading after fetching
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon /> {/* Show loading icon while loading */}
      </div>
    );
  }

  return (

    <>

    <MessageBox name="withdrawal" />

    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center text-violet-700">
        Withdrawals
      </h1>

      {/* Tab Buttons */}
      <div className="flex flex-col md:flex-row justify-center mb-6">
        <button
          className={`px-6 py-3 rounded-l-lg md:rounded-l-lg md:rounded-r-none transition-colors duration-300 ${
            activeTab === "pending"
              ? "bg-violet-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Withdrawals
        </button>
        <button
          className={`px-6 py-3 rounded-r-lg md:rounded-l-none md:rounded-r-lg transition-colors duration-300 ${
            activeTab === "success"
              ? "bg-violet-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("success")}
        >
          Successful Withdrawals
        </button>
      </div>

      {/* Pending Withdrawals Table */}
      {activeTab === "pending" && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Pending Withdrawals
          </h2>
          <table className="min-w-full overflow-x-scroll bg-white shadow-md rounded-lg border border-gray-200">
            <thead className="bg-violet-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Date
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Amount
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingWithdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className="border-t border-gray-200 hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    {withdrawal.withdrawal_date}
                  </td>
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    ${withdrawal.withdrawal_amount}
                  </td>
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    {withdrawal.is_success ? "Success" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Successful Withdrawals Table */}
      {activeTab === "success" && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Successful Withdrawals
          </h2>
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead className="bg-violet-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Date
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Amount
                </th>
                <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wide">
                  Withdrawal Status
                </th>
              </tr>
            </thead>
            <tbody>
              {successWithdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className="border-t border-gray-200 hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    {withdrawal.withdrawal_date}
                  </td>
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    ${withdrawal.withdrawal_amount}
                  </td>
                  <td className="py-3 px-6 text-gray-800 text-sm">
                    {withdrawal.is_success ? "Success" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default WithDrawal;
