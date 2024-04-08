import React, { useEffect, useState } from "react";
import getTableData from "../../Api/table/get";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import updateTable from "../../Api/table/put";
import DeleteTable from "../../Api/table/delete";
import { useSelector, useDispatch } from "react-redux";
import {
  getTableDataAsync,
  getTableDataUpdateAsync,
  selectTableData,
} from "../../Redux_Thunk/ReduxThunk";

async function getTables(
  skip,
  limit,
  setIsFetching,
  setTableCount,
  signal,
  dispatch
) {
  setIsFetching(true);
  const response = await getTableData(skip, limit, signal);
  setIsFetching(false);
  if (response?.status == 200) {
    dispatch(getTableDataUpdateAsync(response.data));
    setTableCount(response.dataLength);
  }
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function DisplayTable() {
  const dispatch = useDispatch();
  const tableData = useSelector(selectTableData);

  useEffect(() => {
    console.log(tableData, "TableDataGloble");
  }, [tableData]);
  // States Used
  const [isFetching, setIsFetching] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [row, setRow] = useState(-1);
  const [col, setCol] = useState(-1);
  const [page, setPage] = useState(1);
  const [tableCount, setTableCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({
    id: "",
    firstName: "",
    lastName: "",
    gender: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      country: "",
      zipCode: "",
    },
    email: "",
    phone: "",
    other: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let error = "";

    // Validation based on schema
    switch (name) {
      case "id":
        if (!value.trim()) {
          error = "ID is required";
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.length < 3 || !/^[a-zA-Z]{3,}$/.test(value)) {
          error =
            "First name must be at least 3 characters long and contain only alphabetic characters";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.length < 3 || !/^[a-zA-Z]{3,}$/.test(value)) {
          error =
            "Last name must be at least 3 characters long and contain only alphabetic characters";
        }
        break;
      case "gender":
        if (!["MALE", "FEMALE", "OTHERS"].includes(value.toUpperCase())) {
          error = "Invalid gender value. It should be MALE, FEMALE, or OTHERS";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "phone":
        if (!/^[0-9]{10}$/.test(value)) {
          error =
            "Phone number must be 10 digits long and contain only numeric characters";
        }
        break;
      case "address.line1":
        if (!value.trim()) {
          error = "Address line 1 is required";
        } else if (value.length < 8) {
          error = "Address line 1 must be at least 8 characters long";
        }
        break;
      case "address.city":
        if (!value.trim()) {
          error = "City is required";
        }
        break;
      case "address.country":
        if (!value.trim()) {
          error = "Country is required";
        } else if (!/^[A-Z]{2}$/.test(value)) {
          error = "Country must be a 2-letter ISO code in uppercase";
        }
        break;
      case "address.zipCode":
        if (!value.trim()) {
          error = "ZIP code is required";
        } else if (value.length > 10) {
          error = "ZIP code cannot exceed 10 characters";
        }
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error });
  };
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map(async (item) => {
          await DeleteTable(item);
        })
      );
      dispatch(
        getTableDataUpdateAsync(
          [...tableData].filter((item) => !selectedItems.includes(item._id))
        )
      );
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    dispatch(getTableDataAsync([skip, limit, signal]));
    getTables(skip, limit, setIsFetching, setTableCount, signal, dispatch);
    setRow(-1);
    setCol(-1);
    // Cleanup function to cancel the API, if the component is unmounted or ...dependencies change

    return () => {
      abortController.abort();
    };
  }, [skip, limit]);

  const handleBlur = async (data, row) => {
    setRow(-1);
    setCol(-1);
    const recovery = tableData;
    const UpdatedObject = { ...tableData[row - 1], ...data };
    const helperArray = [...tableData];
    helperArray[row - 1] = UpdatedObject;
    dispatch(getTableDataUpdateAsync(helperArray));
    const response = await updateTable(UpdatedObject);
    if (response && response.status !== 200) {
      dispatch(getTableDataUpdateAsync([...recovery]));
    }
  };
  const handleCheckBoxChange = (event, id, indexPlace) => {
    if (event.target.checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };
  return (
    <>
      <table className="container table align-middle mb-0 bg-white mt-5">
        <thead className="bg-light">
          <tr>
            <th scope="col">#</th>
            {tableData.length > 0 &&
              Object.keys(tableData[0])
                .filter(
                  (item) =>
                    item !== "_id" && (item !== "__v") & (item !== "other")
                )
                .map((title, index) => (
                  <th key={index} scope="col" className="text-center">
                    {capitalizeFirstLetter(title)}
                  </th>
                ))}

            <th scope="col">
              Select{" "}
              {selectedItems?.length > 0 && (
                <>
                  {selectedItems?.length == 1 ? (
                    <button
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      Delete All ({selectedItems?.length})
                    </button>
                  )}
                </>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((items, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style={{ width: 45, height: 45 }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p
                      className="fw-bold mb-1 text-center"
                      onClick={() => {
                        setRow(index + 1);
                        setCol(1);
                      }}
                      onBlur={(event) => {
                        handleBlur(
                          {
                            address: {
                              ...items?.address,
                              line1: event.target.value,
                            },
                          },
                          row
                        );
                      }}
                    >
                      {" "}
                      {row == index + 1 && col == 1 ? (
                        <input
                          autoFocus
                          name="address.line1"
                          defaultValue={items?.address?.line1}
                          onChange={(event) => {
                            handleInputChange(event);
                          }}
                        ></input>
                      ) : (
                        items?.address?.line1
                      )}
                    </p>
                    <p className="text-muted mb-0 text-center">
                      City : {items?.address?.city}
                    </p>
                  </div>
                </div>
              </td>
              <td
                className="text-center"
                style={{
                  width: "100px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                onClick={() => {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Sorry, this field is not allowed to be edited!",
                  });
                  if (row != -1 && col != -1) {
                    setRow(-1);
                    setCol(-1);
                  }
                }}
              >
                {items.id}
              </td>
              <td
                className="text-center"
                onClick={() => {
                  setRow(index + 1);
                  setCol(2);
                }}
              >
                {row === index + 1 && col === 2 ? (
                  <>
                    <input
                      autoFocus
                      name="firstName"
                      defaultValue={items?.firstName}
                      onBlur={(event) => {
                        handleBlur({ firstName: event.target.value }, row);
                      }}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`} // Add class 'is-invalid' if there's an error
                    />
                    <div className="invalid-feedback">{errors.firstName}</div>{" "}
                    {/* Display error message */}
                  </>
                ) : (
                  items?.firstName
                )}
              </td>

              <td
                className="text-center"
                onClick={() => {
                  setRow(index + 1);
                  setCol(3);
                }}
              >
                {row === index + 1 && col === 3 ? (
                  <>
                    <input
                      autoFocus
                      name="lastName"
                      defaultValue={items?.lastName}
                      onBlur={(event) => {
                        handleBlur({ lastName: event.target.value }, row);
                      }}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`} // Add class 'is-invalid' if there's an error
                    />
                    <div className="invalid-feedback">{errors.lastName}</div>{" "}
                    {/* Display error message */}
                  </>
                ) : (
                  items?.lastName
                )}
              </td>

              <td
                className="text-center"
                onClick={() => {
                  setRow(index + 1);
                  setCol(4);
                }}
              >
                {row === index + 1 && col === 4 ? (
                  <>
                    <input
                      autoFocus
                      name="gender"
                      defaultValue={items?.gender}
                      onBlur={(event) => {
                        handleBlur({ gender: event.target.value }, row);
                      }}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      className={`form-control ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">{errors.gender}</div>
                  </>
                ) : (
                  items?.gender
                )}
              </td>

              <td
                className="text-center"
                onClick={() => {
                  setRow(index + 1);
                  setCol(5);
                }}
              >
                {row === index + 1 && col === 5 ? (
                  <>
                    <input
                      autoFocus
                      name="email"
                      defaultValue={items?.email}
                      onBlur={(event) => {
                        handleBlur({ email: event.target.value }, row);
                      }}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </>
                ) : (
                  items?.email
                )}
              </td>

              <td
                className="text-center"
                onClick={() => {
                  setRow(index + 1);
                  setCol(6);
                }}
              >
                {row === index + 1 && col === 6 ? (
                  <>
                    <input
                      autoFocus
                      name="phone"
                      defaultValue={items?.phone}
                      onBlur={(event) => {
                        handleBlur({ phone: event.target.value }, row);
                      }}
                      onChange={(event) => {
                        handleInputChange(event);
                      }}
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
                  </>
                ) : (
                  items?.phone
                )}
              </td>

              <td>
                <button
                  type="button"
                  className="btn btn-link btn-sm btn-rounded"
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue={selectedItems.includes(items._id)}
                      checked={selectedItems.includes(items._id)}
                      onChange={(event) => {
                        handleCheckBoxChange(event, items._id, index);
                      }}
                      id={"flexCheckIndeterminate" + items._id}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={"flexCheckIndeterminate" + items._id}
                    >
                      select{" "}
                    </label>
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className=" mt-3 justify-content-center align-items-center">
        {tableCount > 5 && (
          <Pagination
            page={page}
            setPage={setPage}
            tableCount={tableCount}
            limit={limit}
            setSkip={setSkip}
            skip={skip}
          ></Pagination>
        )}
      </div>
    </>
  );
}

export default DisplayTable;
