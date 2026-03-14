import React, { useState, useEffect, useRef } from "react";
import API, { BASE_URL } from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { FiTrash2, FiLoader, FiX, FiPlus } from "react-icons/fi";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const EditHousePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // Barcha yaratilgan preview URL larni ref da saqlaymiz — memory leak oldini olish uchun
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await API.get(`/houses/${id}`);
        const data = res.data;
        setFormData({
          title: data.title,
          price: data.price,
          address: data.address,
          phone: data.phone,
          description: data.description || "",
          rooms: data.rooms,
          amenities: data.amenities ? data.amenities.join(", ") : "",
          lat: data.lat,
          lng: data.lng,
        });
        setExistingImages(data.images || []);
        setLoading(false);
      } catch (err) {
        toast.error("Ma'lumot topilmadi");
        navigate("/admin");
      }
    };
    fetchHouse();

    // Komponent yopilganda barcha preview URL larni xotiradan tozalaymiz
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = existingImages.length + newImages.length;

    if (currentTotal >= 7) {
      toast.warning("Maksimal 7 ta rasm yuklash mumkin!");
      e.target.value = "";
      return;
    }

    // Limitdan oshmaydigan qismini olamiz
    const allowed = files.slice(0, 7 - currentTotal);

    if (allowed.length < files.length) {
      toast.warning(`Faqat ${allowed.length} ta rasm qo'shildi (limit: 7)`);
    }

    const filePreviews = allowed.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.push(url); // ref ga saqlaymiz
      return url;
    });

    setNewImages((prev) => [...prev, ...allowed]);
    setNewPreviews((prev) => [...prev, ...filePreviews]);

    // Bir xil faylni qayta tanlash mumkin bo'lsin
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    // Preview URL ni xotiradan tozalaymiz
    URL.revokeObjectURL(newPreviews[index]);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (url) => url !== newPreviews[index]
    );
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteOldImage = async (imageUrl) => {
    if (!window.confirm("Bu rasmni serverdan butunlay o'chirasizmi?")) return;
    try {
      const res = await API.post(`/houses/${id}/delete-image`, { imageUrl });
      setExistingImages(res.data.images);
      toast.success("Rasm o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k]));
      newImages.forEach((file) => data.append("images", file));

      await API.put(`/houses/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Muvaffaqiyatli saqlandi!");
      navigate("/admin");
    } catch {
      toast.error("Saqlashda xatolik yuz berdi");
    } finally {
      setBtnLoading(false);
    }
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <FiLoader className="animate-spin text-3xl text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Úydi Ózgertiw</h1>
          <p className="text-sm text-gray-600">Maǵlıwmatlardı jańalań hám saqlań</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ASOSIY MA'LUMOTLAR */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Tiykarǵı maǵlıwmatlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Atama</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Baha (so'm)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bólmeler sanı</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qolaylıqlar</label>
                <input
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Wifi, Gaz, Kondisioner..."
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mánzil</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Táriyp</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500 text-sm resize-y"
                />
              </div>
            </div>
          </div>

          {/* RASMLAR */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Súwretler ({existingImages.length + newImages.length}/7)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {/* Serverdagi mavjud rasmlar */}
              {existingImages.map((img, i) => (
                <div
                  key={`old-${i}`}
                  className="relative aspect-square border border-gray-200 overflow-hidden group"
                >
                  <img
                    src={`${BASE_URL}/${img.startsWith("/") ? img.slice(1) : img}`}
                    className="w-full h-full object-cover"
                    alt="existing"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x200?text=Rasm+yo'q";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => deleteOldImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Yangi tanlangan rasmlar (hali yuklanmagan) */}
              {newPreviews.map((src, i) => (
                <div
                  key={`new-${i}`}
                  className="relative aspect-square border-2 border-blue-300 border-dashed overflow-hidden"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover opacity-75"
                    alt="new preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full"
                  >
                    <FiX size={12} />
                  </button>
                  <div className="absolute bottom-1 left-1 pointer-events-none">
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                      Yangi
                    </span>
                  </div>
                </div>
              ))}

              {/* Rasm qo'shish tugmasi — limit yetmagan bo'lsa */}
              {existingImages.length + newImages.length < 7 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <FiPlus className="text-gray-400 text-xl mb-1" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Qosıw</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {existingImages.length + newImages.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Kamida 1 ta rasm bo'lishi kerak</p>
            )}
          </div>

          {/* KARTA */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Lokaciya
            </h2>
            <div className="h-64 border border-gray-200">
              <MapContainer
                center={[formData.lat || 42.4619, formData.lng || 59.6166]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Yangi lokaciya tanlash uchun kartani bosing
            </p>
          </div>

          {/* TUGMALAR */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 text-sm"
            >
              Bıykar etiw
            </button>
            <button
              type="submit"
              disabled={btnLoading}
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 text-sm flex items-center justify-center gap-2"
            >
              {btnLoading ? (
                <>
                  <FiLoader className="animate-spin" /> Saqlanmoqda...
                </>
              ) : (
                "Saqlaw"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHousePage;
