import React, { useEffect, useState } from "react";
import { ButtonGroup, Modal } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { BiFilter } from "react-icons/bi";
import { translate } from "@/utils";
import LocationSearchBox from "../Location/LocationSearchBox";
import { GrRefresh } from "react-icons/gr";
import { RiCloseCircleLine, RiSendPlane2Line } from "react-icons/ri";
import { useRouter } from "next/router";
import { getfilterData } from "@/store/reducer/momentSlice";
import { BsPinMap } from "react-icons/bs";


const SearchTab = ({ getCategories }) => {
    const router = useRouter();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterD, setFilterD] = useState();
    const [formData, setFormData] = useState({
        propType: "", // Set your default value here
        minPrice: "",
        maxPrice: "",
        postedSince: "",
        selectedLocation: null,
    });
    const [activeTab, setActiveTab] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const handleHideFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Ensure the value is at least 0
        const sanitizedValue = Math.max(parseFloat(value), 0);

        // Update the form data
        setFormData({
            ...formData,
            [name]: sanitizedValue,
        });
    };



    const handlePostedSinceChange = (e) => {
        setFormData({
            ...formData,
            postedSince: e.target.value,
        });
    };

    const handleLocationSelected = (locationData) => {
        setFormData({
            ...formData,
            selectedLocation: locationData,
        });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab === "sell" ? 0 : 1);
    };
    const handleApplyFilter = () => {
        let postedSinceValue = "";
        if (formData.postedSince === "yesterday") {
            postedSinceValue = "0";
        } else if (formData.postedSince === "lastWeek") {
            postedSinceValue = "1";
        }

        // Include the postedSince value in the filterData object
        const filterData = {
            propType: formData.propType || "", // Set to empty string if not selected
            minPrice: formData.minPrice || "0", // Set to empty string if not selected
            maxPrice: formData.maxPrice !== undefined ? formData.maxPrice : "", // Set to empty string if not selected
            postedSince: postedSinceValue, // Include it here
            selectedLocation: formData.selectedLocation || null, // Set to null if not selected
        };
        // Set the filter data in state
        setFilterD(filterData);
        setShowFilterModal(false); // Close the modal
    };
    useEffect(() => {
        // You can access the updated filterD value here
    }, [filterD]);
    const handleSearch = (e) => {
        e.preventDefault();

        const searchData = {
            filterData: filterD,
            activeTab: activeTab,
            searchInput: searchInput,
        };
        getfilterData(searchData)

        setShowFilterModal(false); // Close the modal

        // Redirect to /search
        router.push(`/search`);
    };

    const handleClearFilter = () => {
        setFormData({
            propType: "",
            minPrice: "",
            maxPrice: "",
            postedSince: "",
            selectedLocation: null, // Set to null to clear it
        });
    };

    return (
        <div>
            <div id="searchbox" className="container">
                <ButtonGroup>
                    <ul className="nav nav-tabs" id="tabs">
                        <li className="">
                            <a className={`nav-link ${activeTab === 0 ? "tab-0" : ""}`} aria-current="page" id="sellbutton" onClick={() => handleTabClick("sell")}>
                                {translate("sell")}
                            </a>
                        </li>
                        <li className="">
                            <a className={`nav-link ${activeTab === 1 ? "tab-1" : ""}`} onClick={() => handleTabClick("rent")} aria-current="page" id="rentbutton">
                                {translate("rent")}
                            </a>
                        </li>
                    </ul>
                </ButtonGroup>

                <div id="searchcard">
                    <div id="searchbuttoon">
                        <FiSearch size={20} />
                        <input className="searchinput" placeholder="Search your property" name="propertySearch" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    </div>
                    <div id="leftside-buttons">
                        <button className="map_add" onClick={() => router.push('/properties-on-map')}>
                            <BsPinMap size={20} /> {""}{""}{""}
                            <span>{translate("map")}
                            </span>
                        </button>
                        <button className="filter" onClick={() => setShowFilterModal(true)}>
                            <BiFilter size={25} />
                            {translate("filter")}
                        </button>
                        <button className="find" onClick={handleSearch}>
                            {translate("search")}
                        </button>
                    </div>
                </div>
            </div>
            <Modal show={showFilterModal} onHide={handleHideFilterModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" className="filter-modal">
                <Modal.Header>
                    <Modal.Title>{translate("filterProp")}</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={handleHideFilterModal} />
                </Modal.Header>
                <Modal.Body>
                    <form action="">
                        <div className="first-grup">
                            <div className="prop-type-modal">
                                <span>{translate("propTypes")}</span>
                                <select className="form-select" aria-label="Default select" name="propType" value={formData.propType} onChange={handleInputChange}>
                                    <option value="">{translate("selectPropType")}</option>
                                    {/* Add more options as needed */}
                                    {getCategories &&
                                        getCategories?.map((ele, index) => (
                                            <option key={index} value={ele.id}>
                                                {ele.category}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="prop-location-modal">
                                <span>{translate("selectYourLocation")}</span>
                                <LocationSearchBox onLocationSelected={handleLocationSelected} />
                            </div>
                        </div>
                        <div className="second-grup">
                            <div className="budget-price-modal">
                                <span>{translate("budget")}</span>
                                <div className="budget-inputs">
                                    <input className="price-input" type="number" placeholder="Min Price" name="minPrice" value={formData.minPrice} onChange={handleInputChange} />
                                    <input className="price-input" type="number" placeholder="Max Price" name="maxPrice" value={formData.maxPrice} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="third-grup">
                            <div className="posted-since">
                                <span>{translate("postedSince")}</span>
                                <div className="posted-duration-modal">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="anytime" checked={formData.postedSince === "anytime"} onChange={handlePostedSinceChange} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            {translate("anytime")}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="lastWeek" checked={formData.postedSince === "lastWeek"} onChange={handlePostedSinceChange} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            {translate("lastWeek")}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" value="yesterday" checked={formData.postedSince === "yesterday"} onChange={handlePostedSinceChange} />
                                        <label className="form-check-label" htmlFor="flexRadioDefault3">
                                            {translate("yesterday")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className="filter-footer">
                    <div className="clear-filter-modal" onClick={handleClearFilter}>
                        <GrRefresh size={25} />
                        <button id="clear-filter-button" type="submit" >
                            {translate("clearFilter")}
                        </button>
                    </div>
                    <div className="apply-filter-modal" onClick={handleApplyFilter}>
                        <RiSendPlane2Line size={25} />
                        <button id="apply-filter-button" type="submit" >
                            {translate("applyFilter")}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SearchTab;
