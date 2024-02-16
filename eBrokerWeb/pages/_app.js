import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "../src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Fragment } from "react";

import "../public/css/style.css";
import "../public/css/responsive.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-loading-skeleton/dist/skeleton.css";



import { Toaster } from "react-hot-toast";
import PushNotificationLayout from "@/Components/firebaseNotification/PushNotificationLayout";
import InspectElement from '@/Components/InspectElement/InspectElement'

function MyApp({ Component, pageProps, data }) {

    return (
        <Fragment>
           
            <link rel="shortcut icon" href="/favicon.ico" sizes="32x32" type="image/png" />
            <Provider store={store}>
                {/* <PersistGate persistor={persistor}> */}
                <InspectElement>
                    <PushNotificationLayout>
                        <Component {...pageProps} data={data} />
                    </PushNotificationLayout>
                </InspectElement>
                <Toaster />
                {/* </PersistGate> */}
            </Provider>
        </Fragment>
    );
}

export default MyApp;
