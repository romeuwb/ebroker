import React, { useState, useCallback, useMemo, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { RiCloseCircleLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { GetReportReasonsApi, addReportApi, featurePropertyApi } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { translate } from "@/utils";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

const ReportPropertyModal = ({ show, onHide, propertyId, setIsReported }) => {

    const [isLoading, setIsloading] = useState(true)
    const [getListReasons, setGetListReasons] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [reportReason, setReportReason] = useState("")

    useEffect(() => {
        GetReportReasonsApi(
            (res) => {
                setGetListReasons(res.data)
                setIsloading(false)
            },
            (error) => {
                console.log(error)
                setIsloading(true)


            }
        )
    }, [])



    const handleOptionChange = (option) => {
        if (option === "other") {
            setSelectedOption(0);
        } else {
            setSelectedOption(option);

        }
    };


    useEffect(() => {
    }, [reportReason])



    const handleReportProperty = (e) => {
        e.preventDefault()
        if(selectedOption){

            addReportApi({
                reason_id: selectedOption,
                property_id: propertyId,
                other_message: reportReason,
            onSuccess: (res) => {
                toast.success(res.message)
                setIsReported(true)
                onHide()
            },
            onError: (err) => {
                console.log(err)
                toast.error(err.message)
            }
        })
    }else{
        toast.error("please select reason first.")
    }
    }



    return (
        <Modal show={show} onHide={onHide} centered className="feature-modal" backdrop="static">
            <Modal.Header>
                <Modal.Title>{translate("reportProp")}</Modal.Title>
                <RiCloseCircleLine className="close-icon" size={40} onClick={onHide} />
            </Modal.Header>
            <Modal.Body>
                <div className="feature_div">
                    <span className="feature_form_titles">{translate("reasons")}</span>
                    <div className="row">
                        {isLoading ? (
                            <div className="col-sm-12">
                                <Skeleton count={6} height={"30px"} />
                            </div>
                        ) : (
                            <>
                                {getListReasons &&
                                    getListReasons.map((data, index) => (
                                        <div className="col-sm-12" key={index}>
                                            <div
                                                className={selectedOption === data.id ? "selectedOptionStyles" : "optionStyles"}
                                                onClick={() => handleOptionChange(data.id)}
                                            >
                                                {data.reason}
                                            </div>
                                        </div>
                                    ))}
                                <div className="col-sm-12">
                                    <div
                                        className={selectedOption === 0 ? "selectedOptionStyles" : "optionStyles"}
                                        onClick={() => handleOptionChange("other")}
                                    >
                                        {translate("other")}
                                    </div>
                                </div>

                                {selectedOption === 0 ? (
                                    <div className="col-sm-12">
                                        <div className="other_reason">
                                            <span className="feature_form_titles">{translate("writereason")}</span>
                                            <input
                                                type="text"
                                                className="report_input"
                                                placeholder="Write your reason here"
                                                value={reportReason}
                                                onChange={(e) => setReportReason(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className="report_footer_buttons">
                    {isLoading ? (
                        <>
                            <div className="col-sm-6">
                                <Skeleton height={"50px"} />
                            </div>
                            <div className="col-sm-6">
                                <Skeleton height={"50px"} />
                            </div>
                        </>
                    ) : (
                        <>
                            <Button variant="" id="cancel_button" onClick={onHide}>
                                {translate("cancel")}
                            </Button>
                            <Button variant="" id="report_button" onClick={handleReportProperty}>
                                {translate("report")}
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportPropertyModal;
