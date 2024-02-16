import React, { useEffect, useState } from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaAngleDoubleRight } from "react-icons/fa";
import { translate } from "@/utils";
import { changePropertyStatusApi } from '@/store/actions/campaign';
import toast from 'react-hot-toast';

const ChangeStatusModal = ({ show, onHide, propertyId, propertyType, setChangeStatus }) => {

    const [changeStatusType, setChangeStatusType] = useState()
    useEffect(() => {
        if (propertyType === "sell") {
            setChangeStatusType(2)
        } else if (propertyType === "rent") {
            setChangeStatusType(3)
        } else if (propertyType === "Rented") {
            setChangeStatusType(1)
        }
    }, [propertyType])

    const handleChangeStatus = (e) => {
        e.preventDefault()
        changePropertyStatusApi({
            property_id: propertyId,
            status: changeStatusType,
            onSuccess: (res) => {
                setChangeStatus(true)
                onHide()
                toast.success(res.message)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }
    useEffect(() => {
    }, [changeStatusType])

    return (
        <>
            <Modal show={show} onHide={onHide} centered className="change-status-modal" backdrop="static">
                <Modal.Header>
                    <Modal.Title>{translate("changePropStatus")}</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onHide} />
                </Modal.Header>
                <Modal.Body>
                    <div className="changePropSection">
                        {propertyType === "sell" ? (
                            <>
                                <span className='convert1'>
                                    {translate("sell")}
                                </span>
                                <span className='convert_arrow'>
                                    <FaAngleDoubleRight size={25} />
                                </span>
                                <span className='convert2'>
                                    {translate("sold")}
                                </span>
                            </>
                        ) : propertyType === "rent" ? (
                            <>
                                <span className='convert1'>
                                    {translate("rent")}
                                </span>
                                <span className='convert_arrow'>
                                    <FaAngleDoubleRight size={25} />
                                </span>
                                <span className='convert2'>
                                    {translate("rented")}
                                </span>
                            </>
                        ) : propertyType === "Rented" ? (
                            <>
                                <span className='convert1'>
                                    {translate("rented")}
                                </span>
                                <span className='convert_arrow'>
                                    <FaAngleDoubleRight size={25} />
                                </span>
                                <span className='convert2'>
                                    {translate("rent")}
                                </span>
                            </>
                        ) : null}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="" id="change_cancel_button" onClick={onHide}>
                        {translate("cancel")}
                    </Button>
                    <Button variant="" id="change_button" onClick={handleChangeStatus}>
                        {translate("change")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ChangeStatusModal
