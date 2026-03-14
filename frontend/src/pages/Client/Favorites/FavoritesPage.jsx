import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../../../api/axios"; // ✅ BASE_URL ham import
import { Link } from "react-router-dom";
import {
  Typography,
  Row,
  Col,
  Popconfirm,
  message,
  Spin,
  Button as AntButton,
} from "antd";
import {
  HeartFilled,
  EnvironmentOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MdOutlineBedroomParent } from "react-icons/md";

import Navbar from "../../../components/Navbar/Navbar";
import HouseModal from "../../../components/HouseModal/HouseModal";

const { Title, Text } = Typography;

const FavoritesPage = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/favorites");
      setHouses(res.data);
    } catch {
      message.error("Magliwmatlardı júklewdegi qátelik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  const removeFavorite = async (id) => {
    try {
      await API.post("/favorites/toggle", { houseId: id });
      message.success("Belgilengenlerden alıp taslandı");
      fetchFavs();
    } catch {
      message.error("Qátelik júz berdi");
    }
  };

  const getImageUrl = (images) => {
    if (images?.length) {
      const path = images[0].startsWith("/") ? images[0].slice(1) : images[0];
      return `${BASE_URL}/${path}`;
    }
    return "https://via.placeholder.com/600x400?text=Rasm+yo'q";
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 pb-6 border-b border-slate-200 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Link
                to="/"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <ArrowLeftOutlined className="text-xs" /> Bas betke qaytıw
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Title level={2} className="!mb-0 !text-slate-900 !font-bold">
                Tanlanǵanlar
              </Title>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-100">
                {houses.length}
              </span>
            </div>
          </div>
        </div>

        {/* KONTENT */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Spin size="large" />
            <Text className="text-slate-400 animate-pulse font-medium">
              Maǵlıwmatlar júklenbekte...
            </Text>
          </div>
        ) : houses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <HeartFilled className="text-4xl text-slate-200" />
            </div>
            <Title level={4} className="!text-slate-800 !mb-2">
              Házirshe tanlanǵanlar joq
            </Title>
            <Text className="text-slate-500 mb-8 block">
              Ózińizge jaqqan úylerdi júreksheni basıw arqalı saqlap qoyıń.
            </Text>
            <Link to="/">
              <AntButton
                type="primary"
                size="large"
                className="rounded-lg h-12 px-8 font-bold bg-blue-600"
              >
                Úy izlewdi baslaw
              </AntButton>
            </Link>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {houses.map((house) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={house.id}>
                <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      alt={house.title}
                      src={getImageUrl(house.images)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                        <span className="text-blue-600 font-bold text-base">
                          {Number(house.price).toLocaleString()}{" "}
                          <small className="text-[10px] text-slate-400 uppercase">
                            so'm
                          </small>
                        </span>
                      </div>
                    </div>
                    <Popconfirm
                      title="Tanlanǵanlardan óshiriw?"
                      onConfirm={() => removeFavorite(house.id)}
                      okText="Awa"
                      cancelText="Yaq"
                      placement="topRight"
                    >
                      <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-md flex items-center justify-center transition-all">
                        <DeleteOutlined size={16} />
                      </button>
                    </Popconfirm>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                        {house.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <EnvironmentOutlined className="text-xs" />
                        <span className="text-xs font-medium truncate">
                          {house.address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1 rounded-md text-sm font-semibold">
                        <MdOutlineBedroomParent className="text-blue-500" />
                        <span>{house.rooms} bólme</span>
                      </div>
                      <button
                        onClick={() => setSelectedHouse(house)}
                        className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 group/btn"
                      >
                        Toliq{" "}
                        <EyeOutlined className="transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </main>

      {selectedHouse && (
        <HouseModal
          house={selectedHouse}
          onClose={() => setSelectedHouse(null)}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
