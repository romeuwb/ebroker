"use client"
import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AdminHeader from "./AdminHeader.jsx";
import AdminFooter from "./AdminFooter.jsx";
import ebroker from "@/assets/Logo_Color.png";
import Link from "next/link";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { translate } from "@/utils/index.js";
import { logoutSuccess } from "@/store/reducer/authSlice.js";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/router.js";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { RiAdvertisementLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { languageData } from "@/store/reducer/languageSlice.js";
import { deleteUserApi } from "@/store/actions/campaign.js"
import { store } from "@/store/store.js";
import Image from "next/image";
import { settingsData, settingsLoaded } from "@/store/reducer/settingsSlice.js";
import { getAuth, deleteUser } from 'firebase/auth';
import { isSubscribeRoutes } from "@/routes/routes.jsx";
import { usePathname } from 'next/navigation'
import { isSupported } from "firebase/messaging";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#282F39",
    height: "12vh",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));
export default function VerticleLayout(props) {
    const { children } = props;

    const [isMessagingSupported, setIsMessagingSupported] = useState(false);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const settingData = useSelector(settingsData);
    useEffect(() => {
        settingsLoaded(
            null,
            isLoggedIn ? userCurrentId : "",
            (res) => {
                document.documentElement.style.setProperty('--primary-color', res?.data?.system_color);
                document.documentElement.style.setProperty('--primary-category-background',res?.data?.category_background);
                document.documentElement.style.setProperty('--primary-sell',res?.data?.sell_background);
            },
            (err) => {
                console.log(err);
            }
        );
    }, [isLoggedIn, settingData?.svg_clr]);

    useEffect(() => {
        const checkMessagingSupport = async () => {
            try {
                const supported = await isSupported();
                setIsMessagingSupported(supported);

                if (supported) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationPermissionGranted(true);
                    }
                }
            } catch (error) {
                console.error('Error checking messaging support:', error);
            }
        };

        checkMessagingSupport();
    }, [notificationPermissionGranted, isMessagingSupported]);
    const [open, setOpen] = React.useState(false);
    const lang = useSelector(languageData);
    const router = useRouter();
    const pathname = usePathname();

    
    const hasSubscription = settingData?.subscription





    const CheckActiveUserAccount = () => {
        if (settingData?.is_active === false) {
            Swal.fire({
                title: "Opps!",
                text: "Your Account have been Deactivetd by Admin please connect them.",
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
                }
            });
        }
    }
    useEffect(() => {
        CheckActiveUserAccount()
    }, [settingData?.is_active])

    const currentRoute = router.pathname;

    const isRouteActive = (route) => {
        return currentRoute === route;
    };
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
    const language = store.getState().Language.languages;
    const current_user = store.getState().User_signup?.data?.data?.id



    useEffect(() => { }, [lang]);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                logoutSuccess();
                toast.success(translate("logoutSuccess"));
                router.push("/");
            } else {
                toast.error(translate("logoutcancel"));
            }
        });
    };






    const handleDeleteAcc = () => {

        if (settingsData.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
                text: "This Action is Not Allowed in Demo Mode",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "OK",
            });
            return false;
        }


        // Initialize Firebase Authentication
        const auth = getAuth();

        // Get the currently signed-in user
        const user = auth.currentUser;

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                // Delete the user
                deleteUser(user)
                    .then(() => {
                        deleteUserApi(
                            current_user,
                            (res) => {
                                logoutSuccess();
                                toast.success("User deleted successfully.")
                                router.push("/");

                            }, (err) => {
                                console.log(err)
                            },)
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error.message);
                        console.log(error)
                        if (error.code === "auth/requires-recent-login") {
                            toast.error(translate("deletePop"));
                            logoutSuccess();
                            router.push("/");
                        }
                    });
            } else {
                toast.error(translate("logoutcancel"));
            }
        });
    };

    const handleChat = () => {
        if (settingData && settingData.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
                text: "This Action is Not Allowed in Demo Mode",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                    cancelButton: "Swal-cancel-buttons"
                },
                confirmButtonText: "OK",
            });
            return; // Stop further execution
        }

        // If not in demo mode, navigate to the chat page
        router.push('/user/chat');
    };


    // ... (existing code)

    // Check if the current route requires a subscription
    const requiresSubscription = isSubscribeRoutes.includes(pathname);

    useEffect(() => {
        subscriptionCheck();
    }, [requiresSubscription]);

    const subscriptionCheck = () => {


        if (requiresSubscription && !hasSubscription) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You have not subscribed. Please subscribe first",
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/subscription-plan"); // Redirect to the subscription page

                }
            });
        }
    }



    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: "#fff",
                    height: "10vh",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "10vh",
                    }}
                >
                    <IconButton
                        color="inherit"
                        className="open_drawer"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link href="/">
                        <Image loading="lazy" src={settingData?.app_home_screen ? settingData?.app_home_screen : ebroker.src} alt="no_img" className="dashboard_mobile_logo" width={30} height={30} />
                    </Link>
                    <div className="container">
                        <AdminHeader />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader
                    sx={{
                        height: "10vh",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Link href="/">
                            <Image loading="lazy" src={settingData?.web_logo ? settingData.web_logo : ebroker} alt="no_img" className="dashboard_logo" width={200} height={200} />
                        </Link>
                        <IconButton
                            onClick={handleDrawerClose}
                            className="drawer_button"
                            sx={{
                                fontSize: "30",
                            }}
                        >
                            {language.rtl === 1 ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                        </IconButton>
                    </Box>
                </DrawerHeader>
                <Divider />
                <List className="drawer_list">
                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/dashboard') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                        <Link href="/user/dashboard">
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/dashboard') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}

                                >
                                    <DashboardOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("myDashboard")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/advertisement') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                        <Link href="/user/advertisement">
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/advertisement') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <RiAdvertisementLine size={23} />
                                </ListItemIcon>
                                <ListItemText primary={translate("myAdvertisement")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <Link href="/user/properties">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/properties') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/properties') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <AddHomeOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("properties")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/user/favorites-properties">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/favorites-properties') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/favorites-properties') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <FavoriteBorderOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("fav")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    {/* <Link href="/user/chat"> */}

                    {isMessagingSupported && notificationPermissionGranted && (

                        <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            className={isRouteActive('/user/chat') ? 'drawer_list_item_active' : 'drawer_list_item'}
                        >
                            <ListItemButton
                                onClick={handleChat}
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/chat') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SmsOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("messages")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    )}

                    <Link href="/user/profile">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/profile') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/profile') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TagFacesOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("myProfile")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/user/notifications">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/notifications') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/notifications') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <NotificationsNoneIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("notification")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/user/subscription">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/subscription') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/subscription') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PaidOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("mySub")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/user/transaction-history">
                        <ListItem disablePadding sx={{ display: "block" }} className={isRouteActive('/user/transaction-history') ? 'drawer_list_item_active' : 'drawer_list_item'}>
                            <ListItemButton
                                sx={{
                                    minHeight: 30,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    className={isRouteActive('/user/transaction-history') ? 'drawer_list_icon_active' : 'drawer_list_icon'}
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary={translate("transactionHistory")} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <ListItem disablePadding sx={{ display: "block" }} className='drawer_list_item'>
                        <ListItemButton
                            onClick={handleDeleteAcc}
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className='drawer_list_icon'
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <DeleteOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("deleteUser")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }} className='drawer_list_item'>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                minHeight: 30,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                className="drawer_list_icon"
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={translate("logout")} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden", marginBottom: "100px" }}>
                <DrawerHeader
                    sx={{
                        background: "#f5f5f5",
                    }}
                />

                {children}
            </Box>

            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: "#fff",
                    top: "auto",
                    bottom: "0",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <AdminFooter />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
