/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = ({ setDatabase, modalContent, setModalContent }) => {
  return (
    <>
      <NavBar setDatabase={setDatabase} />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {modalContent}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
