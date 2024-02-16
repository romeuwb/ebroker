import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OTPModal from "../OTPModal/OTPModal";
import { toast } from "react-hot-toast";
import { translate } from "@/utils";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";

const LoginModal = ({ isOpen, onClose }) => {
    const SettingsData = useSelector(settingsData);
    const isDemo = SettingsData?.demo_mode;
    const DemoNumber = "+919764318246"
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [phonenum, setPhonenum] = useState();
    const [value, setValue] = useState(isDemo ? DemoNumber : "");

    const onSignUp = (e) => {
        e.preventDefault();
        if (!value) {
            toast.error("Please enter a phone number!");
        } else {
            const phoneRegex = /^\+[1-9]\d{1,14}$/; // Regular expression to match valid phone numbers with country code

            if (phoneRegex.test(value)) {
                // Phone number is valid, proceed to OTP modal
                setPhonenum(value);
                onClose();
                setShowOtpModal(true);
                if (isDemo) {
                    setValue(DemoNumber)
                } else {
                    setValue("");
                }
            } else {
                toast.error("Please enter a valid phone number");
            }
        }
    };

    const handlOTPModalClose = () => {
        setShowOtpModal(false);
        window.recaptchaVerifier = null;
    };
   
    return (
        <>
            <Modal show={isOpen} onHide={onClose} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="login-modal">
                <Modal.Header>
                    <Modal.Title>{translate("login&Regiser")}</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onClose} />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="modal-body-heading">
                            <h4>{translate("enterMobile")}</h4>
                            <span>{translate("sendCode")}</span>
                        </div>
                        <div className="mobile-number">
                            <label htmlFor="phone">{translate("phoneNumber")}</label>
                            <PhoneInput defaultCountry={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY} disabledCountryCode="true" value={value} onChange={setValue} className="custom-phone-input" />
                        </div>
                        <div className="continue">
                            <button type="submit" className="continue-button" onClick={onSignUp}>
                                {translate("continue")}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <span>
                        {translate("byclick")} <a href="/terms-and-condition">{translate("terms&condition")}</a> <span className="mx-1"> {translate("and")} </span> <a href="/privacy-policy"> {translate("privacyPolicy")} </a>
                    </span>
                </Modal.Footer>
            </Modal>

            {showOtpModal && <OTPModal isOpen={true} onClose={handlOTPModalClose} phonenum={phonenum} setPhonenum={setPhonenum} />}
        </>
    );
};

export default LoginModal;
