import { useState, useEffect, useRef } from "react";
import StockCard from "../components/StockCard";

const StockPage = () => {
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const openSidebarButtonRef = useRef(null);

  const fetchStock = async () => {
    const response = await fetch(`http://127.0.0.1:8080/stocks/${search}`);
    const data = await response.json();
    setStock(data);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        openSidebarButtonRef.current &&
        !openSidebarButtonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div class="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div ref={sidebarRef} class={`absolute bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ease-in-out duration-300`}
      >
        {/* Sidebar - Watchlist */}
        <div class="p-4">
          <h1 class="text-2xl font-semibold">Watchlist</h1>
          <ul class="mt-4">
            <li class="mb-2">
              <a href="#" class="block hover:text-indigo-400">
                Stock1
              </a>
            </li>
            <li class="mb-2">
              <a href="#" class="block hover:text-indigo-400">
                Stock2
              </a>
            </li>
            <li class="mb-2">
              <a href="#" class="block hover:text-indigo-400">
                Stock3
              </a>
            </li>
            <li classe="mb-2">
              <a href="#" class="block hover:text-indigo-400">
                Stock4
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Content */}
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div class="bg-white shadow">
          <div classe="container mx-auto">
            <div class="flex justify-between items-start py-4 px-2">
              
              <button
                ref={openSidebarButtonRef}
                class="text-gray-500 hover:text-gray-600"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div class="flex-1 overflow-auto p-4">
          <h1 class="text-2xl font-semibold">Stock page</h1>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
