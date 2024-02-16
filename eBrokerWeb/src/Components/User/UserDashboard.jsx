"use client"
import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import { GetFeturedListingsApi } from "@/store/actions/campaign";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Menu, Dropdown, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPagination from "../../../src/Components/Pagination/ReactPagination.jsx";
import { deletePropertyApi } from "@/store/actions/campaign";
import Loader from "../../../src/Components/Loader/Loader.jsx";
import toast from "react-hot-toast";
import { FaCrown } from "react-icons/fa";
import { MdOutlineSell } from "react-icons/md";
import FeatureModal from "@/Components/FeatureModal/FeatureModal.jsx";
import ChangeStatusModal from "@/Components/ChangeStatusModal/ChangeStatusModal.jsx";
import { translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Swal from "sweetalert2";
import Image from "next/image";
import dynamic from "next/dynamic.js";

const VerticleLayout = dynamic(() => import('../AdminLayout/VerticleLayout.jsx'), { ssr: false })
const UserDashboard = () => {


    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [getFeaturedListing, setGetFeaturedListing] = useState([]);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
    const [propertyId, setPropertyId] = useState(null);
    const [propertyType, setPropertyType] = useState(null);
    const [changeStatus, setChangeStatus] = useState(false);
    const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false);
    const [changestatusModal, setChangestatusModal] = useState(false);

    const SettingsData = useSelector(settingsData);


    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    const handleClickEdit = (propertyId) => {
        router.push(`/user/edit-property/${propertyId}`);
    };
    const handleClickDelete = (propertyId) => {
        if (SettingsData.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
                text: "This Action is Not Allowed in Demo Mode",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-buttons',
                },
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            });
            return false;
        }
        setPropertyIdToDelete(propertyId);
        setIsLoading(true);
        deletePropertyApi(
            propertyId,
            (response) => {
                setIsLoading(true);
                toast.success(response.message);

                GetFeturedListingsApi({
                    offset: offsetdata.toString(),
                    limit: limit.toString(),
                    userid: isLoggedIn ? userCurrentId : "",
                    onSuccess: (response) => {
                        setTotal(response.total);
                        setView(response.total_clicks);
                        const FeaturedListingData = response.data;
                        setIsLoading(false);
                        setGetFeaturedListing(FeaturedListingData);
                    },
                    onError: (error) => {
                        setIsLoading(false);
                        console.log(error);
                    }
                }
                );
            },
            (error) => {
                setIsLoading(false);
                toast.error(error);
            }
        );
    };

    const handleFeatureClick = (propertyId) => {
        if (SettingsData.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
                text: "This Action is Not Allowed in Demo Mode",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-buttons',
                },
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            });
            return false;
        }
            (propertyId);
        setIsFeatureModalVisible(true);
    };
    const handleChangeStatusClick = (propertyId, propertyType) => {
        if (SettingsData.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
                text: "This Action is Not Allowed in Demo Mode",
                icon: "warning",
                showCancelButton: false,
                customClass: {
                    confirmButton: 'Swal-buttons',
                },
                cancelButtonColor: "#d33",
                confirmButtonText: "OK",
            });
            return false;
        }
        setPropertyId(propertyId);
        setPropertyType(propertyType);
        setChangestatusModal(true);
    };

    const limit = 8;

    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const userData = isLoggedIn && isLoggedIn?.data?.data?.name;

    useEffect(() => {
        setIsLoading(true);
        GetFeturedListingsApi({
            offset: offsetdata.toString(),
            limit: limit.toString(),
            userid: isLoggedIn ? userCurrentId : "",
            onSuccess: (response) => {
                setTotal(response.total);
                setView(response.total_clicks);
                const FeaturedListingData = response.data;
                setIsLoading(false);
                setGetFeaturedListing(FeaturedListingData);
            },
            onError: (error) => {
                setIsLoading(false);
                console.log(error);
            }
        }
        );
    }, [offsetdata, isLoggedIn, propertyIdToDelete, changeStatus]);

    useEffect(() => { }, [propertyId, propertyIdToDelete, propertyType, changeStatus]);
    useEffect(() => {
        setChangeStatus(false)
    }, [changeStatus]);

    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };
    return (
        <VerticleLayout>
            <div className="container">
                <div className="row" id="dashboard_top_card">
                    <div className="col-12">
                        <div className="row" id="dashboard_top_card">
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_card">
                                    <div id="dashboard_user">
                                        <div>
                                            <span className="dashboard_user_title">
                                                {translate("hy")} {""} {userData}
                                            </span>
                                            <p className="card-text">{translate("manageYourProfile")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_total_prop_card">
                                    <div className="totalprop">
                                        <span>{translate("totalProperty")}</span>
                                        {total > 0 ? <h4>{total}</h4> : <h4>0</h4>}
                                    </div>
                                    <div className="total_prop_icon">
                                        <span>
                                            <HomeIcon sx={{ fontSize: "35px" }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card" id="dashboard_total_prop_card">
                                    <div className="totalprop">
                                        <span>{translate("totalViews")}</span>
                                        {view > 0 ? <h4>{view}</h4> : <h4>0</h4>}
                                    </div>
                                    <div className="total_prop_icon">
                                        <span>
                                            <StarIcon sx={{ fontSize: "35px" }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="table_content card bg-white">
                            <TableContainer
                                component={Paper}
                                sx={{
                                    background: "#fff",
                                    padding: "10px",
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                    <TableHead
                                        sx={{
                                            background: "#f5f5f5",
                                        }}
                                    >
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "600" }}>{translate("listingTitle")}</TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("category")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("views")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("postedOn")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("status")}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                                {translate("action")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    {/* Centered loader */}
                                                    <div>
                                                        <Loader />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : getFeaturedListing && getFeaturedListing.length > 0 ? (
                                            getFeaturedListing.map((elem, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row" sx={{ width: "40%" }}>
                                                        <div className="card" id="listing_card">
                                                            <div className="listing_card_img">
                                                                <Image loading="lazy" src={elem.title_image} alt="no_img" id="main_listing_img" width={150} height={0} style={{ height: "auto" }} />
                                                                <span className="listing_type_tag">{elem.property_type}</span>
                                                            </div>
                                                            <div className="listing_card_body">
                                                                <span className="listing_prop_title">{elem.title}</span>
                                                                <span className="listing_prop_loc">
                                                                    {elem.city} {elem.state} {elem.country}
                                                                </span>
                                                                <span className="listing_prop_pirce">
                                                                    {CurrencySymbol} {elem.price}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">{elem.category.category}</TableCell>
                                                    <TableCell align="center">{elem.total_view}</TableCell>
                                                    <TableCell align="center">{elem.post_created}</TableCell>
                                                    <TableCell align="center">{elem.status === 1 ? <span className="active_status">{translate("active")}</span> : <span className="inactive_status">{translate("inactive")}</span>}</TableCell>
                                                    <TableCell align="center">
                                                        <Dropdown
                                                            visible={anchorEl === index}
                                                            onVisibleChange={(visible) => {
                                                                if (visible) {
                                                                    setAnchorEl(index);
                                                                } else {
                                                                    setAnchorEl(null);
                                                                }
                                                            }}
                                                            overlay={
                                                                <Menu>
                                                                    <Menu.Item key="edit" onClick={() => handleClickEdit(elem.slug_id)}>
                                                                        <Button type="text" icon={<EditOutlined />}>
                                                                            {translate("edit")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                    {elem.status === 1 && elem.promoted === false ? (
                                                                        <Menu.Item key="feature" onClick={() => handleFeatureClick(elem.id)}>
                                                                            <Button type="text" icon={<FaCrown />} >
                                                                                {translate("feature")}
                                                                            </Button>
                                                                        </Menu.Item>
                                                                    ) : null}

                                                                    {elem.status === 1 ? (
                                                                        <Menu.Item key="change_status" onClick={() => handleChangeStatusClick(elem.id, elem.property_type)}>
                                                                            <Button type="text" icon={<MdOutlineSell />}>
                                                                                {translate("change status")}
                                                                            </Button>
                                                                        </Menu.Item>
                                                                    ) : null}


                                                                    <Menu.Item key="delete" onClick={() => handleClickDelete(elem.id)}>
                                                                        <Button type="text" icon={<DeleteOutlined />} >
                                                                            {translate("delete")}
                                                                        </Button>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            }
                                                        >
                                                            <Button id="simple-menu">
                                                                <BsThreeDotsVertical />
                                                            </Button>
                                                        </Dropdown>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    <p>{translate("noDataAvailabe")}</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <FeatureModal show={isFeatureModalVisible} onHide={() => setIsFeatureModalVisible(false)} propertyId={propertyId} />

                            <ChangeStatusModal show={changestatusModal} onHide={() => setChangestatusModal(false)} propertyId={propertyId} propertyType={propertyType} setChangeStatus={setChangeStatus} />

                            {getFeaturedListing && getFeaturedListing.length > 0 ? (
                                <div className="col-12">
                                    <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </VerticleLayout>

    )
}

export default UserDashboard
