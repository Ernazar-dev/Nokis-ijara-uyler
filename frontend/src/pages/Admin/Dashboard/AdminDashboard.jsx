import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { AuthContext } from "../../../context/AuthContext";
import API, { BASE_URL } from "../../../api/axios"; // ✅ axios instance
import { toast } from "react-toastify";
import {
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiHome,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiPhone,
} from "react-icons/fi";
import { MdOutlineBedroomParent } from "react-icons/md";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myHouses, setMyHouses] = useState([]);
  const navigate = useNavigate();

  const fetchMyHouses = async () => {
    try {
      const res = await API.get("/houses/my"); // ✅
      setMyHouses(res.data);
    } catch (error) {
      console.error("Qátelik:", error);
      toast.error("Úylerdi alıwda qátelik boldı");
    }
  };

  useEffect(() => {
    fetchMyHouses();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await API.put(`/houses/${id}`, { isAvailable: !currentStatus }); // ✅
      toast.success(currentStatus ? "Bánt qilindi" : "Aktivlasıtırıldı");
      fetchMyHouses();
    } catch {
      toast.error("Statusni ozgertiwda qátelik");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Úydi óshiresiz be?")) {
      try {
        await API.delete(`/houses/${id}`); // ✅
        toast.success("Úy óshirildi");
        fetchMyHouses();
      } catch {
        toast.error("Úydin óshiwde qátelik");
      }
    }
  };

  const getImageUrl = (images) => {
    if (!images?.length) return "https://placehold.co/300x200?text=Rasm+yoq";
    const img = images[0];
    if (img.startsWith("http")) return img; // Cloudinary URL
    const clean = img.startsWith("/") ? img.slice(1) : img;
    return `${BASE_URL}/${clean}`; // Eski uploads
  };

  const activeHouses = myHouses.filter((h) => h.isAvailable).length;
  const inactiveHouses = myHouses.filter((h) => !h.isAvailable).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Xosh keldińiz, {user?.name}
            </p>
          </div>
          <Link
            to="/admin/add-house"
            className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5"
          >
            <FiPlus size={16} />
            Úy Qosıw
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiHome className="text-gray-500" size={16} />
              <span className="text-xs font-medium text-gray-600">Jámi</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {myHouses.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-green-600" size={16} />
              <span className="text-xs font-medium text-gray-600">Aktiv</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {activeHouses}
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiXCircle className="text-red-600" size={16} />
              <span className="text-xs font-medium text-gray-600">Bánt</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {inactiveHouses}
            </p>
          </div>
        </div>

        {/* HOUSES LIST */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Meniń Úylerim ({myHouses.length})
          </h2>
        </div>

        {myHouses.length === 0 ? (
          <div className="bg-white border border-gray-200 py-12 text-center">
            <FiHome className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-600 font-medium mb-1">Ele úy qospadıńız</p>
            <p className="text-sm text-gray-500 mb-4">
              Birinshi úyińizdi qosıń
            </p>
            <Link
              to="/admin/add-house"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Úy Qosıw
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myHouses.map((house) => (
              <div
                key={house.id}
                className="bg-white border border-gray-200 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={getImageUrl(house.images)}
                    alt={house.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium text-white ${
                      house.isAvailable ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {house.isAvailable ? "Aktiv" : "Bánt"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {house.title}
                  </h3>
                  <p className="text-base font-semibold text-gray-900 mb-2">
                    {parseInt(house.price).toLocaleString()} sum
                  </p>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <FiMapPin size={12} />
                      <span className="line-clamp-1">{house.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MdOutlineBedroomParent size={12} />
                        <span>{house.rooms} bólme</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiPhone size={12} />
                        <span>{house.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => toggleStatus(house.id, house.isAvailable)}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium ${
                        house.isAvailable
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {house.isAvailable ? "Bánt" : "Aktiv"}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/edit-house/${house.id}`)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                      title="Ózgertiw"
                    >
                      <FiEdit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(house.id)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                      title="Óshiriw"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
