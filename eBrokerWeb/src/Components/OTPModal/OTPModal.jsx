import React, { useState, useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
//firebase
import FirebaseData from "../../utils/Firebase";
import { toast } from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { signupLoaded } from "../../store/reducer/authSlice"; // Update the import path as needed
import { useRouter } from "next/router";
import { translate } from "@/utils";
import { Fcmtoken, settingsData, settingsLoadedLogin } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const OTPModal = ({ isOpen, onClose, phonenum }) => {
    const SettingsData = useSelector(settingsData);
    const isDemo = SettingsData?.demo_mode;


    const { authentication, messaging } = FirebaseData();
    const [otp, setOTP] = useState("");
    const inputRefs = useRef([]);
    const [showTimer, setShowTimer] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [showLoader, setShowLoader] = useState(true);
    const [otpSent, setOTPSent] = useState(true); // Add a state to track OTP sent status
    const navigate = useRouter();
    let fcmtoken = localStorage.getItem("token")

    const otpInputRef = useRef(null);
    const generateRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(authentication, "recaptcha-container", {
                size: "invisible",
            });
        }
    };
    useEffect(() => {
        generateRecaptcha();
        setShowLoader(true);

        return () => {
            // Clear the recaptcha container
            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = "";
            }

            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, []);

    const generateOTP = (phonenum) => {
        //OTP Generation

        let appVerifier = window.recaptchaVerifier;

        const formatPh = phonenum;

        signInWithPhoneNumber(authentication, formatPh, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                toast.success(translate("otpSentsuccess"));
                // Set OTP based on demo mode after confirmation and OTP sent toast
                if (isDemo && phonenum === "+919764318246") {
                    setOTP("000000");
                    setShowLoader(false);
                } else {
                    setShowLoader(false); // Remove this line if you want to continue with the loader until the user enters the OTP
                }
                setOTPSent(true); // Set OTP sent status to true
                setShowLoader(false);
            })
            .catch((error) => {
                console.log(error);
                let errorMessage = "";
                switch (error.code) {
                    case "auth/too-many-requests":
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case "auth/invalid-phone-number":
                        errorMessage = "Invalid phone number. Please enter a valid phone number.";
                        break;
                    case "auth/invalid-verification-code":
                        errorMessage = "Invalid OTP number. Please enter a valid OTP number.";
                        break;
                    default:
                        errorMessage = "An error occurred. Please try again.";
                        break;
                }
                // display error message in a toast or alert
                toast.error(errorMessage);
                setShowLoader(false);
            });
    };
    useEffect(() => {
        if (phonenum !== null) {
            generateOTP(phonenum);
            // Show loader when OTP generation starts
        }
    }, [phonenum]);

    const FcmToken = useSelector(Fcmtoken)
    const handleConfirm = (e) => {
        e.preventDefault();

        if (otp === "") {
            toast.error("Please enter OTP first.");
            return;
        }

        setShowLoader(true);
        let confirmationResult = window.confirmationResult;
        confirmationResult
            .confirm(otp)
            .then(async (result) => {
                // User verified successfully.

                signupLoaded(
                    "",
                    "",
                    result.user.phoneNumber.replace("+", ""),
                    "1",
                    "",
                    result.user.uid,
                    "",
                    "",
                    FcmToken,
                    (res) => {
                        let signupData = res.data;

                        // Show a success toast notification
                        setShowLoader(false);

                        // Check if any of the required fields is empty
                        if (!res.error) {
                            if (
                                signupData.name === "" ||
                                signupData.email === "" ||
                                // signupData.address === "" ||
                                signupData.logintype === ""
                            ) {
                                navigate.push("/user-register");
                                onClose(); // Close the modal
                            } else {
                                toast.success(res.message); // Show a success toast
                                onClose(); // Close the modal

                            }
                            settingsLoadedLogin(
                                null,
                                signupData?.id,
                                (res) => { },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }
                    },
                    (err) => {
                        console.log(err);
                        if (err === 'Account Deactivated by Administrative please connect to them') {
                            onClose(); // Close the modal
                            Swal.fire({
                                title: "Opps!",
                                text: "Account Deactivated by Administrative please connect to them",
                                icon: "warning",
                                showCancelButton: false,
                                customClass: {
                                    confirmButton: 'Swal-confirm-buttons',
                                    cancelButton: "Swal-cancel-buttons"
                                },
                                confirmButtonText: "Ok",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate.push("/contact-us");
                                }
                            });

                        }
                    }
                );
            })
            .catch((error) => {
                // Show an error toast notification
                console.log(error);
                let errorMessage = "";
                switch (error.code) {
                    case "auth/too-many-requests":
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case "auth/invalid-phone-number":
                        errorMessage = "Invalid phone number. Please enter a valid phone number.";
                        break;
                    case "auth/invalid-verification-code":
                        errorMessage = "Invalid OTP number. Please enter a valid OTP number.";
                        break;
                    default:
                        errorMessage = "An error occurred. Please try again.";
                        break;
                }
                // display error message in a toast or alert
                toast.error(errorMessage);
                setShowLoader(false);
            });
    };

    const handleChange = (event, index) => {
        const value = event.target.value;
        if (!isNaN(value) && value !== "") {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index] = value;
                return newOTP.join("");
            });

            // Move focus to the next input
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && index > 0) {
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[index - 1] = "";
                return newOTP.join("");
            });

            // Move focus to the previous input
            inputRefs.current[index - 1].focus();
        } else if (event.key === "Backspace" && index === 0) {
            // Clear the first input if backspace is pressed on the first input
            setOTP((prevOTP) => {
                const newOTP = [...prevOTP];
                newOTP[0] = "";
                return newOTP.join("");
            });
        }
    };

    useEffect(() => {
        let intervalId;

        if (resendTimer > 0) {
            intervalId = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [resendTimer]);
    const handleResendOTP = () => {
        // Reset the resendTimer to 60 seconds
        setResendTimer(60);
        generateOTP(phonenum);
        toast.success("OTP Resend Successfully");
    };
    useEffect(() => {
        if (!isOpen && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [isOpen]);
    return (
        <>
            <Modal show={isOpen} onHide={onClose} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="otp-modal" backdrop="static">
                <Modal.Header>
                    <Modal.Title>{translate("verification")}</Modal.Title>
                    <RiCloseCircleLine className="close-icon" size={40} onClick={onClose} />
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="modal-body-heading">
                            <h4>{translate("otpVerification")}</h4>
                            <span>
                                {translate("enterOtp")} {phonenum}
                            </span>
                        </div>
                        <div className="userInput">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <input
                                    key={index}
                                    className="otp-field"
                                    type="text"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(inputRef) => (inputRefs.current[index] = inputRef)}
                                />
                            ))}
                        </div>

                        <div className="resend-code">
                            {resendTimer > 0 ? (
                                <div>
                                    <span className="resend-text"> {translate("resendCodeIn")}</span>
                                    <span className="resend-time">
                                        {" "}
                                        {resendTimer} {translate("seconds")}
                                    </span>
                                </div>
                            ) : (
                                <span id="re-text" onClick={handleResendOTP}>
                                    {translate("resendOtp")}
                                </span>
                            )}
                        </div>
                        <div className="continue">
                            <button type="submit" className="continue-button" onClick={handleConfirm}>
                                {showLoader ? (
                                    <div className="loader-container-otp">
                                        <div className="loader-otp"></div>
                                    </div>
                                ) : (
                                    <span>{translate("confirm")}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <div id="recaptcha-container"></div>
        </>
    );
};

export default OTPModal;
