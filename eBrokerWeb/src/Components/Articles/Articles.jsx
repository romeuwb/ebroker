"use client"
import React, { useEffect, useState } from 'react'
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiGridFill } from "react-icons/ri";
import { IoMdArrowDropright } from "react-icons/io";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { GetAllArticlesApi } from "@/store/actions/campaign";
import ArticleCard from "@/Components/Cards/ArticleCard";
import Skeleton from "react-loading-skeleton";
import ArticleCardSkeleton from "@/Components/Skeleton/ArticleCardSkeleton";
import ArticleHorizonatalCard from "@/Components/Cards/ArticleHorizonatalCard";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice";
import { settingsData } from "@/store/reducer/settingsSlice";
import NoData from "@/Components/NoDataFound/NoData";
import { categoriesCacheData } from "@/store/reducer/momentSlice";
import Layout from '../Layout/Layout';



const Articles = () => {


    const [isLoading, setIsLoading] = useState(false);
    const [expandedStates, setExpandedStates] = useState([]);
    const [grid, setGrid] = useState(false);

    const [getArticles, setGetArticles] = useState();
    const [total, setTotal] = useState();

    const lang = useSelector(languageData);
    const Categorydata = useSelector(categoriesCacheData);

    useEffect(() => { }, [lang]);

    // GET ARTICLES
    useEffect(() => {
        setIsLoading(true);
        GetAllArticlesApi(
            "",
            "",
            "",
            "",
            (response) => {
                const Articles = response.data;
                setTotal(response.total);
                setIsLoading(false);
                setGetArticles(Articles);
                setExpandedStates(new Array(Articles.length).fill(false));
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const SettingsData = useSelector(settingsData);
    const PlaceHolderImg = SettingsData?.web_placeholder_logo;

    const adminProfile = SettingsData;
    const getArticleByCategory = (cateId) => {
        setIsLoading(true);
        GetAllArticlesApi(
            "",
            cateId,
            "",
            "",
            (response) => {
                const Articles = response.data;

                if (response.total) {
                    setTotal(response.total);
                } else {
                    setTotal("0");
                }

                setIsLoading(false);
                setGetArticles(Articles);
                setExpandedStates(new Array(Articles.length).fill(false));
            },
            (error) => {
                console.log(error);
            }
        );
    };
    const getGeneralArticles = () => {
        setIsLoading(true);
        GetAllArticlesApi(
            "",
            "",
            "",
            "",
            (response) => {
                const Articles = response.data;
                setTotal(response.total);

                setIsLoading(false);
                setGetArticles(Articles);
                setExpandedStates(new Array(Articles.length).fill(false));
            },
            (error) => {
                console.log(error);
            }
        );
    };

    return (
        <Layout>
            <Breadcrumb title={translate("articles")} />
            <div className="all-articles">
                <div id="all-articles-content">
                    <div className="container">
                        <div className="row" id="main-content">
                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="all-article-rightside">
                                    {total ? (
                                        <div className="card">
                                            <div className="card-body" id="all-article-headline-card">
                                                <div>
                                                    <span>
                                                        {total > 0 ? total : 0} {translate("articleFound")}
                                                    </span>
                                                </div>
                                                <div className="grid-buttons">
                                                    <button className="mx-3" id="layout-buttons" onClick={() => setGrid(true)}>
                                                        <AiOutlineUnorderedList size={25} />
                                                    </button>
                                                    <button id="layout-buttons" onClick={() => setGrid(false)}>
                                                        <RiGridFill size={25} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-12 loading_data">
                                            <Skeleton height={50} count={1} />
                                        </div>
                                    )}
                                    {getArticles && getArticles.length > 0 ? (
                                        !grid ? (
                                            // Row cards

                                            <div className="all-prop-cards" id="rowCards">
                                                <div className="row" id="all-articles-cards">
                                                    {isLoading
                                                        ? // Show skeleton loading when data is being fetched
                                                        Array.from({ length: getArticles ? getArticles.length : 6 }).map((_, index) => (
                                                            <div className="col-sm-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <ArticleCardSkeleton />
                                                            </div>
                                                        ))
                                                        : getArticles?.map((ele, index) => (
                                                            <div className="col-12 col-md-6 col-lg-4" key={index}>
                                                                <ArticleCard ele={ele} expandedStates={expandedStates} index={index} />
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div id="columnCards">
                                                <div className="row">
                                                    {isLoading
                                                        ? // Show skeleton loading when data is being fetched
                                                        Array.from({ length: getArticles ? getArticles.length : 6 }).map((_, index) => (
                                                            <div className="col-sm-12 col-md-6 col-lg-4 loading_data" key={index}>
                                                                <ArticleCardSkeleton />
                                                            </div>
                                                        ))
                                                        : getArticles?.map((ele, index) => (
                                                            <div className="col-12 " id="horizonatal_articles" key={index}>
                                                                <ArticleHorizonatalCard ele={ele} expandedStates={expandedStates} index={index} PlaceHolderImg={PlaceHolderImg} />
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="noDataFoundDiv">
                                            <NoData />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="all-articles-leftside">
                                    <div className="cate-card">
                                        <div className="card">
                                            <div className="card-header">{translate("categories")}</div>
                                            <div className="card-body">
                                                <div className="cate-list">
                                                    <span>General</span>
                                                    <IoMdArrowDropright size={25} className="cate_list_arrow" onClick={getGeneralArticles} />
                                                </div>
                                                {Categorydata &&
                                                    Categorydata.map((elem, index) => (
                                                        <div className="cate-list" key={index}>
                                                            <span>{elem.category}</span>
                                                            <IoMdArrowDropright
                                                                size={25}
                                                                className="cate_list_arrow"
                                                                onClick={() => {
                                                                    getArticleByCategory(elem.id);
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='popular-tag-card'>
                                        <div className="card">
                                            <div className="card-header">
                                                Popular Tags
                                            </div>
                                            <div className="card-body">
                                                <div className="pop-tags">
                                                    <span>apartment</span>
                                                    <span>modern</span>
                                                    <span>building</span>
                                                    <span>luxarious</span>
                                                    <span>real estate</span>
                                                    <span>Villa</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Articles
