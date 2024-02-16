import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

const MobileHeadline = (props) => {
    const { data } = props;
    return (
        <>
            <div className="container">
                <div id="mobile-headlines">
                    <div className="main-headline">
                        <span className="headline">
                            {data && data.start}{" "}
                            <span>
                                <span className="highlight"> {data && data.center}</span>
                            </span>{" "}
                            {data && data.end}
                        </span>
                    </div>
                    <div>
                        <Link href={data?.link}>
                            <button className="mobileViewArrow">
                                <IoIosArrowForward size={25} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileHeadline;
