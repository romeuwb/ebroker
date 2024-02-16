"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import Layout from '../Layout/Layout';


const TermsAndCondition = () => {

    const TermsAndCondition = useSelector(settingsData);
    const TermsAndConditionData = TermsAndCondition?.terms_conditions;
    const [termsData, setTermsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate data fetching delay
        setTimeout(() => {
            // Simulate fetched data (replace with actual data fetching)
            const simulatedData = TermsAndConditionData;
            setTermsData(simulatedData);
            setIsLoading(false);
        }, 2000);
    }, []);

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    return (
        <Layout>
            <Breadcrumb title={translate("terms&condition")} />
            <section id="termsSect">
                <div className="container">
                    <div className="card">
                        {isLoading ? (
                            // Show skeleton loading when data is being fetched
                            <div className="col-12 loading_data">
                                <Skeleton height={20} count={20} />
                            </div>
                        ) : (
                            // Render the privacy policy data when not loading
                            <div dangerouslySetInnerHTML={{ __html: termsData || "" }} />
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default TermsAndCondition
