import { settingsData } from "@/store/reducer/settingsSlice";
import { isThemeEnabled, translate } from "@/utils";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ImageToSvg } from "./ImageToSvg";

const CategoryCard = ({ ele }) => {
    const DummyImgData = useSelector(settingsData);
    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const themeEnabled = isThemeEnabled();

    return (
        <div className="Category_card">
            <Card id="main_aprt_card">
                <Card.Body>
                    <div className="apart_card_content">
                        <div id="apart_icon">
                            {themeEnabled ? (
                                <ImageToSvg imageUrl={ele.image ? ele.image : PlaceHolderImg} className="custom-svg" />
                            ) : (
                                <Image loading="lazy" src={ele.image ? ele.image : PlaceHolderImg} alt="no_img" className="solo_icon" width={200} height={200} />
                            )}
                        </div>
                        <div id="apart_name">
                            {ele.category}
                            <div id="propertie_count">
                                {ele.properties_count} {translate("properties")}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CategoryCard;
