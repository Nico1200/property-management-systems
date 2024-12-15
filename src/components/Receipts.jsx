/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { formateDate, formatToCommaSeparated } from "./init";
import Search from "./Search";

/**
 * @typedef {Object} Receipt
 * @property {string} amount - The amount of money in the receipt.
 * @property {string} balance - The remaining balance.
 * @property {string} being_payment_of - Description of the payment purpose.
 * @property {string} cheque_no - The cheque number, if applicable.
 * @property {string} date - The date of the receipt.
 * @property {string} fax - The fax number.
 * @property {string} post_office_box - The post office box number.
 * @property {string} receipt_no - The receipt number.
 * @property {string} received_from - The name of the person making the payment.
 * @property {string} signature - The signature of the person issuing the receipt.
 * @property {string} tel - The telephone number.
 * @property {string} unit - The unit associated with the receipt.
 */
const ReceiptView = ({ receipt, receiptIndex }) => {
  // .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort receipts by date (most recent first)
  const autoGeneratedKey = `${receipt?.unit}_pos${receiptIndex}`;
  let location = receipt.location;
  return (
    <>
      <div
        key={autoGeneratedKey}
        className="grid gap-4 relative border-blue-400 border-2 p-4 py-9 rounded-md"
      >
        <div className="absolute capitalize bottom-0 right-2 text-slate-200">
          {location}
        </div>
        {/*  */}
        <div className="grid grid-cols-3">
          <div className="grid gap-2">
            <div>
              <div className="inline-block font-bold">Tel:</div>{" "}
              <label className="w-full border-blue-400 border-dashed border-b-2">
                {receipt.tel}
              </label>
            </div>
            <div>
              <div className="inline-block font-bold">Fax:</div>{" "}
              <label className="w-full border-blue-400 border-dashed border-b-2">
                {receipt.fax}
              </label>
            </div>
            <div>
              <div className="inline-block font-bold">No.</div>{" "}
              <label>{receipt.receipt_no}</label>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-blue-800">RECEIPT</h1>
          </div>
          {/*  */}
          <div className="grid justify-end">
            <div className="grid gap-1">
              <div>
                <div className="inline-block font-bold">P.O.Box</div>{" "}
                <label className="w-full border-blue-400 border-dashed border-b-2">
                  {receipt.post_office_box}
                </label>
              </div>
              <div>
                <div className="inline-block font-bold">Date</div>{" "}
                <label className="w-full border-blue-400 border-dashed border-b-2">
                  {receipt.date}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="grid gap-2">
          {/*  */}
          <div className="flex gap-2">
            <div className="inline-block font-bold">Received from </div>
            <label className="border-blue-200 inline-block border-b-2 flex-1">
              {receipt.received_from.toUpperCase()}
            </label>
          </div>
          {/*  */}
          <div className="flex gap-2">
            <div className="inline-block font-bold">sum of: </div>
            <label className="border-blue-200 inline-block border-b-2 flex-1">
              {receipt.sum_of.toUpperCase()} SHILLINGS ONLY.
            </label>
          </div>
          {/*  */}
          <div className="flex gap-2">
            <div className="inline-block font-bold">being payment of </div>
            <label className="border-blue-200 inline-block border-b-2 flex-1">
              {receipt.being_payment_of}
            </label>
          </div>
        </div>

        {/*  */}
        <div className="grid grid-cols-2">
          <div>
            <div className="inline-block font-bold">Cash/ Cheque No.</div>{" "}
            <label>{receipt.cheque_no}</label>
          </div>
          <div className="flex gap-2">
            <div className="inline-block font-bold">Balance</div>{" "}
            <label className="inline-block h-fit border-blue-200 border-b-2 flex-1">
              {receipt.balance}
            </label>
          </div>
        </div>

        {/*  */}
        <div className="grid grid-cols-2">
          <div className="flex gap-2">
            <div className="inline-block font-bold">Amount</div>{" "}
            <div className="flex flex-col items-center">
              <label className="border-blue-200 border-2 w-[150px] p-1 rounded-md">
                {formatToCommaSeparated(receipt.amount)} SHS
              </label>
              <label>WITH THANKS</label>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="inline-block font-bold">Sign</div>{" "}
            <label className="inline-block h-fit border-blue-200 border-b-2 flex-1">
              {receipt.signature}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

const ReceiptsForm = ({
  setModalContent,
  rentalProperties,
  setRentalProperties,
}) => {
  const form = useRef();
  const [receipt, setReceipt] = useState({});

  const [propDetails, setpropDetails] = useState(
    rentalProperties.map((property, propIndex) => {
      const location = property.location;
      const indexMain = property.indexMain;
      const unitNames = property.units.map((unit) => unit.unit);
      return { location, unitNames, indexMain };
    })
  );

  const [unitNames, setUnitNames] = useState(
    propDetails.length
      ? propDetails.map((propD, propIndex) => propD.unitNames)[0]
      : []
  );

  useEffect(() => {
    if (form.current) {
      const formData = new FormData(form.current);
      const initialValues = {};
      for (const [key, value] of formData.entries()) {
        initialValues[key] = value;
      }
      setReceipt(initialValues);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") {
      let lpos = parseInt(value.split(":-")[2]);
      // value = value.split(":-")[0];
      setUnitNames(
        propDetails.length
          ? propDetails.map((propD, propIndex) => propD.unitNames)[lpos]
          : []
      );
    }
    setReceipt((prevReceipt) => ({
      ...prevReceipt,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault(); // Prevent the default page reload

    // console.log("Receipt Data:", receipt);

    let position = parseInt(receipt.location.split(":-")[2]);
    let unitPosition = parseInt(receipt.unit);
    console.log(position);
    setRentalProperties((prev) => {
      return prev.map((property, index) => {
        if (index === position) {
          const updatedReceipts = Array.isArray(
            property.units[unitPosition].receipts
          )
            ? [...property.units[unitPosition].receipts, receipt]
            : [receipt];
          property.units[unitPosition].receipts = updatedReceipts;
          return property;
        }
        return property;
      });
    });

    // console.log(rentalProperties);

    // Reset the form fields
    event.target.reset();

    // Reset the receipt state
    setReceipt({});
  };

  return (
    <div
      id="receiptForm"
      className={"max-w-2xl mx-auto bg-white p-6 rounded-lg"}
    >
      <div className="flex gap-2 justify-between">
        <h2 className="text-2xl font-bold mb-6">New Receipt</h2>
        <div className="w-[32px]  flex justify-center items-center ">
          <div
            className="w-[32px] flex transition-all text-white justify-center items-center rounded-md hover:border-b-0 cursor-pointer hover:translate-y-1 border-b-4 border-red-600 aspect-square bg-red-300"
            onClick={() => setModalContent(null)}
          >
            <i className="fa fa-x"></i>
          </div>
        </div>
      </div>

      <form
        ref={form}
        id="newReceiptForm"
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              location
            </label>
            <select
              name="location"
              id="location"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            >
              {propDetails.map((pDetail, pIndex) => (
                <option
                  value={`${pDetail.location}:-${pDetail.indexMain}:-${pIndex}`}
                  key={pIndex}
                >
                  {pDetail.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              unit
            </label>
            <select
              name="unit"
              id="unit"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            >
              {unitNames.map((uDetail, uIndex) => (
                <option value={uIndex} key={uIndex}>
                  {uDetail}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tel
            </label>
            <input
              type="tel"
              name="tel"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fax
            </label>
            <input
              type="text"
              name="fax"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Receipt No
            </label>
            <input
              type="text"
              name="receipt_no"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Post Office Box
            </label>
            <input
              type="text"
              name="post_office_box"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Received From
            </label>
            <input
              type="text"
              name="received_from"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Being Payment Of
            </label>
            <input
              type="text"
              name="being_payment_of"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cheque No
            </label>
            <input
              type="text"
              name="cheque_no"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Balance
            </label>
            <input
              type="number"
              name="balance"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sum Of
            </label>
            <input
              type="text"
              name="sum_of"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Signature
            </label>
            <input
              type="text"
              name="signature"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Email
            </label>
            <input
              type="email"
              name="client_email"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Phone Number
            </label>
            <input
              type="text"
              name="client_phonenumber"
              className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="text-right mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

const ReceiptsView = ({ rentalProperties }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const generateReceipts = (properties) => {
    let receipts = [];
    for (let [propertyIndex, property] of Object.entries(properties)) {
      /**
       * @type {Receipt[]}
       */
      const flattenedReceipts = property.units?.map((unit, unit_index) => {
        if (typeof unit.receipts === "undefined") return [];
        return unit.receipts?.map((receipt) => {
          let unitName = unit.unit.split(" ").join("");
          receipt.unit = `${unitName}_unit${unit_index}`;
          receipt.location = property.location;
          receipt.dataSring = formateDate(receipt.date);
          return receipt;
        });
      });
      receipts = [...receipts, ...flattenedReceipts];
      // console.log(receipts);
    }
    return receipts.flat();
  };
  const [receipts, setReceipts] = useState(generateReceipts(rentalProperties));

  const filteredReceipts = receipts.filter((receipt) => {
    const receiptData = JSON.stringify(receipt).toLowerCase();
    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // Split by space and remove empty strings
    return keywords.every((keyword) => receiptData.includes(keyword));
  });

  return (
    <>
      {/* Search Input */}
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid gap-4">
        {filteredReceipts?.map((receipt, receiptIndex) => {
          return (
            <ReceiptView
              key={receiptIndex}
              receiptIndex={receiptIndex}
              receipt={receipt}
            />
          );
        })}
      </div>
    </>
  );
};

const Receipts = ({ database, setDatabase, setModalContent }) => {
  const [properties, setProperties] = useState(
    database.properties.map((value, index) => {
      if (value.type === "rental") {
        value.units = value.units.map((unit_value, unit_index) => {
          if (!unit_value.receipts) {
            unit_value.receipts = [];
          }
          return unit_value;
        });
      }
      return value;
    })
  );

  useEffect(() => {
    if (properties.length) setDatabase((prev) => ({ ...prev, properties }));
  }, [properties]);

  const [rentalProperties, setRentalProperties] = useState(
    properties
      .map((property, pos) => ({ ...property, indexMain: pos })) // Add index to each property
      .filter((property) => property.type === "rental") // Filter by type
  );

  useEffect(() => {
    for (let [index, rental] of Object.entries(rentalProperties)) {
      let position = parseInt(rental.indexMain);

      setProperties((prev) => {
        return prev.map((property, pindex) => {
          if (pindex === position) {
            return rental;
          }
          return property;
        });
      });

      //
    }
  }, [rentalProperties]);

  return (
    <div className="container mx-auto p-6">
      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Receipts</h2>
          <div
            className="bg-blue-300 text-white border-blue-600 border-b-4 hover:border-b-0 transition-all cursor-pointer hover:translate-y-2 h-fit px-2 py-1 rounded-md"
            onClick={() =>
              setModalContent(
                <ReceiptsForm
                  setModalContent={setModalContent}
                  rentalProperties={rentalProperties}
                  setRentalProperties={setRentalProperties}
                />
              )
            }
          >
            add receipt
          </div>
        </div>

        {/* Receipts List */}
        <ReceiptsView rentalProperties={rentalProperties} />
      </div>
    </div>
  );
};

export default Receipts;
