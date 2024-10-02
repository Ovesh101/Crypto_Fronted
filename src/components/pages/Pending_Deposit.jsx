import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { HOST_URL } from "../../utils/constant";
import axios from "axios";
import {
  addApprovedDeposit,
  addPendingDeposit,
} from "../../redux/features/AdminSlice";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../utils/hooks/useLocalStorage";
import LoadingIcon from "../LoadingIcon";
import toast from "react-hot-toast";
import BackButton from "../BackButton";


const Pending_Deposit = () => {
  const pending_deposit =
    useSelector((state) => state.admin.admin.pending_deposit) || [];
  
  const [loading, setLoading] = useState(true); // Loading state
  const [flag, setFlag] = useState(false);
  const [userId, setUserId] = useLocalStorage("authToken"); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(pending_deposit.length / itemsPerPage);
  const currentItems = pending_deposit.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    console.log('useeffect called');
    
    const getPendingDepositsUrl = `${HOST_URL}/pending+request/getall`;
    const fetchPendingDeposit = async () => {
      try {
        const response = await axios.get(getPendingDepositsUrl);
        dispatch(addPendingDeposit(response.data));
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching pending deposits:", error);
        setLoading(false); // Stop loading on error
      }
    };

    if (!userId) {
      navigate("/login");
    } else {
      fetchPendingDeposit();
    }
  }, [flag, userId]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const handleApprove = async (item) => {
    try {
      const response = await axios.post(
        `${HOST_URL}/pending+request/approve+request`,
        item
      );
      dispatch(addApprovedDeposit(response.data));
      if (response.data) {
        toast.success("Deposit approved successfully:")
        setFlag(true);
      }
    } catch (error) {
      
     toast.error("Error approving deposit");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#1E1E2E]">
      <h2 className="text-3xl text-white font-semibold mb-8 text-center">
        Pending Deposits
      </h2>

      <BackButton />

      {loading ? ( // Conditionally render loading spinner
        <div className="flex justify-center items-center">
          <LoadingIcon />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-700">
            <table className="min-w-full bg-gray-900 text-white">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-blue-500">
                  <th className="py-3 px-4 border-b border-gray-600">ID</th>
                  <th className="py-3 px-4 border-b border-gray-600">User ID</th>
                  <th className="py-3 px-4 border-b border-gray-600">Name</th>
                  <th className="py-3 px-4 border-b border-gray-600">UTR Number</th>
                  <th className="py-3 px-4 border-b border-gray-600">Deposited Date</th>
                  <th className="py-3 px-4 border-b border-gray-600">Machine Price</th>
                  <th className="py-3 px-4 border-b border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-800 transition-colors duration-300"
                    >
                      <td className="py-4 px-4 border-b border-gray-600">{item.id}</td>
                      <td className="py-4 px-4 border-b border-gray-600">{item.user_id}</td>
                      <td className="py-4 px-4 border-b border-gray-600">{item.first_name}</td>
                      <td className="py-4 px-4 border-b border-gray-600">{item.utr_number}</td>
                      <td className="py-4 px-4 border-b border-gray-600">{item.deposited_date}</td>
                      <td className="py-4 px-4 border-b border-gray-600">{item.machine_price}</td>
                      <td
                        onClick={() => handleApprove(item)}
                        className="py-2 px-4 cursor-pointer rounded bg-green-600 hover:bg-green-700 transition duration-300 text-center"
                      >
                        Approve
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 text-center text-gray-400 border-b border-gray-600"
                    >
                      No pending deposits
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pending_deposit.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"flex justify-center mt-6"}
              activeClassName={"bg-green-600 text-white"}
              pageClassName={"mx-1"}
              previousClassName={"mx-1"}
              nextClassName={"mx-1"}
              className="pagination flex justify-center items-center space-x-2"
              pageLinkClassName="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Pending_Deposit;
