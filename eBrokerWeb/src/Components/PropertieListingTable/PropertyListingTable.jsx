"use client"
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Menu, Dropdown, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPagination from "../Pagination/ReactPagination";
import { deletePropertyApi } from "@/store/actions/campaign";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import { translate } from "@/utils";
import Image from "next/image";

export default function PropertyListingTable({ data, handlePageChange, total, limit, isLoading, setIsLoading }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const priceSymbol = useSelector(settingsData);
    const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;
    const router = useRouter();

    const handleClickEdit = (propertyId) => {
        router.push(`/user/edit-property?id=${propertyId}`);
    };
    const handleClickDelete = (propertyId) => {
        setIsLoading(true);

        deletePropertyApi(
            propertyId,
            (response) => {
                setIsLoading(false);
                toast.success(response.message);
            },
            (error) => {
                setIsLoading(true);
                toast.error(error.message);
            }
        );
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead
                        sx={{
                            background: "#f5f5f5",
                        }}
                    >
                        <TableRow>
                            <TableCell sx={{ fontWeight: "600" }}>Listing title</TableCell>
                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                Category
                            </TableCell>
                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                Views
                            </TableCell>
                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                Posted On
                            </TableCell>
                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: "600" }} align="center">
                                Action
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
                        ) : data.length > 0 ? (
                            data.map((elem, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" sx={{ width: "40%" }}>
                                  
                                        <div className="card" id="listing_card">
                                            <div className="listing_card_img">
                                                <Image loading="lazy" width={0} height={0} style={{ width: "150px", height: "auto" }} src={elem.title_image} alt="no_img" id="main_listing_img" />
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
                                    <TableCell align="center">{elem.status === 1 ? <span className="active_status">Active</span> : <span className="inactive_status">Inactive</span>}</TableCell>
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
                                                    <Menu.Item key="edit" onClick={() => handleClickEdit(elem.id)}>
                                                        <Button type="text" icon={<EditOutlined />}>
                                                            Edit
                                                        </Button>
                                                    </Menu.Item>
                                                    <Menu.Item key="delete">
                                                        <Button type="text" icon={<DeleteOutlined />} onClick={() => handleClickDelete(elem.id)}>
                                                            Delete
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

            {data.length > 0 ? (
                <div className="col-12">
                    <ReactPagination pageCount={Math.ceil(total / limit)} onPageChange={handlePageChange} />
                </div>
            ) : null}
        </>
    );
}
