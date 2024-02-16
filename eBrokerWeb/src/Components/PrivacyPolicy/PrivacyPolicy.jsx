"use client"
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { languageData } from "@/store/reducer/languageSlice";
import { settingsData } from "@/store/reducer/settingsSlice";
import { translate } from "@/utils";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import Layout from "../Layout/Layout";

const PrivacyPolicy = () => {
    const privacyPolicyData = useSelector(settingsData);
    const PrivacyData = privacyPolicyData?.privacy_policy;
    const [privacyData, setPrivacyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            const simulatedData = PrivacyData;
            setPrivacyData(simulatedData);
            setIsLoading(false);
        }, 2000);
    }, []);
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    return (
        <Layout>
            <Breadcrumb title={translate("privacyPolicy")} />
            <section id="privacySect">
                <div className="container">
                    <div className="card">
                        {isLoading ? (
                            <div className="col-12 loading_data">
                                <Skeleton height={20} count={20} />
                            </div>
                        ) : (
                           
                            <div dangerouslySetInnerHTML={{ __html: privacyData || "" }} />
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default PrivacyPolicy
