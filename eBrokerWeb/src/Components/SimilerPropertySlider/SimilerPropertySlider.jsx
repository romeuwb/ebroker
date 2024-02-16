import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import VerticalCard from "../Cards/VerticleCard";
import VerticalCardSkeleton from "../Skeleton/VerticalCardSkeleton";
import Link from "next/link";
import { GetFeturedListingsApi } from "@/store/actions/campaign";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { store } from "@/store/store";
import { translate } from "@/utils";

const SimilerPropertySlider = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [getSimilerData, setSimilerData] = useState();

    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const router = useRouter();
    const propId = router.query;

    useEffect(() => {
        setIsLoading(true);
        GetFeturedListingsApi({
            get_simiilar: "1",
            current_user: isLoggedIn ? userCurrentId : "",
            slug_id: propId.slug,
            onSuccess: (response) => {
                const propertyData = response.data;
                setIsLoading(false);
                setSimilerData(propertyData);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        });
    }, [isLoggedIn, propId]);

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
            {getSimilerData?.length > 0 ? (
                <>
                    <div className="similer-headline">
                        <span className="headline">
                            {translate("similer")} {" "}
                            <span>
                                <span className="highlight"> {translate("properties")}</span>
                            </span>
                        </span>
                    </div>
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
                                getSimilerData &&
                                getSimilerData.map((ele, index) => (
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

export default SimilerPropertySlider;
