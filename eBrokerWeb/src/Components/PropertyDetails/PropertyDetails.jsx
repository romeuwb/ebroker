"use client"
import React, { useEffect, useState } from "react";
import { RiThumbUpFill } from "react-icons/ri";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FiMail, FiMessageSquare, FiPhoneCall, FiThumbsUp } from "react-icons/fi";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Image from "next/image";
import { PiPlayCircleThin } from "react-icons/pi";
import ReactPlayer from "react-player";
import SimilerPropertySlider from "@/Components/SimilerPropertySlider/SimilerPropertySlider";
import { settingsData } from "@/store/reducer/settingsSlice";
import { useSelector } from "react-redux";
import Map from "@/Components/GoogleMap/GoogleMap";
import ReactShare from "@/Components/ShareUrl/ReactShare";
import { languageData } from "@/store/reducer/languageSlice";
import { isThemeEnabled, loadGoogleMaps, translate } from "@/utils";
import { useRouter } from "next/router";
import { GetFeturedListingsApi, intrestedPropertyApi, setPropertyTotalClicksApi } from "@/store/actions/campaign";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import LightBox from "@/Components/LightBox/LightBox";
import Loader from "@/Components/Loader/Loader";
import toast from "react-hot-toast";
import { isSupported } from "firebase/messaging";
import { ImageToSvg } from "@/Components/Cards/ImageToSvg";
import Swal from "sweetalert2";
import { MdReport } from "react-icons/md";
import ReportPropertyModal from "@/Components/ReportPropertyModal/ReportPropertyModal";
import { getChatData } from "@/store/reducer/momentSlice";


