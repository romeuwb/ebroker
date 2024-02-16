"use client"
import { translate } from "@/utils";
import dynamic from "next/dynamic.js";
import React from "react";

// import VerticleLayout from "@/Components/AdminLayout/VerticleLayout";
import AddPropertyTabs from "@/Components/AddPropertyTabs/AddPropertyTabs";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })

const UserAddProperty = () => {
   
    return (
        <VerticleLayout>
            <div className="container">
                <div className="dashboard_titles">
                    <h3>{translate("addProp")}</h3>
                </div>
                <div className="card" id="add_prop_tab">
                    <AddPropertyTabs />
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserAddProperty;
