import { Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreIcon from "@mui/icons-material/MoreVert";
import { store } from "@/store/store";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { FiPlusCircle } from "react-icons/fi";
import { userSignUpData } from "@/store/reducer/authSlice";
import { languageLoaded, setLanguage } from "@/store/reducer/languageSlice";
import { translate } from "@/utils";
import Link from "next/link";

const AdminHeader = () => {
    const language = store.getState().Language.languages;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const settingData = useSelector(settingsData);
    const signupData = useSelector(userSignUpData);
    const LanguageList = settingData && settingData.languages;
    const systemDefaultLanguageCode = settingData?.default_language;

    const [selectedLanguage, setSelectedLanguage] = useState(language.name);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  
    useEffect(() => {
        if (language && language.rtl === 1) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [language]);





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

       
    }, [selectedLanguage])


    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const menuId = "primary-search-account-menu";
    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <GTranslateIcon />
                </IconButton>
                <Dropdown id="dropdown">
                    <Dropdown.Toggle id="dropdown-basic-dashboard">{selectedLanguage}</Dropdown.Toggle>
                    <Dropdown.Menu id="language">
                        {LanguageList &&
                            LanguageList.map((ele, index) => (
                                <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                    {ele.name}
                                </Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>
            </MenuItem>

            <MenuItem>
                <Link href="/user/properties" style={{textDecoration: "none", color: "#000"}}>
                    <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <span style={{ color: "#000" }}>{translate("addProp")}</span>
                </Link>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, color: "#000" }} />
                    <Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" }, alignItems: "center" }}>
                        <Dropdown id="dropdown">
                            <Dropdown.Toggle id="dropdown-basic-dashboard">{selectedLanguage}</Dropdown.Toggle>
                            <Dropdown.Menu id="language">
                                {LanguageList &&
                                    LanguageList.map((ele, index) => (
                                        <Dropdown.Item key={index} onClick={() => handleLanguageChange(ele.code)}>
                                            {ele.name}
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Box>
                            <Link href="/user/properties">
                                <button className="btn" id="dashboard_add">
                                    <FiPlusCircle size={20} className="mx-2 add-nav-button" />
                                    {translate("addProp")}
                                </button>
                            </Link>
                        </Box>
                    </Box>
                    <Box sx={{ display: { md: "flex", lg: "none" } }}>
                        <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="#000">
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>

                {renderMobileMenu}
            </Box>
        </>
    );
};

export default AdminHeader;
