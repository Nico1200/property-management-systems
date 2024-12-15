/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Search from "./Search";

const UnitsPopUp = ({
  units_popState,
  setUnits_popState,
  unitList,
  setUnitList,
}) => {
  const columns = unitList.length ? Object.keys(unitList[0]) : [];
  return (
    <div
      className={`fixed z-50 flex items-center justify-center  top-0 left-0 w-screen h-screen ${
        units_popState ? "" : "hidden"
      }`}
    >
      <div
        className="absolute bg-black bg-opacity-50 w-full h-full"
        onClick={() => setUnits_popState((prev) => !prev)}
      ></div>
      <div className="relative container bg-white p-4 rounded-md mx-auto">
        <div className="w-full flex justify-end">
          <div
            className="w-[30px] font-bold text-white rounded-lg border-b-2 hover:border-b-0 cursor-pointer aspect-square flex justify-center items-center p-1 bg-red-400 border-red-600"
            onClick={() => setUnits_popState((prev) => !prev)}
          >
            X
          </div>
        </div>
        <table className=" w-full">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="border-[1px solid #ddd] p-2 text-left"
                >
                  {col}
                </th>
              ))}
              {columns.length ? <th>action</th> : "no units yet"}
            </tr>
          </thead>
          <tbody>
            {unitList.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td className="border-[1px solid #ddd] p-2" key={colIndex}>
                    {row[col]}
                  </td>
                ))}
                <td>
                  <i
                    className="fa fa-trash text-red-400 cursor-pointer hover:text-red-500"
                    onClick={() =>
                      setUnitList((prev) =>
                        prev.filter((x, s) => s != rowIndex)
                      )
                    }
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddProperty = ({ setDatabase, database, setModalContent }) => {
  const [property, setProperty] = useState({
    type: "rental",
    units: [],
    location: "",
    upload_date: "",
    update_date: "",
  });

  const [unit, setUnit] = useState({ status: "vacant" });
  const [unitList, setUnitList] = useState([]);
  const [units_popState, setUnits_popState] = useState(false);

  const handleAddUnit = () => {
    setUnitList([...unitList, unit]);
    setUnit({ status: "vacant" });
  };

  const handleSubmitProperty = (e) => {
    e.preventDefault();
    if (unitList.length) {
      setDatabase((prev) => ({
        ...prev,
        properties: [...prev.properties, { ...property, units: unitList }],
      }));
      // setProperties((prev) => [...prev, { ...property, units: unitList }]);
      setModalContent(null); // Close the form after submission
    } else {
      alert("units can not be empty");
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setProperty({ ...property, type });
    setUnit({ status: "vacant" }); // Reset the unit structure based on the new type
    setUnitList([]); // Clear the units for the new type
  };

  return (
    <>
      <UnitsPopUp
        units_popState={units_popState}
        setUnits_popState={setUnits_popState}
        unitList={unitList}
        setUnitList={setUnitList}
      />
      <div
        className={
          " inset-0 bg-opacity-50 z-50 flex items-center justify-center flex-col "
        }
      >
        <div className="flex justify-end">
          <div
            className="w-[30px] transition-all font-bold text-white rounded-lg border-b-4 hover:border-b-0 hover:translate-y-1 cursor-pointer aspect-square flex justify-center items-center p-1 bg-red-400 border-red-600"
            onClick={() => setModalContent(null)}
          >
            <i className="fa fa-x"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md  w-full max-w-3xl overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Add Property</h2>
          <form
            onSubmit={handleSubmitProperty}
            className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4"
          >
            {/* Select Property Type */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Property Type</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={property.type}
                onChange={handleTypeChange}
              >
                <option value="rental">Rental</option>
                <option value="land">Land</option>
                <option value="vehicle">Vehicle</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Location</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={property.location}
                onChange={(e) =>
                  setProperty({ ...property, location: e.target.value })
                }
                required
              />
            </div>

            {/* Upload Date */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Upload Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={property.upload_date}
                onChange={(e) =>
                  setProperty({ ...property, upload_date: e.target.value })
                }
                required
              />
            </div>

            {/* Add Unit */}
            <div className="mb-4">
              <div className="flex gap-1">
                <h3 className="text-lg font-bold mb-2">Units</h3>
                <h3 className="text-lg font-bold mb-2">{unitList.length}</h3>
                <div className="flex flex-1 justify-end">
                  <h3
                    className="text-sm font-bold mb-2 text-blue-500 hover:text-blue-800 hover:cursor-pointer"
                    onClick={() => setUnits_popState((prev) => !prev)}
                  >
                    view units
                  </h3>
                </div>
              </div>

              {property.type === "rental" && (
                <React.Fragment>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Unit Name"
                    value={unit.unit || ""}
                    onChange={(e) => setUnit({ ...unit, unit: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Price"
                    value={unit.price || ""}
                    onChange={(e) =>
                      setUnit({ ...unit, price: e.target.value })
                    }
                  />
                </React.Fragment>
              )}
              {property.type === "land" && (
                <React.Fragment>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Plot Name/Number"
                    value={unit.unit || ""}
                    onChange={(e) => setUnit({ ...unit, unit: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Size (e.g., 20 acres)"
                    value={unit.size || ""}
                    onChange={(e) => setUnit({ ...unit, size: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Price"
                    value={unit.price || ""}
                    onChange={(e) =>
                      setUnit({ ...unit, price: e.target.value })
                    }
                  />
                </React.Fragment>
              )}
              {property.type === "vehicle" && (
                <React.Fragment>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Vehicle Make"
                    value={unit.make || ""}
                    onChange={(e) => setUnit({ ...unit, make: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Model"
                    value={unit.model || ""}
                    onChange={(e) =>
                      setUnit({ ...unit, model: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Year"
                    value={unit.year || ""}
                    onChange={(e) => setUnit({ ...unit, year: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    placeholder="Price"
                    value={unit.price || ""}
                    onChange={(e) =>
                      setUnit({ ...unit, price: e.target.value })
                    }
                  />
                </React.Fragment>
              )}
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                onClick={handleAddUnit}
              >
                Add Unit
              </button>
            </div>

            {/* Submit Property */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Submit Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const PropertyView = ({ property, setModalContent }) => {
  const [expandedLists, setExpandedLists] = useState({});
  const toggleList = (key) => {
    setExpandedLists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderValue = (value, key = "") => {
    if (Array.isArray(value)) {
      const isExpanded = expandedLists[key] || false;
      return (
        <div className="border rounded-lg shadow-sm mb-2">
          <div
            className="flex items-center justify-between bg-gray-100 p-3 cursor-pointer"
            onClick={() => toggleList(key)}
          >
            <span className="font-medium text-gray-700">
              {key.replace(/_/g, " ")}:
            </span>
            <i
              className={`fas ${
                isExpanded ? "fa-chevron-up" : "fa-chevron-down"
              } text-gray-500`}
            ></i>
          </div>
          {isExpanded && (
            <ul className="ml-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
              {value.map((item, index) => (
                <li key={index}>{renderObject(item)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return renderObject(value);
    } else {
      return <span>{value}</span>;
    }
  };

  const renderObject = (obj) => {
    return (
      <div className="ml-4">
        {Object.entries(obj).map(([key, value], index) => (
          <div key={index} className="mb-2">
            <span className="font-medium text-gray-700">
              {key.replace(/_/g, " ")}:
            </span>{" "}
            {renderValue(value, key)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white w-full shadow rounded-lg max-h-screen overflow-y-auto">
      <div className="w-full flex justify-end h-[30px]">
        <div
          className="w-[30px] flex justify-center items-center   text-white rounded-lg border-red-600 bg-red-300 border-b-4  hover:border-b-0 hover:translate-y-1 transition-all cursor-pointer aspect-square"
          onClick={() => setModalContent(null)}
        >
          <i className="fa fa-x"></i>
        </div>
      </div>
      <div className="mt-4">{renderObject(property)}</div>
    </div>
  );
};
const PropertyDisplay = ({ filteredProperties, setModalContent }) => {
  const [selectedProperty, setSelectedProperty] = useState({});
  useEffect(() => {
    if (Object.entries(selectedProperty).length)
      setModalContent(
        <PropertyView
          property={selectedProperty}
          setModalContent={setModalContent}
        />
      );
  }, [selectedProperty, setModalContent]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProperties.map((property, index) => {
        return (
          <div
            key={"prop-".concat(index)}
            className="border border-gray-300 rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-bold capitalize">{property.type}</h3>
              <h5 className="text-sm font-bold capitalize">
                units {property.units.length}
              </h5>
            </div>

            <p className="text-gray-600">
              <i className="fas fa-map-marker-alt mr-2"></i>
              Location: {property.location}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-calendar-alt mr-2"></i>
              Upload Date: {property.upload_date}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-calendar-check mr-2"></i>
              Update Date: {property.update_date}
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
              onClick={() => {
                setSelectedProperty(property);
              }}
            >
              View Details
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Property = ({ database, setDatabase, setModalContent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  //   filter properties
  const filteredProperties = database.properties.filter((property) => {
    const propertyData = JSON.stringify(property).toLowerCase();
    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // Split by space and remove empty strings
    return keywords.every((keyword) => propertyData.includes(keyword));
  });
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6">Properties</h2>
        <div
          className="bg-blue-300 text-white border-blue-600 border-b-4 hover:border-b-0 transition-all cursor-pointer hover:translate-y-2 h-fit px-2 py-1 rounded-md"
          onClick={() => {
            setModalContent(
              <AddProperty
                setDatabase={setDatabase}
                database={database}
                setModalContent={setModalContent}
              />
            );
          }}
        >
          add property
        </div>
      </div>
      {/* Search Input */}
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Display Properties */}
      <PropertyDisplay
        filteredProperties={filteredProperties}
        setModalContent={setModalContent}
      />
    </div>
  );
};

export default Property;
