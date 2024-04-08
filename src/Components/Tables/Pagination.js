import React from "react";
import { Link } from "react-router-dom";

function Pagination({
  setPage,
  setTableData,
  tableCount,
  limit,
  setSkip,
  skip,
  page,
}) {
  const handlePageClick = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit; // Calculate the new skip value
    setSkip(newSkip); // Update the skip state
    setPage(pageNumber);
  };
  const handlePrevious = () => {
    if (skip > 1) {
      setSkip(skip - limit);
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = (page) => {
    if (skip <= Math.ceil(tableCount / limit)) {
      setSkip(skip + limit);
      setPage((prev) => prev + 1);
    }
  };
  return (
    <nav
      className="container mt-3 justify-content-center align-items-center"
      aria-label="..."
    >
      <ul className="pagination">
        <li
          className="page-item disabled"
          onClick={() => {
            handlePrevious(page);
          }}
        >
          <p className="page-link" href="#" tabIndex={-1}>
            Previous
          </p>
        </li>
        {Array.from({ length: Math.ceil(tableCount / limit) }).map(
          (item, index) => (
            <li
              className={`page-item ${page === index + 1 ? "active" : ""}`}
              key={index}
              onClick={() => {
                handlePageClick(index + 1);
              }}
            >
              <a className="page-link" href="#">
                {index + 1}
              </a>
            </li>
          )
        )}
        <li
          className="page-item"
          onClick={() => {
            handleNext(page);
          }}
        >
          <p className="page-link" href="#">
            Next
          </p>
        </li>
        <li
          className="page-item mx-4"
          onClick={() => {
            handleNext(page);
          }}
        >
          <Link to={"/Add-new-table"}>
            <p className="page-link" href="#">
              Add new Table
            </p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
