import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { HOST_URL } from "../utils/constant";
import { toast } from "react-hot-toast"; // Import toast
import LoadingIcon from "../components/LoadingIcon"; // Import your loading icon component
import BackButton from "./BackButton";
import { Copy } from "lucide-react";

const BuyMachine = () => {
  const [machineData, setMachineData] = useState({});
  const [qrData, setQRData] = useState({});
  const [utr, setUtr] = useState("");
  const [confirmUtr, setConfirmUtr] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [copySuccess, setCopySuccess] = useState(false);


  const navigate = useNavigate();
  const { machine_id } = useParams();
  const user = useSelector((state) => state.user.userInfo);

  // Fetch machine data and QR code data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const machineResponse = await axios.get(
          `${HOST_URL}/display+machine/get+single+display+machine/${machine_id}`
        );
        setMachineData(machineResponse.data);

        const qrResponse = await axios.get(
          `${HOST_URL}/qrcode/getactive+qrcode`
        );
        setQRData(qrResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to fetch machine data."); // Show error toast
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (!user) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [navigate, user, machine_id]);



  const formData = {
    user_id: user.user_id,
    phone_number: user.phone_number,
    first_name: user.first_name,
    last_name: user.last_name,
    machine_id: machineData.machine_id,
    machine_price: machineData.price,
    qrcode_id: qrData.qrcode_id,
    upi_id: qrData.upi_id,
    utr_number: null,
    is_success: false,
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(formData.upi_id)
      .then(() => {
        setCopySuccess(true);
        console.log("hello");
        
        setTimeout(() => setCopySuccess(false), 2000); // Hide after 2 seconds
      })
      .catch((error) => {
        console.error("Error copying the referral code: ", error);
      });
  };

  // Function to check if UTR exists in pending or success deposits

  function checkUtr(checkutr) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get userId from session storage (assuming you have a decryption function)
        const userId = user.user_id;

        // API URLs for pending and successful deposits
        const pendingUrl = `${HOST_URL}/pending+request/getPendingDepositDto/${userId}`;
        const successUrl = `${HOST_URL}/pending+request/getSuccessDepositDto/${userId}`;

        // Fetch pending and success deposits using axios
        const [pendingResponse, successResponse] = await Promise.all([
          axios.get(pendingUrl),
          axios.get(successUrl),
        ]);

        // Combine both pending and success deposits into a single list
        const allDeposits = [...pendingResponse.data, ...successResponse.data];

        console.log("pending and succesfull deposit", allDeposits);

        // Convert checkutr to an integer (UTR number to check)
        const utrnum = parseInt(checkutr, 10);

        // Check if the UTR exists in the combined list of deposits
        const exists = allDeposits.some(
          (deposit) => deposit.utr_number === utrnum
        );

        // Resolve with "exists" or "new" based on whether UTR is found
        resolve(exists ? "exists" : "new");
      } catch (error) {
        console.error("Error checking UTR:", error);
        reject("Error occurred while checking UTR");
      }
    });
  }

  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    if (utr !== confirmUtr) {
      toast.error("UTRs do not match. Please try again."); // Error toast
      return;
    }

    setLoading(true); // Start loading
    formData.utr_number = utr;

    try {
      const check = await checkUtr(utr);
      if (check === "exists") {
        toast.error("UTR already exists, cannot submit again."); // Show error toast
      
        return;
      }

      const savetoPendingUrl = `${HOST_URL}/pending+request/submit+request`;
      await axios.post(savetoPendingUrl, formData);
      toast.success("You have Buy The Machine Successfully"); // Success toast
      navigate("/machine_listing");
    } catch (error) {
      console.error("Error occurred during submitting UTR:", error);
      toast.error("Error occurred while submitting UTR."); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-gray-800 relative min-h-screen flex justify-center items-center px-5 py-16">
      <div className="absolute top-3 left-4 md:top-10 md:left-10">

     
      <BackButton />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Buy Machine
        </h1>
       

        {loading && (
          <div className="flex justify-center items-center h-screen">
            <LoadingIcon />
          </div>
        )}

        {/* Machine Information */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {machineData.machine_name}
            </h2>
            <img
              src={machineData.url}
              alt={machineData.machine_name}
              className="w-full h-auto rounded-md mb-4"
            />
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Price:</span> ₹{machineData.price}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Description:</span>{" "}
              {machineData.description}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Purchased by:</span>{" "}
              {user.first_name}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="w-full relative md:w-1/2 text-center flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Pay via UPI
            </h3>
            {qrData.qrcode_image && (
              <img
                src={qrData.qrcode_image}
                alt="QR Code"
                className="w-40 h-40 mx-auto mb-4"
              />
            )}
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">UPI ID:</span> {qrData.upi_id}
            </p>
            <button onClick={handleCopy} className="flex items-center">
                <Copy className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-500 transition duration-200" />
              </button>
              {copySuccess && (
                <div className="absolute bottom-3 bg-gray-300 text-black text-[10px] p-2 rounded-md  transition-opacity duration-300 opacity-100">
                  UPI Copied
                </div>
              )}
          </div>
        </div>

        {/* UTR Form */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Submit Your UTR
          </h3>
          <form onSubmit={handleUtrSubmit} className="flex flex-col">
            {/* UTR Input */}
            <label className="text-gray-700 mb-2 font-semibold" htmlFor="utr">
              Enter UTR (Unique Transaction Reference)
            </label>
            <input
              type="text"
              id="utr"
              name="utr"
              value={utr}
              maxLength={12}
              onChange={(e) => setUtr(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter UTR"
              required
            />

            {/* Confirm UTR Input */}
            <label
              className="text-gray-700 mb-2 font-semibold"
              htmlFor="confirmUtr"
            >
              Confirm UTR
            </label>
            <input
              type="text"
              id="confirmUtr"
              name="confirmUtr"
              value={confirmUtr}
              onChange={(e) => setConfirmUtr(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter UTR"
              required
            />

            {/* Error message if UTRs do not match */}
            {utr !== confirmUtr && confirmUtr.length > 0 && (
              <p className="text-red-600 mb-4">
                UTRs do not match. Please try again.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={utr !== confirmUtr || loading} // Disable while loading
              className={`${
                utr === confirmUtr && !loading ? "bg-blue-600" : "bg-gray-400"
              } text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition`}
            >
              {loading ? "Submitting..." : "Submit UTR"}{" "}
              {/* Change button text based on loading state */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyMachine;
