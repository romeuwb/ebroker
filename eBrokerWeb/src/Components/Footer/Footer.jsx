import React from "react";
import eBroker from "@/assets/Logo_Color.png";
import { FiMail, FiPhone } from "react-icons/fi";
import { AiFillTwitterCircle, AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { CiFacebook } from "react-icons/ci";
import { ImPinterest2 } from "react-icons/im";
import playstore from "../../assets/playStore.png";
import appstore from "../../assets/appStore.png";
import Link from "next/link";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";
import { translate } from "@/utils";

import Image from "next/image";

const Footer = () => {
    const systemData = useSelector(settingsData);
    const webdata = systemData && systemData;
    const currentYear = new Date().getFullYear();
    return (
        <section id="footer">
            <div className="container">
                <div className="row py-5" id="footer_deatils">
                    <div className="col-12 col-md-6 col-lg-3">
                        <div id="footer_logo_section">
                            <Link href="/">
                                <Image
                                    loading="lazy"
                                    src={webdata?.web_footer_logo ? webdata.web_footer_logo : eBroker}
                                    alt="eBroker_logo"
                                    width={0}
                                    height={0}
                                    className="footer_logo"
                                />
                            </Link>
                            <div className="footer_contact_us">
                                <div>
                                    <FiMail size={25} />
                                </div>
                                <div className="footer_contactus_deatils">
                                    <span className="footer_span">{translate("email")}</span>
                                    <a href={`mailto:${webdata && webdata.company_email}`}>
                                        <span className="footer_span_value">{webdata && webdata.company_email}</span>
                                    </a>
                                </div>
                            </div>
                            <div className="footer_contact_us">
                                <div>
                                    <FiPhone size={25} />
                                </div>
                                <div className="footer_contactus_deatils">
                                    <span className="footer_span">{translate("contactOne")}</span>
                                    <a href={`tel:${webdata && webdata.company_tel1}`}>
                                        <span className="footer_span_value">{webdata && webdata.company_tel1}</span>
                                    </a>
                                </div>
                            </div>
                            <div className="footer_contact_us">
                                <div>
                                    <FiPhone size={25} />
                                </div>
                                <div className="footer_contactus_deatils">
                                    <span className="footer_span">{translate("contactTwo")}</span>
                                    <a href={`tel:${webdata && webdata.company_tel2}`}>
                                        <span className="footer_span_value">{webdata && webdata.company_tel2}</span>
                                    </a>
                                </div>
                            </div>
                            {webdata?.facebook_id || webdata?.instagram_id || webdata?.pintrest_id || webdata?.twitter_id ? (
                                <div>
                                    <h4> {translate("followUs")}</h4>
                                    <div id="follow_us">
                                        {webdata?.facebook_id ? (
                                            <a href={webdata?.facebook_id} target="_blank">
                                                <CiFacebook size={28} />
                                            </a>
                                        ) : null}
                                        {webdata?.instagram_id ? (
                                            <a href={webdata?.instagram_id} target="_blank">
                                                <AiOutlineInstagram size={28} />
                                            </a>
                                        ) : null}
                                        {webdata?.pintrest_id ? (
                                            <a href={webdata?.pintrest_id}>
                                                <ImPinterest2 size={25} />
                                            </a>
                                        ) : null}
                                        {webdata?.twitter_id ? (
                                            <a href={webdata?.twitter_id} target="_blank">
                                                <AiFillTwitterCircle size={28} />
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (null)}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div id="footer_prop_section">
                            <div id="footer_headlines">
                                <span>{translate("properties")}</span>
                            </div>
                            <div className="prop_links">
                                <Link href="/properties/all-properties">{translate("allProperties")}</Link>
                            </div>
                            <div className="prop_links">
                                <Link href="/featured-properties">{translate("featuredProp")}</Link>
                            </div>

                            <div className="prop_links">
                                <Link href="/most-viewed-properties">{translate("mostViewedProp")}</Link>
                            </div>

                            <div className="prop_links">
                                <Link href="/properties-nearby-city">{translate("nearbyCities")}</Link>
                            </div>

                            <div className="prop_links">
                                <Link href="/most-favorite-properties">{translate("mostFavProp")}</Link>
                            </div>

                            {/* <div className='prop_links'>
                                <Link href="/listby-agents">
                                    List by Agents Properties
                                </Link>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div id="footer_page_section">
                            <div id="footer_headlines">
                                <span>{translate("pages")}</span>
                            </div>
                            <div className="page_links">
                                <Link href="/subscription-plan">{translate("subscriptionPlan")}</Link>
                            </div>
                            <div className="page_links">
                                <Link href="/articles">{translate("articles")}</Link>
                            </div>
                            <div className="page_links">
                                <Link href="/terms-and-condition">{translate("terms&condition")}</Link>
                            </div>

                            <div className="page_links">
                                <Link href="/privacy-policy">{translate("privacyPolicy")}</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div id="footer_download_section">
                            <div id="footer_headlines">
                                <span>{translate("downloadApps")}</span>
                            </div>
                            <div className="download_app_desc">
                                <span>{translate("Getthelatest")} {webdata?.company_name} {translate("Selectyourdevice")}</span>
                            </div>

                            <div className="download_app_platforms">
                                {webdata?.playstore_id ? (
                                    <div id="playstore_logo">
                                        <a href={webdata?.playstore_id} target="_blank">
                                            <Image loading="lazy" src={playstore.src} alt="no_img" className="platforms_imgs" width={0} height={0} style={{ width: "100%", height: "100%" }} />
                                        </a>
                                    </div>
                                ) : null}
                                {webdata?.appstore_id ? (
                                    <div id="appstore_logo">
                                        <a href={webdata?.appstore_id} target="_blank">
                                            <Image loading="lazy" src={appstore.src} alt="no_img" className="platforms_imgs" width={0} height={0} style={{ width: "100%", height: "100%" }} />
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rights_footer">
                <hr />
                <h6>{translate("Copyright")} {currentYear} {webdata?.company_name} {translate("All Rights Reserved")}</h6>
            </div>
        </section>
    );
};

export default Footer;
