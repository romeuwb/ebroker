"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Skeleton from "react-loading-skeleton";
import { GetCountByCitysCategorisApi } from "@/store/actions/campaign";
import Link from "next/link";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import Image from "next/image";
import NoData from "@/Components/NoDataFound/NoData";
import Layout from '../Layout/Layout';

const NearBycity = () => {
    const [isLoading, setIsLoading] = useState(true);

    // GET_COUNT_BY_CITIES_CATEGORIS
    const [getNearByCitysData, setGetNearByCitysData] = useState(null); // Initialize as null
    useEffect(() => {
        GetCountByCitysCategorisApi(
            (response) => {
                setIsLoading(false);
                const cityData = response.city_data;
                setGetNearByCitysData(cityData);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    return (
        <Layout>
            <Breadcrumb title={translate("propNearByCities")} />
            <section id="all-nearby-citys">
                {isLoading ? (
                    <div className="container">
                        <div className="all-city-images row">
                            {Array.from({ length: getNearByCitysData ? getNearByCitysData.length : 12 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3 loading_data" key={index}>
                                    <Skeleton width="100%" height="350px" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : getNearByCitysData && getNearByCitysData.length > 0 ? (
                    <div className="container">
                        <div className="all-city-images row">
                            {getNearByCitysData.map((ele) => (
                                <div className="col-12 col-md-6 col-lg-3" key={ele.id}>
                                    <Link href={`/properties/city/${ele.City}`}>
                                        <div className="card bg-dark text white mb-3" id="nearby-city-img">
                                            <Image loading="lazy" src={ele.image} className="card-img" alt="no_img" id="city-img" width={200} height={200} />
                                            <div className="card-img-overlay">
                                                <div id="city_img_headlines">
                                                    <h4
                                                        className="card-title">{ele.City}</h4>
                                                    <p className="card-text">
                                                        {ele.Count} {translate("properties")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="noDataFoundDiv">
                        <NoData />
                    </div>
                )}
            </section>
        </Layout>
    )
}

export default NearBycity
