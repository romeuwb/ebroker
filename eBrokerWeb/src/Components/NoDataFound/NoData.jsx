import React from "react";
import NoDataFound from "../../assets/no_data_found_illustrator.svg";
import { translate } from "@/utils";
import Image from "next/image";

const NoData = () => {
    return (
        <div className="col-12 text-center">
            <div>
                <Image loading="lazy" src={NoDataFound.src} alt="no_img" width={200} height={200} />
            </div>
            <div className="no_data_found_text">
                <h3>{translate("noData")}</h3>
                <span>{translate("noDatatext")}</span>
            </div>
        </div>
    );
};

export default NoData;
