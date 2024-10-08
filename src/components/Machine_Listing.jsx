import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import useLocalStorage from "../utils/hooks/useLocalStorage";
import { HOST_URL } from "../utils/constant";
import Loading from "./Loading";
import { addMachines } from "../redux/features/Machine_Slice";
import MessageBox from "./MessageBox";

const MachineListing = () => {
    const [token] = useLocalStorage("authToken"); // 1 hour expiry
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const machines = useSelector((store) => store.machine.machines);

    // Fetch machines from the API
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get(`${HOST_URL}/display+machine/getall+display+machines`);
                dispatch(addMachines(response.data));
            } catch (error) {
                console.error("Error fetching machines:", error);
                setError("Failed to load machines");
            } finally {
                setLoading(false);
            }
        };

        if (!token) {
            navigate("/login");
        } else {
            fetchMachines();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 1 }).map((_, index) => (
                    <Loading key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const handleMachineClicked = (id)=>{
        navigate(`/buy_machine/${id}`)
    }

    return (
        <>

        <MessageBox />
     
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            { machines && machines.length && machines.map((machine) => (
                <div className="bg-gray-800 p-6 rounded-lg shadow-md" key={machine.machine_id}>
                    <img
                        src={machine.url}
                        alt={machine.machine_name}
                        className="w-full h-40 object-contain rounded-md mb-4"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">{machine.machine_name}</h3>
                    <p className="text-lg text-gray-300 mb-1">Price: ${machine.price}</p>
                    <p className="text-sm text-gray-400 mb-3">Valid for {machine.valid_days} days</p>
                    <button onClick={()=>handleMachineClicked(machine.machine_id)} className="bg-green-500 w-full text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition">
                        Start Machine
                    </button>
                </div>
            ))}
        </div>

        </>
    );
};

export default MachineListing;
