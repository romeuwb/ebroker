import { AddFavourite } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { formatPriceAbbreviated, isThemeEnabled, translate } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ImageToSvg } from "./ImageToSvg";

function VerticalCard({ ele, onRemoveCard, onImageLoad }) {


    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;

    const isLoggedIn = useSelector((state) => state.User_signup);

    const handleImageLoad = () => {
        if (onImageLoad) {
            onImageLoad();
        }
    };
    // Initialize isLiked based on ele.is_favourite
    const [isLiked, setIsLiked] = useState(ele.is_favourite === 1);

    // Initialize isDisliked as false
    const [isDisliked, setIsDisliked] = useState(false);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoggedIn && isLoggedIn.data && isLoggedIn.data.token) {
            AddFavourite(
                ele.id,
                "1",
                (response) => {
                    setIsLiked(true);
                    setIsDisliked(false);
                    toast.success(response.message);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            toast.error("Please login first to add this property to favorites.");
        }
    };

    const handleDislike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AddFavourite(
            ele.id,
            "0",
            (response) => {
                setIsLiked(false);
                setIsDisliked(true);
                toast.success(response.message);
                onRemoveCard(ele.id);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        // Update the state based on ele.is_favourite when the component mounts
        setIsLiked(ele.is_favourite === 1);
        setIsDisliked(false);
    }, [ele.is_favourite]);

    const DummyImgData = useSelector(settingsData);
    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const themeEnabled = isThemeEnabled();

    return (
        <div className="verticle_card">
            <div className="card verticle_main_card">
                <div className="verticle_card_img_div">
                    <Image loading="lazy" className="card-img" id="verticle_card_img" src={ele.title_image ? ele.title_image : PlaceHolderImg} alt="no_img" width={200} height={200} onLoad={handleImageLoad} />
                </div>
                <div className="card-img-overlay">
                    {ele.promoted ? <span className="feature_tag">{translate("feature")}</span> : null}

                    <span className="like_tag">
                        {isLiked ? (
                            <AiFillHeart size={25} className="liked_property" onClick={handleDislike} />
                        ) : isDisliked ? (
                            <AiOutlineHeart size={25} className="disliked_property" onClick={handleLike} />
                        ) : (
                            <AiOutlineHeart size={25} onClick={handleLike} />
                        )}
                    </span>
                </div>

                <div className="card-body">
                    <span className="sell_teg">{ele.property_type}</span>
                    <span className="price_teg">
                        {CurrencySymbol} {formatPriceAbbreviated(ele.price)}
                    </span>
                    <div className="feature_card_mainbody">
                        <div className="cate_image">
                            {themeEnabled ? (

                                <ImageToSvg imageUrl={ele.category && ele.category.image} className="custom-svg" />
                            ) : (
                                <Image loading="lazy" src={ele.category && ele.category.image} alt="no_img" width={20} height={20} />
                            )}

                        </div>
                        <span className="feature_body_title"> {ele.category && ele.category.category} </span>
                    </div>
                    <div className="feature_card_middletext">
                        <span>{ele.title}</span>
                        <p>
                            {ele.city} {ele.city ? "," : null} {ele.state} {ele.state ? "," : null} {ele.country}
                        </p>
                    </div>
                </div>

                <div className="card-footer" id="feature_card_footer">
                    <div className="row">
                        {ele.parameters &&
                            ele.parameters.slice(0, 4).map((elem, index) => (
                                <div className="col-sm-12 col-md-6 " key={index}>
                                    <div className="footer_content" key={index}>
                                        <div>
                                            {themeEnabled ? (

                                                <ImageToSvg imageUrl={elem?.image} className="custom-svg" />
                                            ) : (
                                                <Image loading="lazy" src={elem.image} alt="no_img" width={20} height={16} />
                                            )}
                                        </div>
                                        <p className="text_footer"> {elem.name}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerticalCard;
