"use client"
import React, { useEffect } from "react";
import EditPropertyTabs from "@/Components/EditPropertyTabs/EditPropertyTabs";
import { translate } from "@/utils";
import { languageData } from "@/store/reducer/languageSlice";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic.js";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })
const UserEditProperty = () => {
    const lang = useSelector(languageData);

    useEffect(() => {}, [lang]);
    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("editProp")}</h3>
                </div>
                <div className="card" id="add_prop_tab">
                    <EditPropertyTabs />
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserEditProperty;
