/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { initialDatabase } from "./init";

const NavBar = ({ setDatabase }) => {
  const resetSystem = () => {
    if (
      confirm(
        "Are you sure you want to reset the system? This will remove all data."
      )
    ) {
      setDatabase(initialDatabase);
      //  setActiveView("dashboard");
    }
  };
  return (
    <>
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rental Management System</h1>
          <div className="space-x-4">
            <Link
              to={"/"}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-home mr-2"></i>Dashboard
            </Link>
            <Link
              to={"tenants"}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-users mr-2"></i>Tenants
            </Link>
            <Link
              to={"units"}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-building mr-2"></i>Units
            </Link>
            <Link
              to={"property"}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-home mr-2"></i>Property
            </Link>

            <Link
              to={"receipts"}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-receipt mr-2"></i>Receipts
            </Link>
            <button
              onClick={resetSystem}
              className="hover:bg-red-600 px-3 py-2 rounded transition-all duration-300"
            >
              <i className="fas fa-trash mr-2"></i>Reset System
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
