"use client"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getNotificationListApi } from "@/store/actions/campaign";
import toast from "react-hot-toast";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import { translate } from "@/utils/index.js";
import { languageData } from "@/store/reducer/languageSlice.js";
import Pagination from "@/Components/Pagination/ReactPagination";
import Image from "next/image";
import Loader from "@/Components/Loader/Loader";
import dynamic from "next/dynamic.js";
const VerticleLayout = dynamic(() => import('../../../src/Components/AdminLayout/VerticleLayout.jsx'), { ssr: false })

const UserNotification = () => {
    const [Data, setData] = useState([]);

    const [total, setTotal] = useState(0);
    const [offsetdata, setOffsetdata] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const limit = 10;

    const systemsettings = useSelector(settingsData);
    const PlaceHolderImg = systemsettings?.web_placeholder_logo;

    const lang = useSelector(languageData);

    useEffect(() => { }, [lang]);

    const isLoggedIn = useSelector((state) => state.User_signup);
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    // api call
    useEffect(() => {
        setIsLoading(true)
        getNotificationListApi(
            userCurrentId,
            offsetdata.toString(),
            limit.toString(),
            (res) => {
                setTotal(res.total);
                setData(res.data);
                setIsLoading(false)
               
            },
            (err) => {
                toast.error(err);
            }
        );
    }, [offsetdata]);
    // handle page change
    const handlePageChange = (selectedPage) => {
        const newOffset = selectedPage.selected * limit;
        setOffsetdata(newOffset);
        window.scrollTo(0, 0);
    };
    // format date
    function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    // slice the array to get the current posts

    return (
        <VerticleLayout>
            <div className="container">
                <div className="tranction_title">
                    <h1>{translate("notification")}</h1>
                </div>
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
                                    background: "#f5f5f4",
                                    borderRadius: "12px",
                                }}
                            >
                                <TableRow
                                    sx={{
                                        // padding:"20px",
                                        background: "#f5f5f5",
                                    }}
                                >

                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("nF")}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "600" }} align="center">
                                        {translate("date")}
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
                                ) : Data.length > 0 ? (
                                    Data.map((elem, index) => (
                                        <TableRow key={index}>

                                            <TableCell align="center">
                                                <div className="card" id="notication_card">
                                                    <div className="notification_card_img">
                                                        <Image
                                                            loading="lazy"
                                                            src={elem.image ? elem.image : PlaceHolderImg}
                                                            alt="no_img"
                                                            id="main_listing_img"
                                                            width={150}
                                                            height={0}
                                                            style={{ height: "auto" }} />
                                                        {/* <span className="listing_type_tag">{elem.property_type}</span> */}
                                                    </div>
                                                    <div className="notification_card_body">
                                                        <span className="notification_title">{elem.title}</span>
                                                        <span className="notification_desc">{elem.message}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">{formatDate(elem.created_at)}</TableCell>
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

                        {Data?.length > 0 ? (
                            <div id="feature_cards" className="row">
                                <div className="col-12">
                                    <Pagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                                </div>
                            </div>
                        ) : null}
                    </TableContainer>
                </div>
            </div>
        </VerticleLayout>
    );
};

export default UserNotification;


