import React, { useState, useEffect, useRef, useContext } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { FiTrash2, FiUpload, FiMapPin, FiCheck } from "react-icons/fi";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddHousePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    phone: "",
    description: "",
    rooms: "",
    amenities: "",
    lat: "",
    lng: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Memory leak oldini olish uchun — barcha yaratilgan URL lar
  const previewUrlsRef = useRef([]);

  const centerPosition = [42.4619, 59.6166];
  const nukusBounds = [
    [42.3, 59.4],
    [42.6, 59.85],
  ];

  // Komponent yopilganda barcha preview URL larni tozalaymiz
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = selectedFiles.length;

    if (currentTotal >= 7) {
      toast.warning("Maksimal 7 ta rasm yuklash mumkin!");
      e.target.value = "";
      return;
    }

    const allowed = files.slice(0, 7 - currentTotal);

    if (allowed.length < files.length) {
      toast.warning(`Faqat ${allowed.length} ta rasm qo'shildi (limit: 7)`);
    }

    const newUrls = allowed.map((f) => {
      const url = URL.createObjectURL(f);
      previewUrlsRef.current.push(url);
      return url;
    });

    setSelectedFiles((p) => [...p, ...allowed]);
    setPreviews((p) => [...p, ...newUrls]);

    // Bir xil faylni qayta tanlash mumkin bo'lsin
    e.target.value = "";
  };

  const removeImage = (i) => {
    // Preview URL ni xotiradan tozalaymiz
    URL.revokeObjectURL(previews[i]);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (url) => url !== previews[i]
    );
    setSelectedFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData((p) => ({ ...p, lat: e.latlng.lat, lng: e.latlng.lng }));
      },
    });
    return formData.lat ? (
      <Marker position={[formData.lat, formData.lng]} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.lat) {
      setLoading(false);
      return toast.error("Kartadan lokaciya belgileń!");
    }
    if (selectedFiles.length === 0) {
      setLoading(false);
      return toast.error("Keminde 1 súwret júkleń!");
    }

    const data = new FormData();
    Object.keys(formData).forEach((k) => data.append(k, formData[k]));
    selectedFiles.forEach((f) => data.append("images", f));

    try {
      await API.post("/houses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Úy muvaffaqiyatli qo'shildi!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi. Qayta urining.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Jańa Úy Qosıw</h1>
          <p className="text-sm text-gray-600">Barlıq maydanlardı toltırıń hám súwretler júkleń</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ASOSIY MA'LUMOTLAR */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Tiykarǵı maǵlıwmatlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Atama</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Mısalı: 2 bólmeli kvartira orayda" required className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Baha (so'm)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="2000000" required className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+998 90 123 45 67" required className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bólmeler sanı</label>
                <input name="rooms" type="number" value={formData.rooms} onChange={handleChange} placeholder="1" required className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Qolaylıqlar</label>
                <input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Wifi, Gaz, Kondisioner..." className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mánzil</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Nókis qalası, kóshe atı..." required className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Táriyp</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Qosımsha maǵlıwmat..." rows="3" className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 outline-none text-sm resize-y" />
              </div>
            </div>
          </div>

          {/* RASMLAR */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Súwretler ({selectedFiles.length}/7)
            </h2>
            {selectedFiles.length < 7 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer bg-gray-50 hover:bg-blue-50 transition-colors mb-4">
                <FiUpload className="text-2xl text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Súwret júklew ushın basiń</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG (maks 7 dana)</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square border border-gray-200 overflow-hidden">
                    <img src={src} className="w-full h-full object-cover" alt={`preview ${idx + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KARTA */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Lokaciya</h2>
            <div className="h-64 border border-gray-200 overflow-hidden mb-3">
              <MapContainer center={centerPosition} zoom={13} minZoom={12} maxZoom={18} scrollWheelZoom={true} maxBounds={nukusBounds} maxBoundsViscosity={1.0} zoomControl={false} className="h-full w-full outline-none">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
            <div className={`flex items-center gap-2 text-sm px-3 py-2 border ${formData.lat ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
              {formData.lat ? (
                <><FiCheck className="text-green-600" /><span className="font-medium">Lokaciya belgilendi</span></>
              ) : (
                <><FiMapPin className="text-gray-400" /><span>Kartadan lokaciya tańlań</span></>
              )}
            </div>
          </div>

          {/* TUGMALAR */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/admin")} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm">
              Bıykar etiw
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm">
              {loading ? "Saqlanıwda..." : "Qosiw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHousePage;
