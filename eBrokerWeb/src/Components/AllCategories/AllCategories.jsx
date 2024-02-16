"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import CategoryCard from "@/Components/Cards/CategoryCard";
import NoData from "@/Components/NoDataFound/NoData";
import CustomCategorySkeleton from "@/Components/Skeleton/CustomCategorySkeleton";
import { languageData } from "@/store/reducer/languageSlice";
import { categoriesCacheData } from "@/store/reducer/momentSlice";
import { translate } from "@/utils";
import Link from "next/link";
import { useSelector } from "react-redux";
import Layout from '../Layout/Layout';

const AllCategories = () => {

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    const [isLoading, setIsLoading] = useState(false);
    const Categorydata = useSelector(categoriesCacheData);

    return (
        <Layout>
            <Breadcrumb title={translate("allCategories")} />
            <section id="view_all_cate_section">
                <div className="cate_section">
                    {Categorydata?.length > 0 && Categorydata.some(ele => ele.properties_count !== 0 && ele.properties_count !== "")? (
                        <div className="container">
                            <div className="row">
                                {isLoading
                                    ? // Show skeleton loading when data is being fetched
                                    Array.from({ length: Categorydata ? Categorydata.length : 12 }).map((_, index) => (
                                        <div className="col-sm-12 col-md-6 col-lg-2 loading_data" key={index}>
                                            <CustomCategorySkeleton />
                                        </div>
                                    ))
                                    : Categorydata &&
                                    Categorydata?.map((ele, index) =>
                                        ele.properties_count !== 0 && ele.properties_count !== "" ? (
                                            <div className="col-sm-12 col-md-6 col-lg-2" key={index}>
                                                <Link href={`/properties/categories/${ele.slug_id}`}>
                                                    <CategoryCard ele={ele} />
                                                </Link>
                                            </div>
                                        ) : null
                                    )}
                            </div>
                        </div>
                    ) : (
                        <div className="noDataFoundDiv">
                            <NoData />
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default AllCategories
