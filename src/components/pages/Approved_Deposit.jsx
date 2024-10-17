import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import useLocalStorage from "../../utils/hooks/useLocalStorage";
import LoadingIcon from "../../components/LoadingIcon"; // Import your loading icon component
import BackButton from "../BackButton";

const Approved_Deposit = () => {
  const approved_deposit =
    useSelector((state) => state.admin.admin.approved_deposit) || [];
  const [userId, setUserId] = useLocalStorage("authToken"); // 1 day expiry
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Calculate number of pages
  const pageCount = Math.ceil(approved_deposit.length / itemsPerPage);

  // Get current items for the table
  const currentItems = approved_deposit.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  console.log("current items", currentItems);

  useEffect(() => {
    // Simulating data fetch delay for demonstration
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!userId) {
          navigate("/login");
        } else {
          // Fetch your data here if needed
          // After fetching, turn off loading
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handle page change
  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  return (
    <div className="p-6 min-h-screen bg-[#1E1E2E]">
      <h2 className="text-3xl text-white font-semibold mb-8 text-center">
        Approved Deposits
      </h2>
      <BackButton />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIcon /> {/* Display loading icon */}
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
                  <th className="py-3 px-4 border-b border-gray-600">Approved Date</th>
                  <th className="py-3 px-4 border-b border-gray-600">Machine Price</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-800 transition-colors duration-300"
                    >
                      <td className="py-4 px-4 border-b border-gray-600">
                        {item.id}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-600">
                        {item.user_id}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-600">
                        {item.first_name}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-600">
                        {item.utr_number}
                      </td>
                      <td className="py-4 px-4 border-b border-gray-600">
                      {new Date(item.approved_date).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                      <td className="py-4 px-4 border-b border-gray-600">
                        {item.machine_price}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-center text-gray-400 border-b border-gray-600"
                    >
                      No Approved Deposits
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {approved_deposit.length > itemsPerPage && (
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

export default Approved_Deposit;
