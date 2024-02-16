import { translate } from "@/utils";
import React, { useState } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiGridFill } from "react-icons/ri";


const GridCard = (props) => {
    const { total, setGrid } = props;
    const [isGrid, setIsGrid] = useState(true);

    const toggleGrid = () => {
        setGrid(!isGrid);
        setIsGrid(!isGrid);
    };

    return (
        <div className="card">
            <div className="card-body" id="all-prop-headline-card">
                <div>
                    <span>{total && `${total} ${translate("propFound")}`}</span>
                </div>
                <div>
                    <button className="mx-3" id="layout-buttons" onClick={toggleGrid}>
                        {isGrid ? <AiOutlineUnorderedList size={25} /> : <RiGridFill size={25} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GridCard;

