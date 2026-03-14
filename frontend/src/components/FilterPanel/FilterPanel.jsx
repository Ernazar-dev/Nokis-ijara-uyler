import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiRefreshCcw, FiSliders } from "react-icons/fi";

const FilterPanel = ({ onFilter, maxPriceLimit = 1000000 }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [filters, setFilters] = useState({
    search: "",
    rooms: "all",
    priceRange: [0, maxPriceLimit],
  });

  const debounceTimeout = useRef();

  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      onFilter({
        search: filters.search,
        rooms: filters.rooms,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      });
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [filters, onFilter]);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleRoomSelect = (val) =>
    setFilters({ ...filters, rooms: val });

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const clearFilters = () =>
    setFilters({ search: "", rooms: "all", priceRange: [0, maxPriceLimit] });

  const hasActiveFilters =
    filters.search !== "" ||
    filters.rooms !== "all" ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== maxPriceLimit;

  const roomOptions = [
    { val: "all", label: "Bár" },
    { val: "1", label: "1" },
    { val: "2", label: "2" },
    { val: "3", label: "3" },
    { val: "4+", label: "4+" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .filter-panel {
          font-family: 'DM Sans', sans-serif;
          position: absolute;
          top: 80px;
          left: 16px;
          z-index: 1000;
          width: 320px;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-panel.closed {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
        }

        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 18px 14px;
          border-bottom: 1px solid #f1f1f1;
        }

        .filter-title {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-title-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
          display: inline-block;
        }

        .filter-title-dot.active {
          background: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
        }

        .filter-close-btn {
          width: 30px;
          height: 30px;
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

        .filter-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .filter-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .filter-label {
          font-size: 10px;
          font-weight: 600;
          color: #a1a1aa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 7px;
          display: block;
        }

        .search-wrap {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a1a1aa;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          background: #f8f8f8;
          border: 1.5px solid transparent;
          border-radius: 12px;
          font-size: 13px;
          color: #111;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .search-input::placeholder { color: #c4c4c8; }
        .search-input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }

        .room-btn {
          padding: 8px 0;
          border-radius: 10px;
          border: 1.5px solid #e4e4e7;
          background: #fff;
          font-size: 12px;
          font-weight: 500;
          color: #71717a;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
          text-align: center;
        }

        .room-btn:hover {
          border-color: #93c5fd;
          color: #2563eb;
          background: #eff6ff;
        }

        .room-btn.active {
          border-color: #2563eb;
          background: #2563eb;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37,99,235,0.25);
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-input {
          flex: 1;
          padding: 9px 10px;
          background: #f8f8f8;
          border: 1.5px solid transparent;
          border-radius: 10px;
          font-size: 12px;
          color: #111;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
          min-width: 0;
        }

        .price-input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
        }

        .price-sep {
          font-size: 16px;
          color: #d4d4d8;
          flex-shrink: 0;
        }

        .reset-btn {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: 1.5px solid #e4e4e7;
          background: #fff;
          font-size: 12px;
          font-weight: 600;
          color: #71717a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .reset-btn:hover {
          background: #fff1f2;
          border-color: #fca5a5;
          color: #ef4444;
        }

        .toggle-fab {
          position: absolute;
          top: 80px;
          left: 16px;
          z-index: 1000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #2563eb;
          transition: all 0.2s;
        }

        .toggle-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.16);
        }

        .badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #fff;
        }
      `}</style>

      {!isOpen ? (
        <button className="toggle-fab" onClick={() => setIsOpen(true)}>
          <FiSliders size={18} />
          {hasActiveFilters && <span className="badge" />}
        </button>
      ) : (
        <div className="filter-panel">
          <div className="filter-header">
            <span className="filter-title">
              <span className={`filter-title-dot ${hasActiveFilters ? "active" : ""}`} />
              Izlew
            </span>
            <button className="filter-close-btn" onClick={() => setIsOpen(false)}>
              <FiX size={14} />
            </button>
          </div>

          <div className="filter-body">
            {/* SEARCH */}
            <div>
              <span className="filter-label">Mánzil / Atı</span>
              <div className="search-wrap">
                <FiSearch size={14} className="search-icon" />
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Mıs: 22-mkr..."
                  className="search-input"
                />
              </div>
            </div>

            {/* ROOMS */}
            <div>
              <span className="filter-label">Bólme sanı</span>
              <div className="rooms-grid">
                {roomOptions.map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => handleRoomSelect(val)}
                    className={`room-btn ${filters.rooms === val ? "active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <span className="filter-label">Baha (So'm)</span>
              <div className="price-row">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="price-input"
                  placeholder="0"
                />
                <span className="price-sep">—</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="price-input"
                  placeholder="1 000 000"
                />
              </div>
            </div>

            {/* RESET */}
            <button className="reset-btn" onClick={clearFilters}>
              <FiRefreshCcw size={13} /> Tozalaw
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
