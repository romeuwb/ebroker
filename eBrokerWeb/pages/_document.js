import React from "react";
// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";
const CustomDocument = () => {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
            </Head>

            <body>
                <Main />
                <NextScript />
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
            </body>
        </Html>
    );
};
export default CustomDocument;
