import React, { useRef } from "react";
// ✅ axios.js dan API va BASE_URL import qilinmoqda
import API, { BASE_URL } from "../../api/axios";
import { Modal, Button, Tabs, Image, Tag, Carousel } from "antd";
import {
  FiMapPin,
  FiPhoneCall,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HouseModal = ({ house, onClose }) => {
  if (!house) return null;
  const sliderRef = useRef(null);
  const images = house.images?.length ? house.images : [];

  // ✅ Rasm URL manzilini to'g'ri shakllantirish funksiyasi
  const getUrl = (path) => {
    if (!path) return "";

    // Slash (/) muammosini hal qilish:
    // Agar path / bilan boshlansa, uni olib tashlab, keyin ulaymiz
    // Cloudinary URL — to'g'ridan-to'g'ri qaytaramiz
    if (path.startsWith("http")) return path;

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // Agar path ichida allaqachon "uploads" bo'lsa
    if (cleanPath.includes("uploads")) {
      return `${BASE_URL}/${cleanPath}`;
    }

    // Agar bazada faqat fayl nomi bo'lsa
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // ... tabItems va boshqa kodlar o'zgarmaydi ...

  const tabItems = [
    {
      key: "1",
      label: "Ma'lumot",
      children: (
        <div className="space-y-4 pt-2">
          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Bólmeler
              </span>
              <span className="text-slate-700 font-bold">
                {house.rooms} bólme
              </span>
            </div>
            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Jaǵdayı
              </span>
              <span className="text-slate-700 font-bold">Yaxshi</span>
            </div>
          </div>
          <div className="text-sm text-slate-600 leading-snug bg-slate-50 p-3 rounded-lg border border-slate-50 italic">
            {house.description || "Tavsif mavjud emas."}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {house.amenities?.map((a, i) => (
              <Tag
                key={i}
                color="blue"
                className="m-0 border-none rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {a}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Karta",
      children: (
        <div className="h-[200px] rounded-lg overflow-hidden border border-slate-200 mt-2">
          <MapContainer
            center={[Number(house.lat), Number(house.lng)]}
            zoom={15}
            style={{ height: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[Number(house.lat), Number(house.lng)]} />
          </MapContainer>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={!!house}
      onCancel={onClose}
      footer={null}
      width={850}
      centered
      zIndex={10000}
      closeIcon={null}
      styles={{
        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
        body: { padding: 0 },
      }}
    >
      <div className="flex flex-col md:grid md:grid-cols-[400px_1fr] h-auto md:h-[550px] bg-white relative overflow-hidden rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-white/80 p-2 rounded-full shadow-md text-slate-600"
        >
          <FiX size={18} />
        </button>

        {/* CHAP: RASM SLIDER */}
        <div className="relative bg-slate-100 h-[300px] md:h-full group">
          {images.length > 0 ? (
            <>
              <Image.PreviewGroup>
                <Carousel
                  ref={sliderRef}
                  dots={false}
                  effect="fade"
                  className="h-full"
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-[300px] md:h-[550px] bg-slate-200"
                    >
                      <Image
                        src={getUrl(img)}
                        className="w-full h-full object-cover"
                        wrapperClassName="w-full h-full"
                        fallback="https://placehold.co/400x550?text=Rasm+yoq"
                      />
                    </div>
                  ))}
                </Carousel>
              </Image.PreviewGroup>
              {images.length > 1 && (
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                  <button
                    onClick={() => sliderRef.current.prev()}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => sliderRef.current.next()}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Súwret Joq
            </div>
          )}
        </div>

        {/* O'NG: MA'LUMOTLAR */}
        <div className="p-6 flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-slate-800 leading-tight truncate">
              {house.title}
            </h2>
            <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 font-medium">
              <FiMapPin className="text-blue-500" /> {house.address}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <Tabs defaultActiveKey="1" items={tabItems} size="small" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Aylıq tólem
              </p>
              <p className="text-xl font-black text-blue-600">
                {parseInt(house.price).toLocaleString()}{" "}
                <span className="text-xs text-slate-400 font-normal">so'm</span>
              </p>
            </div>
            {house.isAvailable ? (
              <Button
                type="primary"
                href={`tel:${house.phone}`}
                icon={<FiPhoneCall />}
                className="bg-blue-600 h-10 px-5 rounded-lg font-bold"
              >
                Qońıraw
              </Button>
            ) : (
              <Button disabled className="h-10 px-5 rounded-lg font-bold">
                Bánt
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HouseModal;
