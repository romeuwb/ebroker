import React from "react";
import ReactPaginate from "react-paginate";

const TablePagination = ({ pageCount, onPageChange }) => {
    return (
        <div>
            <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={onPageChange}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link01"}
                nextLinkClassName={"pagination__link01"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
            />
        </div>
    );
};

export default TablePagination;
