"use client"
import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { BsArrowRight } from "react-icons/bs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import VerticalCard from "../Cards/VerticleCard";
import VerticalCardSkeleton from "../Skeleton/VerticalCardSkeleton";
import Link from "next/link";
import MobileHeadline from "../MobileHeadlines/MobileHeadline";

import { store } from "@/store/store";
import { translate } from "@/utils";
const NearbyCityswiper = ({ data, isLoading, userCurrentLocation }) => {

    const breakpoints = {
        320: {
            slidesPerView: 1,
        },
        375: {
            slidesPerView: 1.5,
        },
        576: {
            slidesPerView: 1.5,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        },
        1400: {
            slidesPerView: 4,
        },
    };

    const language = store.getState().Language.languages;
    return (
        <div div id="similer-properties">
            {data?.length > 0 ? (
                <>
                    <div className="most_fav_header">
                        <div>
                            <h3>
                                {translate("properties")}{" "} {translate("nearby")}{" "}
                                <span>
                                    <span className="highlight"> {userCurrentLocation}</span>
                                </span>{" "}

                            </h3>
                        </div>
                        {data.length > 4 ? (
                            <div className="rightside_most_fav_header">
                                <Link href={`/properties/city/${userCurrentLocation}`}>
                                    <button className="learn-more" id="viewall">
                                        <span aria-hidden="true" className="circle">
                                            <div className="icon_div">
                                                <span className="icon arrow">
                                                    <BsArrowRight />
                                                </span>
                                            </div>
                                        </span>
                                        <span className="button-text">{translate("seeAllProp")}</span>
                                    </button>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    {/* {data.length > 4 ? ( */}
                        <div className="mobile-headline-view">
                            <MobileHeadline
                                data={{
                                    start: translate("properties"),
                                    center: translate("nearby"),
                                    end: userCurrentLocation,
                                    link: `/properties/city/${userCurrentLocation}`,
                                }}
                            />
                        </div>
                    {/* ) : null} */}
                    <div className="similer-prop-slider">
                        <Swiper
                            dir={language.rtl === "1" ? "rtl" : "ltr"}
                            slidesPerView={4}
                            spaceBetween={30}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className="similer-swiper"
                            breakpoints={breakpoints}
                        >
                            {isLoading ? (
                                <Swiper
                                    dir={language.rtl === "1" ? "rtl" : "ltr"}
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    freeMode={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[FreeMode, Pagination]}
                                    className="most-view-swiper"
                                    breakpoints={breakpoints}
                                >
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <SwiperSlide>
                                            <div className="loading_data">
                                                <VerticalCardSkeleton />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                data &&
                                data.map((ele, index) => (
                                    <SwiperSlide id="similer-swiper-slider" key={index}>
                                        <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                            <VerticalCard ele={ele} />
                                        </Link>
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default NearbyCityswiper;
