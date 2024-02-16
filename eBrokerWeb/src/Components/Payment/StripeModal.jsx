import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { userSignUpData } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import { confirmPaymentApi } from "@/store/actions/campaign";
import { settingsData } from "@/store/reducer/settingsSlice";

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            // iconColor: "#c4f0ff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" },
            border: "2px solid black",
        },
        invalid: {
            // iconColor: "#ffc7ee",
            color: "#ffc7ee",
        },
    },
};

const StripeModal = (props) => {
    const navigate = useRouter();

    const user = useSelector(userSignUpData);
    const systemsettings = useSelector(settingsData);

    const [loadingPay, setloadingPay] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { stripe, elements, orderID } = props;

        setloadingPay(true);
        if (!stripe || !elements || !orderID) {
            setloadingPay(false);
            return;
        }

        const { paymentIntent, error } = await stripe?.confirmCardPayment(props?.client_key?.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user?.data?.data?.name,
                    address: {
                        line1: props?.stripeForm?.address,
                        postal_code: props?.stripeForm?.postalcode,
                        city: props?.stripeForm?.city,
                        state: props?.stripeForm?.state,
                        country: props?.stripeForm?.country,
                    },
                },
            },
        });

        if (error) {
            console.log(error)
            toast.error(error.message);
            setloadingPay(false)
            props?.setPaymentModal(false)
            props?.resetFormAndCardNumber();


        } else if (paymentIntent.status === "succeeded") {
            confirmPaymentApi(
                props?.client_key?.id,
                (res) => {
                    toast.success(res.message);
                    navigate.push("/");
                    setloadingPay(false);
                    props?.setPaymentModal(false)
                    props?.resetFormAndCardNumber();
                },
                (err) => {
                    toast.error(err.message);
                    console.log(err)
                }
            );
        } else {
            setloadingPay(false);
            toast.error("Payment failed");
        }
    };

    return (
        <>
            <div className="modal-body">
                <div className="stripe-container d-flex flex-column p-0">
                    <div className="d-flex flex-row justify-content-between header">
                        <span className="heading">Stripe: {systemsettings?.company_name} Payment</span>
                        {/* <button type="button" className="close-stripe" data-bs-dismiss="modal" aria-label="Close" ref={closeModal}><AiOutlineCloseCircle /></button> */}
                    </div>
                    <form onSubmit={handleSubmit} id="stripe-form" className="mt-5 border-3">
                        <CardElement options={CARD_OPTIONS} />

                        {loadingPay ? (
                            <Loader screen="full" background="none" />
                        ) : (
                            <button whileTap={{ scale: 0.8 }} type="submit" disabled={!props.stripe} className="pay-stripe">
                                Pay
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default function InjectCheckout(props) {
    return (
        <ElementsConsumer orderID={props.orderID} currency={props.currency} user_id={props.user_id} amount={props.amount} client_key={props.client_key}>
        {({ stripe, elements }) => (
            <StripeModal
                stripeForm={props.stripeForm}
                stripe={stripe}
                elements={elements}
                orderID={props.orderID}
                currency={props.currency}
                user_id={props.user_id}
                amount={props.amount}
                client_key={props.client_key}
                setPaymentModal={props.setPaymentModal}
                resetFormAndCardNumber={() => props.resetFormAndCardNumber(elements)}  
            />
        )}
    </ElementsConsumer>
    );
}
