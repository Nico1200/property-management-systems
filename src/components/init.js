// Initialize Database
const initialDatabase = {
  tenants: [],
  properties: [
    /*{
      type: "rental",
      units: [
        {
          unit: "house1",
          price: "500000",
          status: "vacant",
          receipts: [
            {
              tel: "123456789",
              fax: "123456789",
              receipt_no: "001",
              post_office_box: "123",
              date: "2024-12-01",
              received_from: "John Doe",
              being_payment_of: "Rent",
              cheque_no: "CHQ001",
              balance: "100000",
              amount: "400000",
              sum_of: "four hundred thousand",
              signature: "John Doe",
              client_email: "johndoe@gmail.com",
              client_phonenumber: "123456789",
            },
          ],
        },
      ],
      location: "zana",
      upload_date: "2024-12-01",
      update_date: "2024-12-08",
    },
    {
      type: "land",
      units: [
        {
          unit: "Plot 22",
          size: "20 acres",
          price: "100000000",
        },
      ],
      location: "Entebbe",
      upload_date: "2024-11-15",
      update_date: "2024-12-02",
    },
    {
      type: "vehicle",
      units: [
        {
          unit: "Car",
          make: "Toyota",
          model: "Corolla",
          year: "2020",
          price: "30000000",
        },
      ],
      location: "Kampala",
      upload_date: "2024-10-20",
      update_date: "2024-11-30",
    }, */
  ],
  financials: {
    totalIncome: 0,
    currentYearIncome: 0,
    lastYearReset: new Date().getFullYear(),
    totalDebts: 0,
    paymentHistory: [],
  },
};

/**
 * Converts a value into a comma-separated format.
 * @param {number|string} value - The value to format.
 * @returns {string} The formatted value with commas.
 */
function formatToCommaSeparated(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new TypeError("Input must be a number or a string.");
  }

  // Convert the value to a string and format it
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formateDate(inputDate) {
  // split the input date string into parts
  const [year, month, day] = inputDate.split("-");
  // create date object using input parts
  const date = new Date(year, month - 1, day);
  const months = [
    "January",
    "February",
    "Match",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${
    months[date.getMonth()]
  } ${date.getDate()},  ${date.getFullYear()}`;

  return formattedDate;
}

export { initialDatabase, formatToCommaSeparated, formateDate };
