import React, { useState, useEffect } from "react";
import API, { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiX,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";

const MapCard = ({ house, onClose, onDetails }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const images = house?.images || [];

  const getFullImgUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const checkLiked = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/favorites");
        const likedIds = res.data.map((h) => h.id);
        setIsLiked(likedIds.includes(house.id));
      } catch {}
    };
    checkLiked();
  }, [house.id]);

  const next = (e) => {
    e.stopPropagation();
    if (images.length > 0) setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const prev = (e) => {
    e.stopPropagation();
    if (images.length > 0) setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return toast.info("Dizimden otiń!");
    if (likeLoading) return;

    setLikeLoading(true);
    setIsLiked((prev) => !prev);

    try {
      const res = await API.post("/favorites/toggle", { houseId: house.id });
      setIsLiked(res.data.status);
      res.data.status
        ? toast.success("Tanlanganlar ga qo'shildi")
        : toast.info("Tanlanganlardan olib tashlandi");
    } catch {
      setIsLiked((prev) => !prev);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @keyframes likePoP {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        .map-card {
          font-family: 'DM Sans', sans-serif;
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: min(96vw, 580px);
          background: #ffffff;
          border-radius: 22px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.07);
          display: flex;
          overflow: hidden;
          animation: cardSlideUp 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* === LEFT: IMAGE === */
        .mc-img-wrap {
          position: relative;
          width: 220px;
          flex-shrink: 0;
          background: #f3f4f6;
          overflow: hidden;
        }

        @media (max-width: 520px) {
          .map-card { flex-direction: column; width: 94vw; }
          .mc-img-wrap { width: 100%; height: 170px; }
        }

        .mc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .mc-img-wrap:hover .mc-img { transform: scale(1.05); }

        .mc-no-img {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 12px;
        }

        .mc-badge-bant {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }

        /* LIKE BTN */
        .mc-like-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          z-index: 2;
        }

        .mc-like-btn.liked {
          background: #ef4444;
          animation: likePoP 0.4s ease;
          box-shadow: 0 4px 14px rgba(239,68,68,0.4);
        }

        .mc-like-btn.unliked {
          background: rgba(255,255,255,0.92);
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .mc-like-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .mc-like-btn:not(:disabled):hover { transform: scale(1.1); }

        /* ARROWS */
        .mc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s, background 0.2s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          z-index: 2;
        }

        .mc-img-wrap:hover .mc-arrow { opacity: 1; }
        .mc-arrow:hover { background: #fff; }
        .mc-arrow.prev { left: 8px; }
        .mc-arrow.next { right: 8px; }

        /* IMG DOTS */
        .mc-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
        }

        .mc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: background 0.2s, transform 0.2s;
        }

        .mc-dot.active {
          background: #fff;
          transform: scale(1.3);
        }

        /* === RIGHT: INFO === */
        .mc-info {
          flex: 1;
          padding: 20px 20px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          min-width: 0;
        }

        .mc-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: #f4f4f5;
          color: #71717a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mc-close:hover { background: #fee2e2; color: #ef4444; }

        .mc-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin: 0 28px 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .mc-address {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .mc-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .mc-tag {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .mc-tag-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .mc-tag-gray {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          margin-top: 12px;
        }

        .mc-price-label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .mc-price {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .mc-price span {
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
          margin-left: 2px;
        }

        .mc-details-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }

        .mc-details-btn:hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(29,78,216,0.35);
        }

        .mc-details-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="map-card">
        {/* CHAP: RASM */}
        <div className="mc-img-wrap">
          {images.length > 0 ? (
            <img
              src={getFullImgUrl(images[imgIndex])}
              alt={house.title}
              className="mc-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.closest(".mc-img-wrap").querySelector(".mc-no-img").style.display = "flex";
              }}
            />
          ) : null}

          <div className="mc-no-img" style={{ display: images.length === 0 ? "flex" : "none" }}>
            <span style={{ fontSize: 28 }}>🏠</span>
            <span>Súwret joq</span>
          </div>

          {!house.isAvailable && (
            <span className="mc-badge-bant">Bánt</span>
          )}

          <button
            className={`mc-like-btn ${isLiked ? "liked" : "unliked"}`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            {isLiked
              ? <FaHeart size={15} color="#fff" />
              : <FiHeart size={15} color="#64748b" />
            }
          </button>

          {images.length > 1 && (
            <>
              <button className="mc-arrow prev" onClick={prev}>
                <FiChevronLeft size={14} />
              </button>
              <button className="mc-arrow next" onClick={next}>
                <FiChevronRight size={14} />
              </button>
              <div className="mc-dots">
                {images.map((_, i) => (
                  <div key={i} className={`mc-dot ${i === imgIndex ? "active" : ""}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* O'NG: MA'LUMOTLAR */}
        <div className="mc-info">
          <button className="mc-close" onClick={onClose}>
            <FiX size={14} />
          </button>

          <div>
            <h3 className="mc-title">{house.title}</h3>
            <p className="mc-address">
              <FiMapPin size={11} />
              {house.address}
            </p>
            <div className="mc-tags">
              {house.amenities?.[0] && (
                <span className="mc-tag mc-tag-blue">{house.amenities[0]}</span>
              )}
              <span className="mc-tag mc-tag-gray">
                <MdOutlineBedroomParent size={12} />
                {house.rooms} bólme
              </span>
            </div>
          </div>

          <div className="mc-footer">
            <div>
              <div className="mc-price-label">Aylıq</div>
              <div className="mc-price">
                {parseInt(house.price).toLocaleString()}
                <span>so'm</span>
              </div>
            </div>
            <button className="mc-details-btn" onClick={() => onDetails(house)}>
              Kóriw <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapCard;
