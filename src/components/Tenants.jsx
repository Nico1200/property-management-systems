/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Search from "./Search";
const TenantDetails = ({ tenant, database }) => {
  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">Tenant Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Name:</p>
            <p>{tenant.name}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{tenant.phone}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p>{tenant.status}</p>
          </div>
          <div>
            <p className="font-semibold">Balance:</p>
            <p
              className={tenant.balance > 0 ? "text-red-600" : "text-green-600"}
            >
              {tenant.balance} UGX
            </p>
          </div>
          {tenant.prepaidMonths > 0 && (
            <div>
              <p className="font-semibold">Prepaid Months:</p>
              <p className="text-green-600">{tenant.prepaidMonths}</p>
            </div>
          )}
          <div>
            <p className="font-semibold">Unit:</p>
            <p>{tenant.unit || "Not Assigned"}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{tenant.location || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const PaymentForm = ({ tenant, database, setDatabase, setModalContent }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    const property = database.properties.find(
      (p) => p.location === tenant.location
    );
    const unit = property?.units.find((u) => u.unit === tenant.unit);

    if (!unit) return;

    const monthsCovered = Math.floor(amount / unit.price);

    // Update tenant balance
    if (monthsCovered * unit.price > tenant.balance) {
      const remainingAmount = amount - tenant.balance;
      database.financials.totalDebts = Math.max(
        0,
        database.financials.totalDebts - tenant.balance
      );
      tenant.balance = 0;
      const prepaidMonths = Math.floor(remainingAmount / unit.price);
      tenant.prepaidMonths = (tenant.prepaidMonths || 0) + prepaidMonths;
    } else {
      tenant.balance = Math.max(0, tenant.balance - amount);
      database.financials.totalDebts = Math.max(
        0,
        database.financials.totalDebts - amount
      );
    }

    // // Update tenant balance
    // tenant.balance = Math.max(0, tenant.balance - amount);

    // update tenant pay date
    tenant.lastPayDate = new Date().toISOString();

    // Update financials
    const currentYear = new Date().getFullYear();
    if (database.financials.lastYearReset !== currentYear) {
      database.financials.currentYearIncome = 0;
      database.financials.lastYearReset = currentYear;
    }

    database.financials.totalIncome += amount;
    database.financials.currentYearIncome += amount;

    // database.financials.totalDebts = Math.max(
    //   0,
    //   database.financials.totalDebts - amount
    // );

    // Add payment to history
    database.financials.paymentHistory.push({
      tenantName: tenant.name,
      unit: tenant.unit,
      location: tenant.location,
      amount: amount,
      date: new Date().toISOString(),
      prepaidMonths: tenant.prepaidMonths || 0,
    });

    setDatabase({ ...database });
    if (setModalContent) {
      setModalContent(null);
    }
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">Record Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Amount (UGX)
          </label>
          <input
            type="number"
            name="amount"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-600 border-b-4 border-blue-900 rounded-lg hover:border-b-0 hover:translate-y-1 transition-all text-white px-4 py-2  hover:bg-blue-700  duration-300"
          >
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
};

const AddTenantForm = ({ database, setDatabase, setModalContent }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTenant = {
      id: Date.now().toString(),
      name: e.target.name.value,
      phone: e.target.phone.value,
      status: "inactive",
      balance: 0,
      lastPayDate: null,
      startDate: new Date().toISOString(),
      unit: null,
      location: null,
    };

    const updatedDatabase = {
      ...database,
      tenants: [...database.tenants, newTenant],
    };

    setDatabase(updatedDatabase);
    if (setModalContent) {
      setModalContent(null);
    }
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">Add New Tenant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tenant Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter tenant name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <div className="h-[50px] ">
            <button
              type="submit"
              className="bg-blue-600 border-b-4 text-white px-4 py-2 rounded-lg hover:border-b-0 hover:translate-y-1 transition-all hover:bg-blue-700 border-blue-900 duration-300"
            >
              Add Tenant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const TenantCard = ({ tenant, database, setDatabase, setModalContent }) => {
  function removeTenant(tenantId, database, setDatabase) {
    if (!confirm("Are you sure you want to remove this tenant?")) return;

    const tenantIndex = database.tenants.findIndex((t) => t.id === tenantId);
    if (tenantIndex === -1) return;

    const tenant = database.tenants[tenantIndex];

    // If tenant is assigned to a unit, update unit status
    if (tenant.unit) {
      const property = database.properties.find(
        (p) => p.location === tenant.location
      );
      if (property) {
        const unit = property.units.find((u) => u.unit === tenant.unit);
        if (unit) {
          unit.status = "vacant";
        }
      }
    }

    // Remove tenant
    database.tenants.splice(tenantIndex, 1);
    setDatabase({ ...database });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{tenant.name}</h3>
          <p className="text-gray-600">{tenant.phone}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            tenant.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {tenant.status}
        </span>
      </div>
      <div className="space-y-2">
        <p>
          <strong>Unit:</strong> {tenant.unit || "Not Assigned"}
        </p>
        <p>
          <strong>Location:</strong> {tenant.location || "N/A"}
        </p>
        <p>
          <strong>Balance:</strong>
          <span
            className={tenant.balance > 0 ? "text-red-600" : "text-green-600"}
          >
            {tenant.balance || 0} UGX
          </span>
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() =>
            setModalContent(
              <TenantDetails tenant={tenant} database={database} />
            )
          }
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors duration-300"
        >
          <i className="fas fa-eye mr-1"></i>Details
        </button>
        <button
          onClick={() =>
            setModalContent(
              <PaymentForm
                tenant={tenant}
                database={database}
                setDatabase={setDatabase}
                setModalContent={setModalContent}
              />
            )
          }
          className="bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors duration-300"
        >
          <i className="fas fa-money-bill mr-1"></i>Payment
        </button>
        <button
          onClick={() => removeTenant(tenant.id, database, setDatabase)}
          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors duration-300"
        >
          <i className="fas fa-trash mr-1"></i>Remove
        </button>
      </div>
      <div
        className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${
          tenant.status === "active" && tenant.balance > 0
            ? "bg-red-500"
            : "bg-green-500"
        } animate-pulse`}
      ></div>
    </div>
  );
};

const Tenants = ({ database, setDatabase, setModalContent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTenants = database.tenants.filter((tenants) => {
    const tenantsData = JSON.stringify(tenants).toLowerCase();
    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // Split by space and remove empty strings
    return keywords.every((keyword) => tenantsData.includes(keyword));
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tenants Management</h2>
        <button
          onClick={() =>
            setModalContent(
              <AddTenantForm database={database} setDatabase={setDatabase} />
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          <i className="fas fa-plus mr-2"></i>Add Tenant
        </button>
      </div>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            database={database}
            setDatabase={setDatabase}
            setModalContent={setModalContent}
          />
        ))}
      </div>
    </div>
  );
};

export default Tenants;
