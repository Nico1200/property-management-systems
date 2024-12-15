/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { formatToCommaSeparated } from "./init";

const Dashboard = ({ database }) => {
  const { financials } = database;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Total Tenants</h2>
          <p className="text-3xl text-blue-600">
            {formatToCommaSeparated(database.tenants.length)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Total Income (All Time)</h2>
          <p className="text-3xl text-green-600">
            {formatToCommaSeparated(financials.totalIncome)} UGX
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Current Year Income</h2>
          <p className="text-3xl text-purple-600">
            {formatToCommaSeparated(financials.currentYearIncome)} UGX
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Total Outstanding Debts</h2>
          <p className="text-3xl text-red-600">{financials.totalDebts} UGX</p>
        </div>
      </div>

      <div className="">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Recent Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {financials.paymentHistory.length > 0 ? (
              financials.paymentHistory
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((payment, index) => (
                  <div key={index} className="p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{payment.tenantName}</p>
                        <p className="text-sm text-gray-600">
                          Unit: {payment.unit} ({payment.location})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatToCommaSeparated(payment.amount)} UGX
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No recent payments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