const PropertyDetails = () => {
    const router = useRouter();
    const propId = router.query;
    const currentUrl = process.env.NEXT_PUBLIC_WEB_URL + router.asPath;
    const { isLoaded } = loadGoogleMaps();
    const [isMessagingSupported, setIsMessagingSupported] = useState(false);
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const [isReporteModal, setIsReporteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [getPropData, setPropData] = useState();
    const [interested, setInterested] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [chatData, setChatData] = useState({
        property_id: "",
        title: "",
        title_image: "",
        user_id: "",
        name: "",
        profile: "",
    });
    const [viewerIsOpen, setViewerIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [play, setPlay] = useState(false);
    const [imageURL, setImageURL] = useState("");


    const lang = useSelector(languageData);
    const isLoggedIn = useSelector((state) => state.User_signup);
    const DummyImgData = useSelector(settingsData);
    const CompanyName = DummyImgData && DummyImgData.company_name
    const themeEnabled = isThemeEnabled();

    useEffect(() => { }, [lang]);
    useEffect(() => {
        const checkMessagingSupport = async () => {
            try {
                const supported = await isSupported();
                setIsMessagingSupported(supported);

                if (supported) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        setNotificationPermissionGranted(true);
                    }
                }
            } catch (error) {
                console.error('Error checking messaging support:', error);
            }
        };

        checkMessagingSupport();
    }, [notificationPermissionGranted, isMessagingSupported]);
    useEffect(() => {
        setIsLoading(true);
        if (propId.slug && propId.slug != "") {
            GetFeturedListingsApi({
                current_user: isLoggedIn ? userCurrentId : "",
                slug_id: propId.slug,
                onSuccess: (response) => {
                    const propertyData = response && response.data;
                    setIsLoading(false);
                    setPropData(propertyData[0]);
                    if (propertyData[0]?.is_reported) {
                        setIsReported(true)
                    }
                },
                onError: (error) => {
                    setIsLoading(false);
                    console.log(error);
                }
            }
            );
        }
    }, [isLoggedIn, propId, interested, isReported]);



    useEffect(() => {
        if (getPropData && getPropData.threeD_image) {
            setImageURL(getPropData.threeD_image);
        }
    }, [getPropData]);


    useEffect(() => {
        if (imageURL) {
            const panoramaElement = document.getElementById("panorama");

            if (panoramaElement) {
                pannellum?.viewer("panorama", {
                    type: "equirectangular",
                    panorama: imageURL,
                    autoLoad: true,
                });
            }
        }
    }, [imageURL]);


    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;

    const PlaceHolderImg = DummyImgData?.web_placeholder_logo;
    const videoLink = getPropData && getPropData.video_link;
    const videoId = videoLink ? videoLink.split("/").pop() : null;

    const backgroundImageUrl = videoId ? `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` : PlaceHolderImg;

    const galleryPhotos = getPropData && getPropData.gallery;

    const openLightbox = (index) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    };



    const closeLightbox = () => {
        if (viewerIsOpen) {
            setCurrentImage(0);
            setViewerIsOpen(false);
        }
    };
    const handleShowMap = () => {
        setShowMap(true);
    }
    useEffect(() => {

        return () => {
            setShowMap(false);
            setIsReported(false)
        };


    }, [userCurrentId, propId]);
    useEffect(() => {

        return () => {
            setIsReported(false)
        };


    }, [userCurrentId, propId]);
    useEffect(() => {

        if (userCurrentId === getPropData?.added_by) {
            setShowChat(false);
        } else {
            setShowChat(true);
        }

    }, [propId, showChat, isLoggedIn, getPropData?.added_by]);

    const handleInterested = (e) => {
        e.preventDefault();
        if (userCurrentId) {
            intrestedPropertyApi(
                getPropData.id,
                "1",
                (response) => {
                    setInterested(true);
                    toast.success(response.message);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            toast.error("Please login first to show your interest.");
        }
    };

    const handleNotInterested = (e) => {
        e.preventDefault();

        intrestedPropertyApi(
            getPropData.id,
            "0",
            (response) => {
                setInterested(false);
                toast.success(response.message);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleChat = (e) => {
        e.preventDefault();
        if (DummyImgData?.demo_mode === true) {
            Swal.fire({
                title: "Opps!",
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
        } else {
            if (userCurrentId) {
                setChatData((prevChatData) => {
                    const newChatData = {
                        property_id: getPropData.id,
                        slug_id: getPropData.slug_id,
                        title: getPropData.title,
                        title_image: getPropData.title_image,
                        user_id: getPropData.added_by,
                        name: getPropData.customer_name,
                        profile: getPropData.profile,
                    };

                    // Use the updater function to ensure you're working with the latest state
                    // localStorage.setItem('newUserChat', JSON.stringify(newChatData));
                    getChatData(newChatData)
                    return newChatData;
                });

                router.push('/user/chat');
            } else {
                toast.error("Please login first");
                setShowChat(true);
            }
        }
    };
    const handleReportProperty = (e) => {
        e.preventDefault();
        if (userCurrentId) {
            setIsReporteModal(true)
        } else {
            toast.error("Please login first to Report this property.");
        }
    }



    useEffect(() => {
    }, [chatData, isReported])



    useEffect(() => {
        if (propId) {
            setPropertyTotalClicksApi({
                slug_id: propId.slug,
                onSuccess: (res) => {
                },
                onError: (error) => {
                    console.log(error)
                }
            })
        }
    }, [getPropData?.id])



    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header />
                    <Breadcrumb
                        data={{
                            type: getPropData && getPropData.category.category,
                            title: getPropData && getPropData.title,
                            loc: getPropData && getPropData.address,
                            propertyType: getPropData && getPropData.property_type,
                            time: getPropData && getPropData.post_created,
                            price: getPropData && getPropData.price,
                            is_favourite: getPropData && getPropData.is_favourite,
                            propId: getPropData && getPropData.id,
                            title_img: getPropData && getPropData.title_image,
                            rentduration: getPropData && getPropData.rentduration
                        }}
                    />
                    <section className="properties-deatil-page">
                        <div id="all-prop-deatil-containt">
                            <div className="container">
                                {galleryPhotos && galleryPhotos.length > 0 ? (
                                    <div className="row" id="prop-images">
                                        {galleryPhotos.length < 2 ? (
                                            <>
                                                <div className="col-sm-12 col-md-6" id="prop-main-image">
                                                    <Image
                                                        loading="lazy"
                                                        src={getPropData?.title_image || PlaceHolderImg}
                                                        className="two-img01"
                                                        alt="Main Image" width={200}
                                                        height={200}
                                                        onClick={() => openLightbox(0)} />
                                                </div>
                                                <div className="col-sm-12 col-md-6" id="prop-main-image">
                                                    <Image
                                                        loading="lazy"
                                                        src={galleryPhotos[0]?.image_url || PlaceHolderImg}
                                                        className="two-img02"
                                                        alt="Main Image"
                                                        width={200}
                                                        height={200}
                                                        onClick={() => openLightbox(1)} />
                                                    <div className="see_all02">
                                                        <button onClick={() => openLightbox(0)}>{translate("seeAllPhotos")}</button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-lg-4 col-sm-12" id="prop-left-images">
                                                    <Image
                                                        loading="lazy"
                                                        src={galleryPhotos[0]?.image_url || PlaceHolderImg}
                                                        className="left-imgs01"
                                                        alt="Image 1"
                                                        width={200}
                                                        height={200}
                                                        onClick={() => openLightbox(1)}
                                                    />
                                                    <Image
                                                        loading="lazy"
                                                        src={galleryPhotos[1]?.image_url || PlaceHolderImg}
                                                        className="left-imgs02"
                                                        alt="Image 2"
                                                        width={200}
                                                        height={200}
                                                        onClick={() => openLightbox(2)}
                                                    />
                                                </div>
                                                <div className="col-lg-8 col-sm-12 text-center" id="prop-main-image">
                                                    <Image
                                                        loading="lazy"
                                                        src={getPropData?.title_image || PlaceHolderImg}
                                                        className="middle-img"
                                                        alt="Main Image"
                                                        width={200}
                                                        height={200}
                                                        onClick={() => openLightbox(0)}
                                                    />
                                                    <div className="see_all">
                                                        <button onClick={() => openLightbox(0)}>{translate("seeAllPhotos")}</button>
                                                    </div>
                                                </div>
                                            </>

                                        )}
                                    </div>
                                ) :
                                    <div className="row" id="prop-images">
                                        <div className="col-12" id="prop-main-image01">
                                            <Image
                                                loading="lazy"
                                                src={getPropData?.title_image || PlaceHolderImg}
                                                className="one-img"
                                                alt="Main Image"
                                                width={200}
                                                height={200}
                                                onClick={() => openLightbox(0)} />
                                        </div>
                                    </div>
                                }
                                <LightBox photos={galleryPhotos} viewerIsOpen={viewerIsOpen} currentImage={currentImage} onClose={closeLightbox} title_image={getPropData?.title_image} setViewerIsOpen={setViewerIsOpen} />

                                <div className="row" id="prop-all-deatils-cards">
                                    <div className="col-12 col-md-12 col-lg-9" id="prop-deatls-card">
                                        {getPropData && getPropData.description ? (
                                            <div className="card about-propertie">
                                                <div className="card-header">{translate("aboutProp")}</div>
                                                <div className="card-body">
                                                    {getPropData && getPropData.description && (
                                                        <>
                                                            <p>{expanded ? getPropData.description : getPropData.description.substring(0, 100) + "..."}</p>
                                                            {getPropData.description.length > 100 && (
                                                                <button onClick={() => setExpanded(!expanded)}>
                                                                    {expanded ? "Show Less" : "Show More"}
                                                                    <AiOutlineArrowRight className="mx-2" size={18} />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}

                                        {getPropData && getPropData.parameters.length > 0 && getPropData.parameters.some((elem) => elem.value !== null && elem.value !== "") ? (
                                            <div className="card " id="features-amenities">
                                                <div className="card-header">{translate("feature&Amenties")}</div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        {getPropData &&
                                                            getPropData.parameters.map((elem, index) =>
                                                                // Check if the value is an empty string
                                                                elem.value !== "" && elem.value !== "0" ? (
                                                                    <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                                                                        <div id="specification">
                                                                            <div className="spec-icon">
                                                                                {themeEnabled ? (
                                                                                    <ImageToSvg imageUrl={elem.image !== undefined && elem.image !== null ? elem.image : PlaceHolderImg} className="custom-svg" />
                                                                                ) : (
                                                                                    <Image loading="lazy" src={elem.image} width={20} height={16} alt="no_img" />
                                                                                )}
                                                                            </div>
                                                                            <div id="specs-deatils">
                                                                                <div>
                                                                                    <span>{elem.name}</span>
                                                                                </div>
                                                                                <div className="valueDiv">
                                                                                    {/* Check if the value is a link */}
                                                                                    {typeof elem.value === "string" && elem.value.startsWith("https://") ? (
                                                                                        <a id="spacs-count" href={elem.value} target="_blank" rel="noopener noreferrer">
                                                                                            {elem.value}
                                                                                        </a>
                                                                                    ) : (
                                                                                        <span id="spacs-count">{elem.value}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        {getPropData && getPropData.assign_facilities.length > 0 && getPropData.assign_facilities.some((elem) => elem.distance !== null && elem.distance !== "" && elem.distance !== 0) ? (
                                            <div className="card " id="features-amenities">
                                                <div className="card-header">{translate("OTF")}</div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        {getPropData &&
                                                            getPropData.assign_facilities.map((elem, index) =>
                                                                // Check if the value is an empty string
                                                                elem.distance !== "" && elem.distance !== 0 ? (
                                                                    <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                                                                        <div id="specification">
                                                                            <div className="spec-icon">
                                                                                {themeEnabled ? (
                                                                                    <ImageToSvg imageUrl={elem.image !== undefined && elem.image !== null ? elem?.image : PlaceHolderImg} className="custom-svg" />
                                                                                ) : (
                                                                                    <Image
                                                                                        loading="lazy"
                                                                                        src={elem.image !== undefined && elem.image !== null ? elem.image : PlaceHolderImg}
                                                                                        width={20}
                                                                                        height={16}
                                                                                        alt="no_img"
                                                                                        onError={(e) => {
                                                                                            e.target.src = PlaceHolderImg;
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>

                                                                            <div id="specs-deatils">
                                                                                <div>
                                                                                    <span>{elem.name}</span>
                                                                                </div>
                                                                                <div className="valueDiv">

                                                                                    <span id="spacs-count">{elem.distance} {""} {translate("km")}   </span>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : null
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        {getPropData && getPropData.latitude && getPropData.longitude ? (
                                            <div className="card" id="propertie_address">
                                                <div className="card-header">{translate("address")}</div>
                                                <div className="card-body">
                                                    <div className="row" id="prop-address">
                                                        <div className="adrs">
                                                            <div>
                                                                <span> {translate("address")}</span>
                                                            </div>
                                                            <div className="">
                                                                <span> {translate("city")}</span>
                                                            </div>
                                                            <div className="">
                                                                <span> {translate("state")}</span>
                                                            </div>
                                                            <div className="">
                                                                <span> {translate("country")}</span>
                                                            </div>
                                                        </div>
                                                        <div className="adrs02">
                                                            <div className="adrs_value">
                                                                <span>{getPropData && getPropData.address}</span>
                                                            </div>
                                                            <div className="adrs_value">
                                                                <span className="">{getPropData && getPropData.city}</span>
                                                            </div>

                                                            <div className="adrs_value">
                                                                <span className="">{getPropData && getPropData.state}</span>
                                                            </div>
                                                            <div className="adrs_value">
                                                                <span className="">{getPropData && getPropData.country}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {getPropData ? (
                                                        <div className="card google_map">
                                                            {showMap ? (
                                                                <Map latitude={getPropData.latitude} longitude={getPropData.longitude} />
                                                            ) : (
                                                                <>
                                                                    <div className="blur-background" />
                                                                    <div className="blur-container">
                                                                        <div className="view-map-button-div">
                                                                            <button onClick={handleShowMap} id="view-map-button">
                                                                                View Map
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}

                                        {getPropData && getPropData.video_link ? (
                                            <div className="card" id="prop-video">
                                                <div className="card-header">{translate("video")}</div>

                                                <div className="card-body">
                                                    {!play ? (
                                                        <div
                                                            className="video-background container"
                                                            style={{
                                                                backgroundImage: backgroundImageUrl,
                                                                backgroundSize: "cover", // You might want to adjust the background size based on your design
                                                                backgroundPosition: "center center", // You might want to adjust the position based on your design
                                                            }}
                                                        >
                                                            <div id="video-play-button">
                                                                <button
                                                                    onClick={() => setPlay(true)}
                                                                // href="https://youtu.be/y9j-BL5ocW8" target='_blank'
                                                                >
                                                                    <PiPlayCircleThin className="button-icon" size={80} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <ReactPlayer width="100%" height="500px" url={getPropData && getPropData.video_link} playing={play} controls={true} onPlay={() => setPlay(true)} onPause={() => setPlay(false)} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}

                                        {getPropData && getPropData.threeD_image ? (
                                            <div className="card" id="prop-360-view">
                                                <div className="card-header">{translate("vertualView")}</div>
                                                <div className="card-body">
                                                    <div id="virtual-view">
                                                        <div id="panorama"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-3">
                                        <div className="card" id="owner-deatils-card">
                                            <div className="card-header" id="card-owner-header">
                                                <div>
                                                    <Image loading="lazy" width={200} height={200} src={getPropData && getPropData.profile ? getPropData.profile : PlaceHolderImg} className="owner-img" alt="no_img" />
                                                </div>
                                                <div className="owner-deatils">
                                                    <span className="owner-name"> {getPropData && getPropData.customer_name}</span>
                                                    <span className="owner-add">
                                                        {" "}
                                                        <CiLocationOn size={20} />
                                                        {getPropData && getPropData.address}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <a href={`tel:${getPropData && getPropData.mobile}`}>
                                                    <div className="owner-contact">
                                                        <div>
                                                            <FiPhoneCall id="call-o" size={60} />
                                                        </div>
                                                        <div className="deatilss">
                                                            <span className="o-d"> {translate("call")}</span>
                                                            <span className="value">{getPropData && getPropData.mobile}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a href={`mailto:${getPropData && getPropData.email}`}>
                                                    <div className="owner-contact">
                                                        <div>
                                                            <FiMail id="mail-o" size={60} />
                                                        </div>
                                                        <div className="deatilss">
                                                            <span className="o-d"> {translate("mail")}</span>
                                                            <span className="value">{getPropData && getPropData.email}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                {showChat && isMessagingSupported && notificationPermissionGranted && (
                                                    <div className='owner-contact' onClick={handleChat}>
                                                        <div>
                                                            <FiMessageSquare id='chat-o' size={60} />
                                                        </div>
                                                        <div className='details'>
                                                            <span className='o-d'> {translate("chat")}</span>
                                                            <p className='value'> {translate("startAChat")}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="enquiry">
                                                    {!isReported ? (
                                                        <button className='enquiry-buttons' onClick={handleReportProperty}> <MdReport className='mx-1' size={20} />{translate("reportProp")}</button>
                                                    ) : null}

                                                    {interested && getPropData?.is_interested === 1 ? (
                                                        <button className="enquiry-buttons" onClick={handleNotInterested}>
                                                            <RiThumbUpFill className="mx-1" size={20} />
                                                            {translate("intrest")}
                                                        </button>
                                                    ) : (
                                                        <button className="enquiry-buttons" onClick={handleInterested}>
                                                            <FiThumbsUp className="mx-1" size={20} />
                                                            {translate("intrest")}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <SimilerPropertySlider />

                                {isReporteModal &&
                                    <ReportPropertyModal show={handleReportProperty} onHide={() => setIsReporteModal(false)} propertyId={getPropData?.id} setIsReported={setIsReported} />
                                }
                            </div>
                        </div>
                    </section>
                    <Footer />
                </>
            )}
        </>
    );
};

export default PropertyDetails;
