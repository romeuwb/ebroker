import React from "react";
import ReactPaginate from "react-paginate";

const ReactPagination = ({ pageCount, onPageChange }) => {
    return (
        <div>
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={onPageChange}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
            />
        </div>
    );
};

export default ReactPagination;
