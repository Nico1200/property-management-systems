/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Search from "./Search";
import { formatToCommaSeparated } from "./init";

const AddUnitForm = ({ database, setDatabase, setModalContent }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const newUnit = {
      unit: e.target.unitId.value,
      price: e.target.price.value,
      status: "vacant",
      receipts: [],
    };

    const location = e.target.location.value;

    // Find or create property for this location
    let property = database.properties.find((p) => p.location === location);

    if (property) {
      // Add unit to existing property
      property.units.push(newUnit);
      property.update_date = new Date().toISOString();
    } else {
      // Create new property with this unit
      property = {
        type: "rental",
        units: [newUnit],
        location: location,
        upload_date: new Date().toISOString(),
        update_date: new Date().toISOString(),
      };
      database.properties.push(property);
    }

    setDatabase({ ...database });
    if (setModalContent) {
      setModalContent(null);
    }
  };

  return (
    <div className="slide-in">
      <h2 className="text-2xl font-bold mb-4">Add New Unit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit ID/Name
          </label>
          <input
            type="text"
            name="unitId"
            required
            className="mt-1 p-2 block border-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter unit ID or name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            className="mt-1 p-2 block border-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (UGX)
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            className="mt-1 p-2 block border-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter price"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <div className="h-[50px] ">
            <button
              type="submit"
              className="bg-blue-600 border-b-4 border-blue-900 rounded-lg hover:border-b-0 hover:translate-y-1 transition-all text-white px-4 py-2  hover:bg-blue-700  duration-300"
            >
              Add Unit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
const UnitCard = ({
  unit,
  location,
  database,
  setDatabase,
  setModalContent,
}) => {
  const tenant = database.tenants.find(
    (t) => t.unit === unit.unit && t.location === location
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{unit.unit}</h3>
          <p className="text-gray-600">{location}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            unit.status === "vacant"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {unit.status || "vacant"}
        </span>
      </div>
      <div className="space-y-2">
        <p>
          <strong>Price:</strong> {formatToCommaSeparated(unit.price)} UGX
        </p>
        <p>
          <strong>Status:</strong> {unit.status || "vacant"}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        {unit.status === "occupied" && tenant && (
          <p>
            <strong>Tenant:</strong> {tenant.name}
          </p>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() =>
            setModalContent(
              <div className="slide-in">
                <h2 className="text-2xl font-bold mb-4">Unit Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Unit ID:</p>
                      <p>{unit.unit}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Location:</p>
                      <p>{location}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <p>{unit.status || "vacant"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Price:</p>
                      <p>{unit.price} UGX</p>
                    </div>
                  </div>

                  {tenant && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Current Tenant
                      </h3>
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
                          <p className="font-semibold">Balance:</p>
                          <p
                            className={
                              tenant.balance > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {tenant.balance} UGX
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold">Start Date:</p>
                          <p>
                            {new Date(tenant.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors duration-300"
        >
          <i className="fas fa-eye mr-1"></i>Details
        </button>

        {unit.status === "vacant" && (
          <button
            onClick={() =>
              setModalContent(
                <div className="slide-in">
                  <h2 className="text-2xl font-bold mb-4">
                    Assign Tenant to Unit {unit.unit}
                  </h2>
                  <AssignTenantForm
                    unit={unit}
                    location={location}
                    database={database}
                    setDatabase={setDatabase}
                    setModalContent={setModalContent}
                  />
                </div>
              )
            }
            className="bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors duration-300"
          >
            <i className="fas fa-user-plus mr-1"></i>Assign
          </button>
        )}
      </div>
    </div>
  );
};

// When assigning a tenant to a unit, update the initial setup:
const AssignTenantForm = ({
  unit,
  location,
  database,
  setDatabase,
  setModalContent,
}) => {
  const unassignedTenants = database.tenants.filter((t) => !t.unit);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tenantId = e.target.tenantId.value;
    const tenant = database.tenants.find((t) => t.id === tenantId);

    if (tenant) {
      tenant.unit = unit.unit;
      tenant.location = location;
      tenant.status = "active";
      // Set initial balance to unit price
      tenant.balance = unit.price;
      // Set initial lastPayDate to now
      tenant.lastPayDate = new Date().toISOString();
      unit.status = "occupied";

      // Update total debts in financials
      database.financials.totalDebts += unit.price;

      setDatabase({ ...database });
      if (setModalContent) {
        setModalContent(null);
      }
    }
  };

  return unassignedTenants.length > 0 ? (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Tenant
        </label>
        <select
          name="tenantId"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Tenant</option>
          {unassignedTenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} - {t.phone}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="bg-blue-600 border-b-4 rounded-lg hover:border-b-0 hover:translate-y-1 transition-all border-blue-900 text-white px-4 py-2  hover:bg-blue-700  duration-300"
        >
          Assign Tenant
        </button>
      </div>
    </form>
  ) : (
    <div>
      <p className="text-gray-600">
        No unassigned tenants available. Please add a new tenant first.
      </p>
      <div className="mt-4 flex justify-end"></div>
    </div>
  );
};

const Units = ({ database, setDatabase, setModalContent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState(
    database.properties.length
      ? database.properties
          .filter((property) => property.type === "rental")
          .flatMap((property, index) =>
            property.units.map((unit, _) => {
              unit.location = property.location;
              return unit;
            })
          )
      : []
  );

  // const filteredProperties = database.properties.filter((properties) => {
  //   const propertiesData = JSON.stringify(properties).toLowerCase();
  //   const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // Split by space and remove empty strings
  //   return keywords.every((keyword) => propertiesData.includes(keyword));
  // });
  const filteredUnits = units.filter((unit) => {
    const unitData = JSON.stringify(unit).toLowerCase();
    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // Split by space and remove empty strings
    return keywords.every((keyword) => unitData.includes(keyword));
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Units Management</h2>
        <button
          onClick={() =>
            setModalContent(
              <AddUnitForm database={database} setDatabase={setDatabase} />
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          <i className="fas fa-plus mr-2"></i>Add Unit
        </button>
      </div>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {filteredProperties
          .filter((p) => p.type === "rental")
          .map((property) =>
            property.units.map((unit) => (
              <UnitCard
                key={`${property.location}-${unit.unit}`}
                unit={unit}
                property={property}
                database={database}
                setDatabase={setDatabase}
                setModalContent={setModalContent}
              />
            ))
          )} */}

        {filteredUnits.map((unit) => (
          <UnitCard
            key={`${unit.location}-${unit.unit}`}
            unit={unit}
            location={unit.location}
            database={database}
            setDatabase={setDatabase}
            setModalContent={setModalContent}
          />
        ))}
      </div>
    </div>
  );
};

export default Units;
