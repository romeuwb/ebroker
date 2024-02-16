"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import { Button, Form, Input, Select } from "antd";
import { BiSolidCheckCircle } from "react-icons/bi";
import { languageData } from "@/store/reducer/languageSlice";
import { useSelector } from "react-redux";
import { isLogin, loadStripeApiKey, translate } from "@/utils";
import { store } from "@/store/store";
import { assignFreePackageApi, createPaymentIntentApi, getPackagesApi, getPaymentSettingsApi } from "@/store/actions/campaign";
import PackageCard from "@/Components/Skeleton/PackageCard";
import { settingsData } from "@/store/reducer/settingsSlice";
import { Modal } from "antd";
import InjectCheckout from "@/Components/Payment/StripeModal";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import countryLookup from "country-code-lookup";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Swal from "sweetalert2";
import NoData from "@/Components/NoDataFound/NoData";
import { useRouter } from "next/router";
import Layout from '../Layout/Layout';
import { userSignUpData } from '@/store/reducer/authSlice';


const stripeLoadKey = loadStripeApiKey()
const stripePromise = loadStripe(stripeLoadKey);

const { Option } = Select;

const SubscriptionPlan = () => {
    const router = useRouter();
    const [packagedata, setPackageData] = useState([]);
    const userData = useSelector(userSignUpData);
    const user = userData?.data?.data
    const [loading, setLoading] = useState(false);

    const [paymentSettingsdata, setPaymentSettingsData] = useState([]);

    const [clientKey, setclientKey] = useState("");

    const [priceData, setPriceData] = useState("");

    const [stripeForm, setStripeForm] = useState({
        description: "",
        name: user?.name ? user?.name : "",
        address: user?.address ? user?.address : "",
        postalcode: "",
        city: user?.city ? user?.city : "",
        state: user?.state ? user?.state : "",
        country: "",
        amount: "",
        currency: "",
        payemnttypes: "",
        packageid: "",
    });

    const [stripeformModal, setStripeFormModal] = useState(false);

    const [previusSubsscriptionModal, setPreviusSubsscriptionModal] = useState(false);

    const [paymentModal, setPaymentModal] = useState(false);

    const language = store.getState().Language.languages;

    const systemsettings = useSelector(settingsData);


    const lang = useSelector(languageData);
    // useSelector(languageData)
    useEffect(() => {

    }, [lang]);

    const handleCountryCodeChange = (value) => {
        setStripeForm({ ...stripeForm, country: value });
    };
    const closeStripeModal = async () => {
        console.error("Payment canceled by the user.");

        // Close all modals
        setStripeFormModal(false);
        setPaymentModal(false);
        // setLoading(false);

        // Additional logic for handling payment cancellation
        // You can show a toast message or perform any other actions as needed
        toast.error("Payment canceled. Please try again later.");
    };


    // country codes
    const countryCodes = countryLookup.countries.map((elem) => ({
        value: elem.iso2,
        label: `${elem.iso2} (${elem.country})`,
    }));

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        },
    };
    const isUserLogin = isLogin();

    // get packages api
    useEffect(() => {
        setLoading(true);
        getPackagesApi(
            (res) => {
                setLoading(false);
                setPackageData(res.data);
            },
            (err) => {
                setLoading(false);
                console.log(err);
            }
        );
    }, [isUserLogin]);

    // payment settings api
    useEffect(() => {
        if (isLogin()) {
            getPaymentSettingsApi(
                (res) => {
                    setPaymentSettingsData(res.data);
                },
                (err) => {
                    toast.error(err.message);
                }
            );
        }
    }, []);
    // subscribe payment
    const subscribePayment = (e, data) => {
        e.preventDefault();
        if (systemsettings.demo_mode) {
            Swal.fire({
                title: "Opps !",
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

        if (!isUserLogin) {
            toast.error("Please Login first");
            return false;
        }
        // here condition based on if before subscription is active
        if (isUserLogin) {
            setPreviusSubsscriptionModal(true);
        }


        setPriceData(data);
        // paymentModalChecker(e);
    };

    // paymentModalChecker
    const paymentModalChecker = (e) => {
        e.preventDefault();
        if (priceData.price !== 0) {
            setStripeFormModal(true);
        } else {
            assignFreePackageApi(
                priceData.id,
                (res) => {

                    router.push("/");
                    toast.success(res.message);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    };

    const filterDataByType = (typeToFilter) => {
        const filteredData = paymentSettingsdata.find((item) => item.type === typeToFilter);
        return filteredData ? filteredData.data : null;
    };

    // stripe submit
    const onStripeFormSubmit = async () => {
        // Update the form values
        setStripeForm({
            ...stripeForm,
            description: priceData.name,
            packageid: priceData.id,
            amount: priceData.price,
            currency: systemsettings?.currency_symbol,
            payemnttypes: "card",
        });

        try {
            // Display success toast
            // toast.success("Successfully Added");

            // create payment api
            createPaymentIntentApi(
                priceData.name,
                stripeForm.name,
                stripeForm.address,
                stripeForm.postalcode,
                stripeForm.city,
                stripeForm.state,
                stripeForm.country,
                priceData.price,
                systemsettings?.currency_symbol,
                "card",
                priceData.id,
                (res) => {
                    setclientKey(res?.data);
                    // on confirm close modal
                    setStripeFormModal(false);
                    setPaymentModal(true);
                },
                (err) => {
                    console.log(err);
                    // Set loading state to false in case of error
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("An error occurred during payment submission:", error);
            // Set loading state to false in case of an exception
            setLoading(false);
        }
    };


    // error
    const onFinishFailed = (errorInfo) => {
        toast.error(JSON.stringify(errorInfo));
        setLoading(false);

    };

    // Example usage of the filter function
    const stripe_currency = systemsettings?.currency_symbol;

    // Packages with is_active === 1 come first
    const sortedPackageData = packagedata.sort((a, b) => {
        return b.is_active - a.is_active;
    });
    const handlePaymentFailure = async (error) => {
        // Close all modals
        setStripeFormModal(false);
        setPaymentModal(false);
    };
    const resetFormAndCardNumber = (elements) => {
        setStripeForm({
            description: "",
            name: "",
            address: "",
            postalcode: "",
            city: "",
            state: "",
            country: "",
            amount: "",
            currency: "",
            payemnttypes: "",
            packageid: "",
        });
        
        // Clear the card number
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
            cardElement.clear();
        }
    };
    
    return (
        <Layout>
            <Breadcrumb title={translate("subscriptionPlan")} />

            <section id="subscription" className="mb-5">
                <div className="container">
                    <div>
                        <span className="headline">
                            {translate("chooseA")}{" "}
                            <span>
                                <span className="highlight"> {translate("plan")}</span>
                            </span>{" "}
                            {translate("thatsRightForYou")}
                        </span>
                    </div>

                    <div className="subsCards-Wrapper pt-3">
                        {/* this is for packages buy */}
                        <Swiper
                            dir={language.rtl === "1" ? "rtl" : "ltr"}
                            slidesPerView={4}
                            // loop={true}
                            spaceBetween={30}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[FreeMode, Pagination]}
                            className="subscription-swiper"
                            breakpoints={breakpoints}
                        >
                            {loading ? (
                                <>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Swiper
                                            dir={language.rtl === "1" ? "rtl" : "ltr"}
                                            slidesPerView={4}
                                            // loop={true}
                                            spaceBetween={30}
                                            freeMode={true}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[FreeMode, Pagination]}
                                            className="subscription-swiper"
                                            breakpoints={breakpoints}
                                        >
                                            <SwiperSlide key={index}>

                                                <div className="col-lg-3 col-md-6 col-12 main_box" key={index}>
                                                    <PackageCard />
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {sortedPackageData.length > 0 ? (
                                        sortedPackageData.map((elem, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="card text-white" id={`${elem.is_active ? "current_package_card" : "other_package_card"}`}>
                                                    <div id="package_headlines">
                                                        <span className="other_card_title">{elem.name}</span>
                                                        <h1 className="card_text">
                                                            {
                                                                elem.price !== 0
                                                                    ? systemsettings?.currency_symbol + elem.price
                                                                    : "Free"
                                                            }

                                                        </h1>
                                                    </div>

                                                    <div className="subs_other_content">
                                                        <div className="limits">
                                                            {elem.advertisement_limit !== "not_available" ? (
                                                                <span className="limits_content">
                                                                    <span>
                                                                        <BiSolidCheckCircle size={20} />{" "}
                                                                    </span>
                                                                    <span> {translate("Advertisement limit is :")} {elem.advertisement_limit === "unlimited" ? "Unlimited" : elem.advertisement_limit} </span>
                                                                </span>
                                                            ) : null}
                                                            {elem.property_limit !== "not_available"
                                                                ? (
                                                                    <span className="limits_content">
                                                                        <span>
                                                                            <BiSolidCheckCircle size={20} />{" "}
                                                                        </span>
                                                                        <span> {translate("Property limit is :")} {elem.property_limit === "unlimited" ? "Unlimited" : elem.property_limit}</span>
                                                                    </span>
                                                                ) :
                                                                null
                                                            }
                                                            <span className="limits_content">
                                                                <span>
                                                                    <BiSolidCheckCircle size={20} />{" "}
                                                                </span>
                                                                <span> {translate("Validity")} {elem.duration} {translate("days")}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {elem.is_active ? (
                                                        <div className="spacer"></div>
                                                    ) : (
                                                        <div className="card-footer">
                                                            <div className="subscribe_button">
                                                                <button type="submit" onClick={(e) => subscribePayment(e, elem)}>
                                                                    {translate("Subscribe")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <>
                                            <div className="noDataFoundDiv">
                                                <NoData />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* warning modal */}
            <Modal
                title="Warning"
                centered
                open={previusSubsscriptionModal}
                onOk={(e) => {
                    setPreviusSubsscriptionModal(false);
                    paymentModalChecker(e);
                }}
                onCancel={() => setPreviusSubsscriptionModal(false)}
                className="warning_modal"
            >
                <p>
                    {translate("You have an existing subscription.")}
                    <br />
                   {translate("Subscribing to this package will cancel your prevoius subscription, are you sure you want to proceed.")}
                </p>
            </Modal>

            {/* stripe element */}
            <Modal centered open={paymentModal} footer={null} onCancel={closeStripeModal}>
                <Elements stripe={stripePromise} client_key={clientKey} currency={stripe_currency} orderID={priceData.id} amount={priceData.price}>
                    <InjectCheckout
                        stripeForm={stripeForm}
                        orderID={priceData.id}
                        currency={stripe_currency}
                        client_key={clientKey}
                        amount={priceData.price}
                        onFailure={handlePaymentFailure}
                        setPaymentModal={setPaymentModal}
                        resetFormAndCardNumber={resetFormAndCardNumber}
                    />
                </Elements>
            </Modal>

            {/* stripe form address */}
            <Modal className="stripemodal" onCancel={() => setStripeFormModal(false)} centered open={stripeformModal} footer={null}>
                <Form
                    name="basic"
                    initialValues={stripeForm}
                    onFinish={onStripeFormSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="stripeform pt-5"
                >
                    <Form.Item
                        label={translate("Name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your name!")
                            },
                        ]}
                    >
                        <Input onChange={(e) => setStripeForm({ ...stripeForm, name: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                        label={translate("Address")}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your address!"),
                            },
                        ]}
                    >
                        <Input onChange={(e) => setStripeForm({ ...stripeForm, address: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                        label={translate("Postal Code")}
                        name="postalcode"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your postal code!"),
                            },
                        ]}
                    >
                        <Input
                            type="text"
                            pattern="[0-9]{6}"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                                setStripeForm({ ...stripeForm, statePostalCode: e.target.value });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={translate("City")}
                        name="city"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your city"),
                            },
                            {
                                pattern: /^[A-Za-z\s]+$/,
                                message: "Please enter only letters for the city",
                            },
                        ]}
                    >
                        <Input onChange={(e) => setStripeForm({ ...stripeForm, city: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                        label={translate("State")}
                        name="state"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your state"),
                            },
                            {
                                pattern: /^[A-Za-z\s]+$/,
                                message: "Please enter only letters for the state",
                            },
                        ]}
                    >
                        <Input onChange={(e) => setStripeForm({ ...stripeForm, state: e.target.value })} />
                    </Form.Item>

                    <Form.Item
                        label={translate("Country")}
                        name="country"
                        rules={[
                            {
                                required: true,
                                message: translate("Please enter your country"),
                            },
                        ]}
                    >
                        {countryCodes.length > 0 ? (
                            <Select
                                showSearch // Enable search functionality
                                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0} // Define the filter logic
                                onChange={handleCountryCodeChange}
                                placeholder="Select a country code"
                                value={stripeForm.country}
                                className="w-100"
                            >
                                {countryCodes.map((country) => (
                                    <Option key={country.value} value={country.value} label={country.label}>
                                        {country.label}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <p>{translate("Loading country codes...")}</p>
                        )}
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button className="w-100 stripebtn" type="primary" htmlType="submit">
                            {translate("submit")}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout >
    )
}

export default SubscriptionPlan
