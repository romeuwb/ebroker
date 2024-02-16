"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { translate } from "@/utils";
import { GetFacilitiesApi, PostProperty } from "@/store/actions/campaign";
import GoogleMapBox from "../Location/GoogleMapBox";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";
import { userSignUpData } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { categoriesCacheData } from "@/store/reducer/momentSlice";
import { languageData } from "@/store/reducer/languageSlice";



function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function AddPropertyTabs() {
    const router = useRouter();

    const [value, setValue] = useState(0);
    const [getFacilities, setGetFacilities] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploaded3DImages, setUploaded3DImages] = useState([]); // State to store uploaded images
    const [galleryImages, setGalleryImages] = useState([]); // State to store uploaded images
    const [uploadedOgImages, setUploadedOgImages] = useState([]); // State to store uploaded images
    const [categoryParameters, setCategoryParameters] = useState([]);
    const [selectedLocationAddress, setSelectedLocationAddress] = useState("");

    const PackageData = useSelector(settingsData);
    const userData = useSelector(userSignUpData);
    const userId = userData?.data?.data?.id;
    const packageId = PackageData?.package?.user_purchased_package[0]?.package_id;

    const Categorydata = useSelector(categoriesCacheData);
    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);
    const [tab1, setTab1] = useState({
        propertyType: "",
        category: "",
        title: "",
        price: "",
        propertyDesc: "",
        rentduration: ""
    });
    const [tab2, setTab2] = useState({});
    const [tab3, setTab3] = useState({});

    const [tab5, setTab5] = useState({
        titleImage: [],
        _3DImages: [],
        galleryImages: [],
        videoLink: "",
    });
    const [tab6, setTab6] = useState({
        MetaTitle: "",
        MetaKeyword: "",
        MetaDesc: "",
        ogImages: []

    });

    const GoogleMapApi = process.env.NEXT_PUBLIC_GOOGLE_API;

    useEffect(() => {
        GetFacilitiesApi(
            (response) => {
                const facilitiyData = response && response.data;
                setGetFacilities(facilitiyData);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const handleChange = (e, newValue) => {
        e.preventDefault()
        setValue(newValue);
    };
    const handleInputChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setTab1({
            ...tab1,
            [name]: value,
        });
        setTab6({
            ...tab6,
            [name]: value,
        });
    };
    const handleCategoryChange = (e) => {
        e.preventDefault()
        const selectedCategory = e.target.value;

        // Parse selectedCategory as a number (assuming id is a number in Categoriesss)
        const selectedCategoryId = parseInt(selectedCategory);

        // Assuming Categoriesss is an array of objects with a 'category' property
        const selectedCategoryData = Categorydata.find((category) => category.id === selectedCategoryId);

        if (selectedCategoryData) {
            // Debugging: Log the parameters to ensure they are available.

            // Extract and set the parameters for the selected category
            setCategoryParameters(selectedCategoryData.parameter_types.parameters);

            // Update the formData.category with the selected category ID
            setTab1({
                ...tab1,
                category: selectedCategoryId, // Update formData with the ID
            });
        } else {
            // Reset parameters if the category is not found
            setCategoryParameters([]);

            // Clear the formData.category if no category is selected
            setTab1({
                ...tab1,
                category: "", // Clear the selected category
            });
        }
    };
    const handlePropertyTypes = (event) => {
        const selectedValue = event.target.value;

        if (selectedValue !== tab1.propertyType) {
            // Only update formData.propertyType if a different option is selected
            setTab1({ ...tab1, propertyType: selectedValue });

        }
    };
    const handleRentDurationChange = (e) => {
        const value = e.target.value;
        // Do something with the selected value, for example, update the state
        setTab1((prevTab1) => ({ ...prevTab1, rentduration: value }));
    };
    const handleTab2InputChange = (fieldId, value, e) => {
        setTab2((prevData) => ({
            ...prevData,
            [fieldId]: value,
        }));
    };
    const handleCheckboxChange = (fieldId, isChecked) => {
        setTab2((prevTab2Data) => ({
            ...prevTab2Data,
            [fieldId]: isChecked,
        }));
    };
    const handleRadioChange = (e, fieldId, selectedOption) => {
        setTab2((prevTab2Data) => ({
            ...prevTab2Data,
            [fieldId]: selectedOption,
        }));
    };

    const handleTab3InputChange = (fieldId, value) => {

        // Ensure that the input value is a positive number
        const parsedValue = parseFloat(value);
        const newValue = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;

        setTab3((prevData) => ({
            ...prevData,
            [fieldId]: newValue,
        }));
    };

    const handleLocationSelect = (address) => {

        // Update the form field with the selected address
        setSelectedLocationAddress(address);
    };

    const handleTab4InputChange = (event) => {
        event.preventDefault()
        const { name, value } = event.target;
        // Update the corresponding field in tab4Data using the input's "name" attribute
        setSelectedLocationAddress((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => { }, [tab1, tab2, tab3, selectedLocationAddress, tab5]);

    const updateFileInput = (fieldId) => (e) => {
        const fileInput = e.target;
        const fileLabel = document.getElementById(`file-label_${fieldId}`);
        const selectedFileName = document.getElementById(`selected-file-name_${fieldId}`);

        if (fileInput && fileLabel && selectedFileName) {
            if (fileInput.files.length > 0) {
                // Update the label text with the selected file name
                fileLabel.textContent = fileInput.files[0].name;
                selectedFileName.textContent = `Selected File: ${fileInput.files[0].name}`;

                // Store the selected file in tab2 state (assuming tab2 is an object)
                setTab2((prevTab2Data) => ({
                    ...prevTab2Data,
                    [fieldId]: fileInput.files[0],
                }));
            } else {
                // If no file is selected, revert to the default label text
                fileLabel.textContent = "Choose a file";
                selectedFileName.textContent = "";

                // Remove the file from tab2 state (if it exists)
                setTab2((prevTab2Data) => {
                    const updatedTab2Data = { ...prevTab2Data };
                    delete updatedTab2Data[fieldId];
                    return updatedTab2Data;
                });
            }
        } else {
            console.error(`One or more elements with IDs not found: file-label_${fieldId}, selected-file-name_${fieldId}`);
        }
    };

    // title img 
    const onDrop = useCallback((acceptedFiles) => {
        // Log the acceptedFiles to check if they are being received correctly

        // const imgfile = acceptedFiles[0]

        // Append the uploaded files to the uploadedImages state
        setUploadedImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setTab5((prevState) => ({
            ...prevState,
            titleImage: acceptedFiles,
        }));
    }, [])

    const removeImage = (index) => {
        // Remove an image from the uploadedImages state by index
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*', // Accept only image files
    });

    const files = useMemo(
        () =>
            uploadedImages.map((file, index) => (
                <div key={index} className="dropbox_img_div">
                    <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="dropbox_d">
                        <button className="dropbox_remove_img" onClick={() => removeImage(index)}>
                            <CloseIcon fontSize='25px' />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )),
        [uploadedImages]
    );

    // 3d images 
    const onDrop3D = useCallback((acceptedFiles) => {
        // Log the acceptedFiles to check if they are being received correctly


        // Append the uploaded 3D files to the uploaded3DImages state
        setUploaded3DImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setTab5((prevState) => ({
            ...prevState,
            _3DImages: acceptedFiles,
        }));
    }, []);

    const remove3DImage = (index) => {
        // Remove a 3D image from the uploaded3DImages state by index
        setUploaded3DImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps: getRootProps3D, getInputProps: getInputProps3D, isDragActive: isDragActive3D } = useDropzone({
        onDrop: onDrop3D,
        accept: 'model/*', // Accept only 3D model files (update the accept type as needed)
    });
    const files3D = useMemo(
        () =>
            uploaded3DImages.map((file, index) => (
                <div key={index} className="dropbox_img_div">
                    <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="dropbox_d">
                        <button className="dropbox_remove_img" onClick={() => remove3DImage(index)}>
                            <CloseIcon fontSize='25px' />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )),
        [uploaded3DImages]
    );


    // gallary imgs 
    const onDropGallery = useCallback((acceptedFiles) => {
        // Log the acceptedFiles to check if they are being received correctly


        // Append the uploaded gallery files to the galleryImages state
        setGalleryImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setTab5((prevState) => ({
            ...prevState,
            galleryImages: [...prevState.galleryImages, ...acceptedFiles],
        }));
    }, []);

    const removeGalleryImage = (index) => {
        // Remove a gallery image from the galleryImages state by index
        setGalleryImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps: getRootPropsGallery, getInputProps: getInputPropsGallery, isDragActive: isDragActiveGallery } = useDropzone({
        onDrop: onDropGallery,
        accept: 'image/*', // Accept only image files for the gallery
        multiple: true, // Allow multiple file selection
    });

    const galleryFiles = useMemo(
        () =>
            galleryImages.map((file, index) => (
                <div key={index} className="dropbox_gallary_img_div">
                    <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="dropbox_d">
                        <button className="dropbox_remove_img" onClick={() => removeGalleryImage(index)}>
                            <CloseIcon fontSize='25px' />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )),
        [galleryImages]
    );

    // Seo OG img
    const onDropOgImage = useCallback((acceptedFiles) => {
        // Log the acceptedFiles to check if they are being received correctly
        // Check if each selected image is less than or equal to 300KB
        const isSizeValid = acceptedFiles.every((file) => file.size <= 300 * 1024);

        if (!isSizeValid) {
            // Display a toast error message
            toast.error('Error: Selected image size should be 300KB or less.');
            return;
        }
        // Append the uploaded ogImage files to the uploadedOgImages state
        setUploadedOgImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setTab6((prevState) => ({
            ...prevState,
            ogImages: acceptedFiles,
        }));
    }, []);

    const removeOgImage = (index) => {
        // Remove an ogImage from the uploadedOgImages state by index
        setUploadedOgImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const { getRootProps: getRootPropsOgImage, getInputProps: getInputPropsOgImage, isDragActive: isDragActiveOgImage } = useDropzone({
        onDrop: onDropOgImage,
        accept: 'image/*', // Accept only image files (update the accept type as needed)
    });

    const ogImageFiles = useMemo(
        () =>
            uploadedOgImages.map((file, index) => (
                <div key={index} className="dropbox_img_div">
                    <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="dropbox_d">
                        <button className="dropbox_remove_img" onClick={() => removeOgImage(index)}>
                            <CloseIcon fontSize='25px' />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )),
        [uploadedOgImages]
    );






    const handleVideoInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // Update the tab5 state with the entered video link
        setTab5((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const areFieldsFilled = (tab) => {
        // Check if any of the required fields are empty or undefined
        if (!tab.propertyType || !tab.category || !tab.title || !tab.price || !tab.propertyDesc) {
            // Some required fields are not filled
            return false;
        }

        // All required fields are filled
        return true;
    };
    const areFieldsFilled1 = (seodata) => {
        // Check if any of the required fields are empty or undefined
        if (!seodata.MetaTitle || !seodata.MetaKeyword || !seodata.MetaDesc) {
            // Some required fields are not filled
            return false;
        }

        // All required fields are filled
        return true;
    };

    const areLocationFieldsFilled = (location) => {

        // Check if any of the required fields are empty or undefined
        if (!location.city || !location.state || !location.country || !location.formatted_address || !selectedLocationAddress) {
            // Some required fields are not filled
            return false;
        }

        // All required fields are filled
        return true;
    };

    const handleNextTab = (e) => {
        if (!areFieldsFilled(tab1)) {
            // Display a toast message to fill in all required fields
            toast.error("Please fill in all required fields ");
        } else {
            // Proceed to the next tab
            setValue(value + 1);

        }
    };
    const handleNextTab2 = (e) => {
        if (!areFieldsFilled1(tab6)) {
            // Display a toast message to fill in all required fields
            toast.error("Please fill in all required fields ");
        } else {
            // Proceed to the next tab
            setValue(value + 1);

        }
    };
    const handleNextTab4 = () => {
        // Check if the location fields in tab 4 are empty

        if (!areLocationFieldsFilled(selectedLocationAddress)) {
            // Display a toast message to fill in all property address details in tab 4
            toast.error("Please fill in all property address details.");
        } else {
            // Proceed to the next tab
            setValue(value + 1);

        }
    };

    const handlePostproperty = async (e) => {
        e.preventDefault();

        try {
            if (!areFieldsFilled(tab1)) {
                // Display a toast message to fill in all required fields for Tab 1
                toast.error("Please fill in all required fields in Property Details");

                // Switch to Tab 1
                setValue(0);
            } else if (!areLocationFieldsFilled(selectedLocationAddress)) {
                // Display a toast message to fill in all required location fields
                toast.error("Please select a location with all required fields (city, state, country, and formatted_address)");
                // Switch to Tab 4
                setValue(4);
            } else if (!areFieldsFilled1(tab6)) {
                // Display a toast message to fill in all required location fields
                toast.error("Please fill in all required fields in Property Details");
                // Switch to Tab 4
                setValue(1);
            } else if (uploadedImages.length === 0) {
                // Display a toast message if Title Image is not selected
                toast.error("Please select a Title Image");
            } else if (packageId === undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "You have not subscribed. Please subscribe first",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/subscription-plan"); // Redirect to the subscription page
                    }
                });
            } else {
                // Rest of your code remains the same

                const parameters = [];
                const facilities = [];

                // Assuming tab2 contains parameter data
                for (const [key, value] of Object.entries(tab2)) {
                    parameters.push({
                        parameter_id: key,
                        value: value,
                        // You may need to adjust these fields based on your data structure
                    });
                }

                // Assuming tab3 contains facility data
                for (const [key, value] of Object.entries(tab3)) {
                    facilities.push({
                        facility_id: key,
                        distance: value,
                        // You may need to adjust these fields based on your data structure
                    });
                }

                PostProperty(
                    userId,
                    packageId ? packageId : "",
                    tab1.title,
                    tab1.propertyDesc,
                    selectedLocationAddress.city,
                    selectedLocationAddress.state,
                    selectedLocationAddress.country,
                    selectedLocationAddress.lat,
                    selectedLocationAddress.lng,
                    selectedLocationAddress.formatted_address,
                    tab1.price,
                    tab1.category,
                    tab1.propertyType,
                    tab5.videoLink,
                    parameters, // Pass the combined parameters as "allParameters"
                    facilities,
                    tab5.titleImage[0],
                    tab5._3DImages[0],
                    tab5.galleryImages,
                    tab6.MetaTitle,
                    tab6.MetaDesc,
                    tab6.MetaKeyword,
                    tab6.ogImages[0],
                    tab1.rentduration,
                    async (response) => {
                        if (response.message === "Package not found") {
                            toast.error(response.message);
                            await Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "You have not subscribed. Please subscribe first",
                            });
                            router.push("/subscription-plan"); // Redirect to the subscription page
                        } else if (response.message === "Package Limit is over") {
                            await Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Your Package Limit is Over. Please Purchase Package.",
                                customClass: {
                                    confirmButton: 'Swal-buttons',
                                },
                            });
                            router.push("/subscription-plan"); // Redirect to the subscription page
                        } else if (response.message === "Package not found for add property") {
                            await Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Package not found for add property. Please Purchase Package.",
                                customClass: {
                                    confirmButton: 'Swal-buttons',
                                },
                            });
                            router.push("/subscription-plan"); // Redirect to the subscription page
                        } else {
                            toast.success(response.message);
                            router.push("/user/dashboard");
                        }
                    },
                    (error) => {
                        toast.error(error);
                    }
                );
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={translate("propDeatils")} {...a11yProps(0)} />
                    <Tab label={translate("SEOS")} {...a11yProps(1)} />
                    <Tab label={translate("facilities")} {...a11yProps(2)} />
                    <Tab label={translate("OTF")} {...a11yProps(3)} />
                    <Tab label={translate("location")} {...a11yProps(4)} />
                    <Tab label={translate("I&V")} {...a11yProps(5)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        <div className="col-sm-12 col-md-6">
                            <div id="add_prop_form">
                                <div className="add_prop_fields">
                                    <span>{translate("propTypes")}</span>
                                    <div className="add_prop_types">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="0" onChange={handlePropertyTypes} checked={tab1.propertyType === "0"} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                {translate("sell")}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="1" onChange={handlePropertyTypes} checked={tab1.propertyType === "1"} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                {translate("rent")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="add_prop_fields">
                                    <span>{translate("category")}</span>
                                    <select className="form-select categories" aria-label="Default select" name="category" value={tab1.category} onChange={handleCategoryChange}>
                                        <option value="">{translate("selectPropType")}</option>
                                        {/* Map over Categories and set the 'value' of each option to the 'id' */}
                                        {Categorydata &&
                                            Categorydata.map((ele, index) => (
                                                <option key={index} value={ele.id}>
                                                    {ele.category}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="add_prop_fields">
                                    <span>{translate("title")}</span>
                                    <input type="text" id="prop_title_input" placeholder="Enter Property Title" name="title" onChange={handleInputChange} value={tab1.title} />
                                </div>
                                {tab1.propertyType !== "1" ? (
                                    <div className="add_prop_fields">
                                        <span>{translate("price")}</span>
                                        <input
                                            type="number"
                                            id="prop_title_input"
                                            placeholder="Enter Property Price ($)"
                                            name="price"
                                            onChange={handleInputChange}
                                            value={tab1.price}
                                            onInput={(e) => {
                                                if (e.target.value < 0) {
                                                    e.target.value = 0;
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">

                                            <div className="add_prop_fields">
                                                <span>{translate("price")}</span>
                                                <input
                                                    type="number"
                                                    id="prop_title_input"
                                                    placeholder="Enter Property Price ($)"
                                                    name="price"
                                                    onChange={handleInputChange}
                                                    value={tab1.price}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="add_prop_fields">
                                                <span>{translate("RentDuration")}</span>
                                                <select
                                                    className="form-select RentDuration"
                                                    aria-label="Default select"
                                                    name="rentduration"

                                                    value={tab1.rentduration}
                                                    onChange={handleRentDurationChange}
                                                >
                                                    <option value="">{translate("SelectRentDuration")}</option>
                                                    <option value="Daily">Daily</option>
                                                    <option value="Monthly">Monthly</option>
                                                    <option value="Yearly">Yearly</option>
                                                    <option value="Quarterly">Quarterly</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="add_prop_fields">
                                <span>{translate("propDesc")}</span>
                                <textarea rows={13} id="about_prop" placeholder="Enter About Property" name="propertyDesc" onChange={handleInputChange} value={tab1.propertyDesc} />
                            </div>
                        </div>
                    </div>

                    <div className="nextButton">
                        <button type="button" onClick={handleNextTab}>
                            {translate("next")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>


            <CustomTabPanel value={value} index={1}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div id="add_prop_form">
                                <div className="add_prop_fields">
                                    <span>{translate("metatitle")}</span>
                                    <input type="text" id="prop_title_input" placeholder="Enter Property Meta Title" name="MetaTitle" onChange={handleInputChange} value={tab6.MetaTitle} />
                                </div>
                                <p style={{ color: "#FF0000", fontSize: "smaller" }}> {translate("Warning: Meta Title")}</p>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div id="add_prop_form">
                                <div className="add_prop_fields">
                                    <span>{translate("ogimage")}</span>
                                    <div className="dropbox">
                                        <div {...getRootPropsOgImage()} className={`dropzone ${isDragActiveOgImage ? "active" : ""}`}>
                                            <input {...getInputPropsOgImage()} />
                                            {uploadedOgImages.length === 0 ? (
                                                isDragActiveOgImage ? (
                                                    <span>{translate("dropFiles")}</span>
                                                ) : (
                                                    <span>
                                                        {translate("dragFiles")} <span style={{ textDecoration: "underline" }}> {translate("browse")}</span>
                                                    </span>
                                                )
                                            ) : null}
                                        </div>
                                        <div>{ogImageFiles}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div id="add_prop_form">
                                <div className="add_prop_fields">
                                    <span>{translate("metakeyword")}</span>
                                    <textarea rows={5} id="about_prop" placeholder="Enter Property Meta Keywords" name="MetaKeyword" onChange={handleInputChange} value={tab6.MetaKeyword} />
                                </div>
                                <p style={{ color: "#FF0000", fontSize: "smaller" }}>{translate("Warning: Meta Keywords")}</p>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="add_prop_fields">
                                <span>{translate("metadescription")}</span>
                                <textarea rows={5} id="about_prop" placeholder="Enter Property Meta Description" name="MetaDesc" onChange={handleInputChange} value={tab6.MetaDesc} />

                            </div>
                            <p style={{ color: "#FF0000", fontSize: "smaller" }}>{translate("Warning: Meta Description")}</p>
                        </div>
                    </div>

                    <div className="nextButton">
                        <button type="button" onClick={handleNextTab2}>
                            {translate("next")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        {categoryParameters.length > 0 ? (
                            categoryParameters.map((ele, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3" key={index}>
                                    <div className="add_prop_fields">
                                        <span>{ele.name}</span>

                                        {ele.type_of_parameter === "number" ? (
                                            <>
                                                <input
                                                    value={tab2[ele.id] || ""}
                                                    type="number"
                                                    className="prop_number_input"
                                                    id={`prop_title_input_${ele.id}`}
                                                    onChange={(e) => handleTab2InputChange(ele.id, e.target.value)}
                                                    onInput={(e) => {
                                                        if (e.target.value < 0) {
                                                            e.target.value = 0;
                                                        }
                                                    }}
                                                />
                                            </>
                                        ) : ele.type_of_parameter === "checkbox" ? (
                                            <>
                                                <div className="row paramters_row">
                                                    {ele.type_values.map((option, optionIndex) => (
                                                        <div className="col-sm-12" key={optionIndex}>
                                                            <div className="custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`checkbox_${ele.id}_${optionIndex}`}
                                                                    className="custom-checkbox-input"
                                                                    checked={tab2[`${ele.id}_${optionIndex}`] || false}
                                                                    onChange={(e) => handleCheckboxChange(`${ele.id}_${optionIndex}`, e.target.checked)}
                                                                />
                                                                <label htmlFor={`checkbox_${ele.id}_${optionIndex}`} className="custom-checkbox-label">
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : ele.type_of_parameter === "textbox" ? (
                                            <input type="text" className="prop_textbox_input" id={`textbox_${ele.id}`} value={tab2[ele.id] || ""} onChange={(e) => handleTab2InputChange(ele.id, e.target.value)} />
                                        ) : ele.type_of_parameter === "textarea" ? (
                                            <textarea className="prop_textarea_input" rows={4} id={`textarea_${ele.id}`} value={tab2[ele.id] || ""} onChange={(e) => handleTab2InputChange(ele.id, e.target.value)} />
                                        ) : ele.type_of_parameter === "radiobutton" ? (
                                            <>
                                                <div className="row paramters_row">
                                                    {ele.type_values.map((option, optionIndex) => (
                                                        <div className="col-sm-12" key={optionIndex}>
                                                            <div className="custom-radio">
                                                                <input
                                                                    type="radio"
                                                                    id={`radio_${ele.id}_${optionIndex}`}
                                                                    name={`radio_${ele.id}`}
                                                                    className="custom-checkbox-input"
                                                                    checked={tab2[ele.id] === option}
                                                                    onChange={(e) => handleRadioChange(ele.id, option)}
                                                                />
                                                                <label htmlFor={`radio_${ele.id}_${optionIndex}`} className="custom-checkbox-label">
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : ele.type_of_parameter === "dropdown" ? (
                                            <div className="custom-dropdown">
                                                <select id={`dropdown_${ele.id}`} name={`dropdown_${ele.id}`} value={tab2[ele.id] || ""} onChange={(e) => handleTab2InputChange(ele.id, e.target.value)}>
                                                    {ele.type_values.map((option, optionIndex) => (
                                                        <option key={optionIndex} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : ele.type_of_parameter === "file" ? (
                                            <>
                                                <input type="file" id={`file-input_${ele.id}`} className="custom-file-input" onChange={updateFileInput(ele.id)} />
                                                <label htmlFor={`file-input_${ele.id}`} className="custom-file01-label" id={`file-label_${ele.id}`}>
                                                    Choose a file
                                                </label>
                                                {/* <p id={`selected-file-name_${ele.id}`}></p> */}
                                            </>
                                        ) : (
                                            // Handle other input types or provide a default component here
                                            <input type="text" id={`default_${ele.id}`} />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-sm-12">
                                <span style={{ display: "flex", justifyContent: "center" }}>Please select a category to view additional fields.</span>
                            </div>
                        )}
                    </div>
                    <div className="nextButton">
                        <button type="button" onClick={handleNextTab}>
                            {translate("next")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>


            <CustomTabPanel value={value} index={3}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        {getFacilities.length > 0
                            ? getFacilities.map((ele, index) => (
                                <div className="col-sm-12 col-md-6 col-lg-3" key={index}>
                                    <div className="add_prop_fields">
                                        <span>{ele.name}</span>
                                        <input value={tab3[ele.id] || ""} type="number" placeholder="00 KM" className="prop_number_input" id={`prop_title_input_${ele.id}`} onChange={(e) => handleTab3InputChange(ele.id, e.target.value)} />
                                    </div>
                                </div>
                            ))
                            : null}
                    </div>
                    <div className="nextButton">
                        <button type="button" onClick={handleNextTab}>
                            {translate("next")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>


            <CustomTabPanel value={value} index={4}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        <div className="col-sm-12 col-md-6">
                            <div className="row" id="add_prop_form_row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="add_prop_fields">
                                        <span>{translate("city")}</span>
                                        <input type="text" id="prop_title_input" placeholder="Enter City" name="city" value={selectedLocationAddress.city} onChange={handleTab4InputChange} />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="add_prop_fields">
                                        <span>{translate("state")}</span>
                                        <input type="text" id="prop_title_input" placeholder="Enter State" name="state" value={selectedLocationAddress.state} onChange={handleTab4InputChange} />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="add_prop_fields">
                                        <span>{translate("country")}</span>
                                        <input type="text" id="prop_title_input" placeholder="Enter Country" name="country" value={selectedLocationAddress.country} onChange={handleTab4InputChange} />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="add_prop_fields">
                                        <span>{translate("address")}</span>
                                        <textarea rows={4} id="about_prop" placeholder="Enter Full Address" name="formatted_address" value={selectedLocationAddress.formatted_address} onChange={handleTab4InputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="map">
                                <GoogleMapBox apiKey={GoogleMapApi} onSelectLocation={handleLocationSelect} />
                            </div>
                        </div>
                    </div>

                    <div className="nextButton">
                        <button type="button" onClick={handleNextTab4}>
                            {translate("next")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>


            <CustomTabPanel value={value} index={5}>
                <form>
                    <div className="row" id="add_prop_form_row">
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="add_prop_fields">
                                <span>{translate("titleImg")}</span>
                                <div className="dropbox">
                                    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                                        <input {...getInputProps()} />
                                        {uploadedImages.length === 0 ? (
                                            isDragActive ? (
                                                <span>{translate("dropFiles")}</span>
                                            ) : (
                                                <span>
                                                    {translate("dragFiles")} <span style={{ textDecoration: "underline" }}> {translate("browse")}</span>
                                                </span>
                                            )
                                        ) : null}
                                    </div>
                                    <div>{files}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="add_prop_fields">
                                <span>{translate("3dImg")}</span>
                                <div className="dropbox">
                                    <div {...getRootProps3D()} className={`dropzone ${isDragActive3D ? "active" : ""}`}>
                                        <input {...getInputProps3D()} />
                                        {uploaded3DImages.length === 0 ? (
                                            isDragActive3D ? (
                                                <span>{translate("drop3dFiles")}</span>
                                            ) : (
                                                <span>
                                                    {translate("drag3dFiles")} <span style={{ textDecoration: "underline" }}> {translate("browse")}</span>
                                                </span>
                                            )
                                        ) : null}
                                    </div>
                                    <div>{files3D}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="add_prop_fields">
                                <span>{translate("GallryImg")}</span>
                                <div className="dropbox">
                                    <div {...getRootPropsGallery()} className={`dropzone ${isDragActiveGallery ? "active" : ""}`}>
                                        <input {...getInputPropsGallery()} />

                                        {isDragActiveGallery ? (
                                            <span>{translate("dropgallaryFiles")}</span>
                                        ) : (
                                            <span>
                                                {translate("draggallaryFiles")} <span style={{ textDecoration: "underline" }}> {translate("browse")}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div>{galleryFiles}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <div className="add_prop_fields">
                                <span>{translate("videoLink")}</span>
                                <input type="input" id="prop_title_input" name="videoLink" placeholder="Enter Video Link" value={tab5.videoLink} onChange={handleVideoInputChange} />
                            </div>
                        </div>
                    </div>

                    <div className="updateButton">
                        <button type="submit" onClick={handlePostproperty}>
                            {translate("submitProp")}
                        </button>
                    </div>
                </form>
            </CustomTabPanel>

        </Box>
    );
}
