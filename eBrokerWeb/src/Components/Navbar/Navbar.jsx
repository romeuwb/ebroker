"use client"
import React, { useState, useEffect } from "react";
import ebroker from "@/assets/Logo_Color.png";
import { RiUserSmileLine } from "react-icons/ri";
import { CloseButton, Dropdown } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import LoginModal from "../LoginModal/LoginModal";
import AreaConverter from "../AreaConverter/AreaConverter";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { logoutSuccess, userSignUpData } from "@/store/reducer/authSlice";

import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-hot-toast";
import { settingsData } from "@/store/reducer/settingsSlice";
import { languageLoaded, setLanguage } from "@/store/reducer/languageSlice";
import { translate } from "@/utils";
import { store } from "@/store/store";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Image from "next/image";
import { silderCacheData } from "@/store/reducer/momentSlice";
import FirebaseData from "@/utils/Firebase";




const Nav = () => {
    const router = useRouter();
    const language = store.getState().Language.languages;
    const { signOut } = FirebaseData();

    const isHomePage = router.pathname === '/';
    const user_register = router.pathname === '/user-register';
    const signupData = useSelector(userSignUpData);
    const sliderdata = useSelector(silderCacheData);
    const settingData = useSelector(settingsData);
    
    // useEffect(() => {
    //     if (settingData?.system_color && settingData?.category_background && settingData?.sell_background) {
    //         document.documentElement.style.setProperty('--primary-color', settingData?.system_color);
    //         document.documentElement.style.setProperty('--primary-category-background', settingData?.category_background);
    //         document.documentElement.style.setProperty('--primary-sell', settingData?.sell_background);
    //     } else {
    //         document.documentElement.style.setProperty('--primary-color', "#087c7c");
    //         document.documentElement.style.setProperty('--primary-category-background', "#087c7c14");
    //         document.documentElement.style.setProperty('--primary-sell', "#e8aa42");
    //     }


    // }, [settingData?.svg_clr])

    const isSubscription = settingData?.subscription;
    const LanguageList = settingData && settingData.languages;
    const systemDefaultLanguageCode = settingData?.default_language;
    const [showModal, setShowModal] = useState(false);
    const [areaconverterModal, setAreaConverterModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [defaultlang, setDefaultlang] = useState(language.name);
    const [show, setShow] = useState(false);
    const [headerTop, setHeaderTop] = useState(0);
    const [scroll, setScroll] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        if (language && language.rtl === 1) {
            document.documentElement.dir = "rtl";

        } else {
            document.documentElement.dir = "ltr";

        }
    }, [language]);
    useEffect(() => {
        if (signupData?.data?.data.name === "" && signupData?.data?.data.email === "" && !user_register) {
            Swal.fire({
                title: 'Complete Profile First',
                icon: 'info',
                customClass: {
                    confirmButton: 'Swal-buttons',
                },
                confirmButtonText: 'OK',
                backdrop: 'static',
            }).then((result) => {
                if (result.isConfirmed) {
                    // If the user clicks "OK," navigate to "/user-register"
                    router.push('/user-register');
                }
            });
        }
    }, []);



    useEffect(() => {
        const header = document.querySelector(".header");
        setHeaderTop(header.offsetTop);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {

        if (!language || Object.keys(language).length === 0) {

            languageLoaded(
                systemDefaultLanguageCode,
                "1",
                (response) => {
                    const currentLang = response && response.data.name;

                    // Dispatch the setLanguage action to update the selected language in Redux
                    store.dispatch(setLanguage(currentLang));
                    setSelectedLanguage(currentLang);
                    setDefaultlang(currentLang);
                },
                (error) => {
                    console.log(error);
                }
            );
        }

    }, []);
    const handleLanguageChange = (languageCode) => {
        languageLoaded(
            languageCode,
            "1",
            (response) => {
                const currentLang = response && response.data.name;
                setSelectedLanguage(currentLang);

                // Dispatch the setLanguage action to update the selected language in Redux
                store.dispatch(setLanguage(currentLang));
            },
            (error) => {
                console.log(error);
            }
        );
    };
    useEffect(() => {

    }, [selectedLanguage, language, defaultlang])

    const handleScroll = () => {
        setScroll(window.scrollY);
    };

    const handleOpenModal = () => {
        setShow(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleOpenAcModal = () => {
        setShow(false);
        setAreaConverterModal(true);
    };
    const handleCloseAcModal = () => {
        setAreaConverterModal(false);
    };

    const handleShowDashboard = () => {
        if (isSubscription === true) {
            // Corrected the condition
            router.push("/user/dashboard"); // Use an absolute path here
        } else {
            router.push("/user/profile"); // Redirect to the subscription page
        }
    };
    const handleAddProperty = () => {
        if (isSubscription === true) {
            // Corrected the condition
            router.push("/user/properties"); // Use an absolute path here
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You have not subscribed. Please subscribe first",
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

                // footer: '<a href="">Why do I have this issue?</a>'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/subscription-plan"); // Redirect to the subscription page
                }
            });
        }
    };
    const handleLogout = () => {
        handleClose();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: "Yes! Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                // Clear the recaptchaVerifier by setting it to null
                window.recaptchaVerifier = null;
                // Perform the logout action
                logoutSuccess();
                signOut()
                
                toast.success(translate("logoutSuccess"));
            } else {
                toast.error(translate("logoutcancel"));
            }
        });
    };

    const CheckActiveUserAccount = () => {
        if (settingData?.is_active === false) {
            Swal.fire({
                title: "Opps!",
                text: "Your Account have been Deactivetd by Admin please connect them \.",
                icon: "warning",
                allowOutsideClick: false,
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "Logout",
            }).then((result) => {
                if (result.isConfirmed) {
                    logoutSuccess();
                    signOut()
                    router.push("/contact-us");
                }
            });
        }
    }
    useEffect(() => {
        CheckActiveUserAccount()
    }, [settingData?.is_active])

    return (
        <>
            <header>
                <nav className={`navbar header navbar-expand-lg navbar-light ${scroll > headerTop || (isHomePage && (!sliderdata || sliderdata.length === 0)) ? "is-sticky" : ""}`}>
                    <div className="container">
                        <div className="left-side">
                            <Link className="navbar-brand" href="/">
                                <Image loading="lazy" src={settingData?.web_logo ? settingData?.web_logo : ebroker} alt="no_img" className="logo" width={0} height={76} style={{ width: "auto" }} />
                            </Link>
                            <span onClick={handleShow} id="hamburg">
                                <GiHamburgerMenu size={36} />
                            </span>
                        </div>

                        <div className="center-side">
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" href="/">
                                            {translate("home")}
                                        </Link>
                                    </li>
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">{translate("properties")}</Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                <Link href="/properties/all-properties/">{translate("allProperties")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <Link href="/featured-properties">{translate("featuredProp")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                {" "}
                                                <Link href="/most-viewed-properties">{translate("mostViewedProp")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                {" "}
                                                <Link href="/properties-nearby-city">{translate("nearbyCities")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <Link href="/most-favorite-properties">{translate("mostFavProp")}</Link>
                                            </Dropdown.Item>
                                            {/* <Dropdown.Item><Link href="/listby-agents"></Link>{translate("listByAgents")}</Dropdown.Item> */}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">{translate("pages")}</Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                <Link href="/subscription-plan">{translate("subscriptionPlan")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                {" "}
                                                <Link href="/articles">{translate("articles")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={handleOpenAcModal}>{translate("areaConverter")}</Dropdown.Item>
                                            <Dropdown.Item>
                                                <Link href="/terms-and-condition">{translate("terms&condition")}</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                {" "}
                                                <Link href="/privacy-policy">{translate("privacyPolicy")}</Link>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Link href="/contact-us" id="a-tags-link">
                                        <li className="nav-item nav-link">{translate("contactUs")}</li>
                                    </Link>

                                    <Link className="nav-link" href="/about-us">
                                        <li className="nav-item">
                                            {translate("aboutUs")}
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="right-side">
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ml-auto">
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic">  {selectedLanguage ? selectedLanguage : defaultlang}</Dropdown.Toggle>
                                        <Dropdown.Menu id="language">
                                            {LanguageList &&
                                                LanguageList.map((ele, index) => (
                                                    <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                                        {ele.name}
                                                    </Dropdown.Item>
                                                ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <li className="nav-item">
                                        {
                                            // Check if signupData.data is null
                                            signupData?.data === null ? (
                                                <a className="nav-link" to="/" onClick={handleOpenModal}>
                                                    <RiUserSmileLine size={20} className="icon" />
                                                    {translate("login&Regiser")}
                                                </a>
                                            ) : // Check if mobile and firebase_id are present
                                                signupData?.data?.data.mobile && signupData?.data?.data.firebase_id && signupData?.data?.data.name === "" ? (
                                                    <>

                                                        <span className="nav-link">{translate("welcmGuest")}</span>

                                                    </>
                                                ) :
                                                    signupData?.data?.data.name ? (
                                                        <Dropdown>
                                                            <Dropdown.Toggle id="dropdown-basic01">
                                                                <RiUserSmileLine size={20} className="icon01" />

                                                                {signupData.data.data.name}
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu id="language">
                                                                <Dropdown.Item onClick={handleShowDashboard}>{translate("dashboard")}</Dropdown.Item>
                                                                <Dropdown.Item onClick={handleLogout}>{translate("logout")}</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    ) : null
                                        }
                                    </li>
                                    {signupData?.data?.data.name && settingData && (
                                        <li className="nav-item">
                                            <button className="btn" id="addbutton" onClick={handleAddProperty}>
                                                <FiPlusCircle size={20} className="mx-2 add-nav-button" />
                                                {translate("addProp")}
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div>
                <Offcanvas
                    show={show}
                    onHide={handleClose}
                    placement="end"
                    scroll={false}
                    backdrop={true}
                    style={{
                        width: "90%",
                    }}
                >
                    <Offcanvas.Header>
                        <Offcanvas.Title>
                            <span className="title-name">{settingData?.company_name}</span>
                        </Offcanvas.Title>
                        <Offcanvas.Title>
                            <CloseButton onClick={handleClose} />
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="mobile_nav">
                            <ul className="navbar-nav" id="mobile-ul">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" href="/" onClick={handleClose}>
                                        {translate("home")}
                                    </Link>
                                </li>
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">{translate("properties")}</Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <Link href="/properties/all-properties/" onClick={handleClose}>
                                                {translate("allProperties")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link href="/featured-properties" onClick={handleClose}>
                                                {translate("featuredProp")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            {" "}
                                            <Link href="/most-viewed-properties" onClick={handleClose}>
                                                {translate("mostViewedProp")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            {" "}
                                            <Link href="/properties-nearby-city" onClick={handleClose}>
                                                {translate("nearbyCities")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link href="/most-favorite-properties" onClick={handleClose}>
                                                {translate("mostFavProp")}
                                            </Link>
                                        </Dropdown.Item>
                                        {/* <Dropdown.Item><Link href="/listby-agents" onClick={handleClose}></Link>{translate("listByAgents")}</Dropdown.Item> */}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">{translate("pages")}</Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <Link href="/subscription-plan" onClick={handleClose}>
                                                {translate("subscriptionPlan")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            {" "}
                                            <Link href="/articles" onClick={handleClose}>
                                                {translate("articles")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleOpenAcModal}>{translate("areaConverter")}</Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link href="/terms-and-condition" onClick={handleClose}>
                                                {translate("terms&condition")}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            {" "}
                                            <Link href="/privacy-policy" onClick={handleClose}>
                                                {translate("privacyPolicy")}
                                            </Link>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/contact-us" onClick={handleClose}>
                                        {translate("contactUs")}
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" href="/about-us" onClick={handleClose}>
                                        {translate("aboutUs")}
                                    </Link>
                                </li>

                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">  {selectedLanguage ? selectedLanguage : defaultlang}</Dropdown.Toggle>

                                    <Dropdown.Menu id="language">
                                        {LanguageList &&
                                            LanguageList.map((ele, index) => (
                                                <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                                    {ele.name}
                                                </Dropdown.Item>
                                            ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <li className="nav-item">
                                    {
                                        // Check if signupData.data is null
                                        signupData?.data === null ? (
                                            <a className="nav-link" to="/" onClick={handleOpenModal}>
                                                <RiUserSmileLine size={20} className="icon" />
                                                {translate("login&Regiser")}
                                            </a>
                                        ) : // Check if mobile and firebase_id are present
                                            signupData?.data?.data.mobile && signupData?.data?.data.firebase_id && signupData?.data?.data.name === "" ? (
                                                <span className="nav-link">{translate("welcmGuest")}</span>
                                            ) : // If name is present, show "Welcome, {name}"
                                                signupData?.data?.data.name ? (
                                                    <Dropdown>
                                                        <Dropdown.Toggle id="dropdown-basic01">
                                                            <RiUserSmileLine size={20} className="icon01" />
                                                            {/* <Avatar size={16} src={signupData.data.data.profile}/> */}
                                                            {signupData.data.data.name}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu id="language">
                                                            <Dropdown.Item onClick={handleShowDashboard}>{translate("dashboard")}</Dropdown.Item>
                                                            <Dropdown.Item onClick={handleLogout}>{translate("logout")}</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                ) : null // Handle any other cases or conditions here
                                    }
                                </li>
                                {signupData?.data?.data.name && settingData && (
                                    <li className="nav-item">
                                        <button className="btn" id="addbutton-mobile" onClick={handleAddProperty}>
                                            <FiPlusCircle size={20} className="mx-2 add-nav-button" />
                                            {translate("addProp")}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <LoginModal isOpen={showModal} onClose={handleCloseModal} />

            <AreaConverter isOpen={areaconverterModal} onClose={handleCloseAcModal} />
        </>
    );
};

export default Nav;
