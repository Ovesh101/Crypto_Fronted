import React, { useEffect, useState } from "react";
import axios from "axios";
import { HOST_URL } from "../../../utils/constant";
import ReactPaginate from "react-paginate";
import ModalEdit from "./ModalEdit";
import BackButton from "../../BackButton";

const View_Qrcode = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [singleQrcode, setSingleQrcode] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Items per page
  const [showModal  , setShowModal] = useState(false);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const response = await axios.get(`${HOST_URL}/qrcode/getall+qrcode`);
        setQrCodes(response.data || []); // Assuming response.data is an array of QR codes
      } catch (err) {
        setError("Error fetching QR codes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [singleQrcode]);

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Calculate current QR codes to display
  const offset = currentPage * itemsPerPage;
  const currentQRCodes = qrCodes.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(qrCodes.length / itemsPerPage);

  console.log("currrent" , currentQRCodes);
  

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Edit button click handler
  const handleEditClick = (item) => {
    
    try {
      console.log("item" , item);
      
        setSingleQrcode(item);

        // Open the modal
        setShowModal(true);

        console.log(`Edit machine with ID: ${item.machine_id}`, qrCodes);
    } catch (error) {
        console.error("Error fetching machine data:", error);
    }
    // Implement navigation to edit page or modal logic here
  };

  const handleUpdate = (updateInfo)=>{
    console.log(updateInfo);
    
  }

  return (
    <div className="min-h-screen bg-[#161925] w-full ">

 
    <div className="container mx-auto p-6">
      <h2 className="text-2xl text-white font-bold mb-4">View QR Codes</h2>
      <BackButton />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Owner Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                UPI ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Bank Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                QR Code Image
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentQRCodes.map((qrCode) => (
              <tr key={qrCode.id} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-b border-gray-300">
                  {qrCode.owner_name}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  {qrCode.upi_id}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  {qrCode.bank_name}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <img
                    src={qrCode.qrcode_image}
                    alt="QR Code"
                    className="h-16 w-16"
                  />
                </td>
                <td className="py-3 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleEditClick(qrCode)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={
          <span className="text-white font-semibold">Previous</span>
        }
        nextLabel={<span className="text-white font-semibold">Next</span>}
        breakLabel={<span className="text-white">...</span>}
        breakClassName={"mx-2"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center mt-6"}
        pageClassName={"mx-1"}
        pageLinkClassName={
          "border border-gray-300 hover:border-blue-500 hover:bg-blue-100 px-3 py-1 rounded transition duration-200"
        }
        previousClassName={"mx-1"}
        previousLinkClassName={
          "border border-gray-300 hover:border-blue-500 hover:bg-blue-100 px-3 py-1 rounded transition duration-200"
        }
        nextClassName={"mx-1"}
        nextLinkClassName={
          "border border-gray-300 hover:border-blue-500 hover:bg-blue-100 px-3 py-1 rounded transition duration-200"
        }
        activeClassName={"bg-blue-500 text-white"}
        disabledClassName={"text-gray-300"}
      />

<ModalEdit
        type="qrcode"
        showModal={showModal}
        setShowModal={setShowModal}
        data={singleQrcode}
        handleUpdate={handleUpdate}
      />
    </div>
    </div>
  );
};

export default View_Qrcode;
