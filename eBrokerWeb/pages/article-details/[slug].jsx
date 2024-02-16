import React from 'react'
import axios from "axios";
import { GET_ARTICLES } from "@/utils/api";
import Meta from "@/Components/Seo/Meta";
import ArticleDetails from '@/Components/ArticleDetails/ArticleDetails';


// This is seo api
const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_ARTICLES}?slug_id=${slug}`
        );

        const SEOData = response.data;


        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};


const Index = ({ seoData, currentURL }) => {
    return (
        <>
          <Meta
                title={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_title}
                description={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_description}
                keywords={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_keywords}
                ogImage={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_image}
                pathName={currentURL}
            />
            <ArticleDetails />
        </>
    )
}
let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req } = context; // Extract query and request object from context
        const { params } = req[Symbol.for('NextInternalRequestMeta')]._nextMatch;
        // Accessing the slug property
        const slugValue = params.slug;

       
        const currentURL = `${req.headers.host}${req.url}`;

        const seoData = await fetchDataFromSeo(slugValue);

        return {
            props: {
                seoData,
                currentURL,
            },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;

export default Index
