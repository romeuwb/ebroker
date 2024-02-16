"use client"
import React, { useState, useEffect } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { GetFeturedListingsApi } from "@/store/actions/campaign";
import Link from "next/link";
import VerticalCard from "@/Components/Cards/VerticleCard";
import VerticalCardSkeleton from "@/Components/Skeleton/VerticalCardSkeleton";
import Pagination from "@/Components/Pagination/ReactPagination";
import { useSelector } from "react-redux";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';


const MostViewProperties = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [getMostViewed, setMostViewed] = useState([]);
    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);

    const limit = 8;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    useEffect(() => {
        setIsLoading(true);
        GetFeturedListingsApi({
            top_rated: "2",
            offset: offsetdata.toString(),
            limit: limit.toString(),
            current_user: isLoggedIn ? userCurrentId : "",
            onSuccess: (response) => {
                setTotal(response.total);
                const MostViewedData = response.data;
                setIsLoading(false);
                setMostViewed(MostViewedData);
            },
            onError: (error) => {
                setIsLoading(true);
                console.log(error);
            }
        }
        );
    }, [offsetdata, isLoggedIn]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };


    return (
        <Layout>
            <Breadcrumb title={translate("mostViewedProp")} />
            <section id="featured_prop_section">
                {isLoading ? ( // Show Skeleton when isLoading is true
                    <div className="container">
                        <div id="feature_cards" className="row">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <VerticalCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : getMostViewed && getMostViewed.length > 0 ? (
                    <>
                        <div className="container">
                            <div id="feature_cards" className="row">
                                {getMostViewed.map((ele, index) => (
                                    <div className="col-sm-12 col-md-6 col-lg-3" key={index}>
                                        <Link href="/properties-details/[slug]" as={`/properties-details/${ele.slug_id}`} passHref>
                                            <VerticalCard ele={ele} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="noDataFoundDiv">
                        <NoData />
                    </div>
                )}
                {getMostViewed && getMostViewed.length > 0 ? (
                    <div id="feature_cards" className="row">
                        <div className="col-12">
                            <Pagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : null}
            </section>
        </Layout>
    )
}

export default MostViewProperties
