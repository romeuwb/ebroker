import { store } from "@/store/store"

export const GET_SETTINGS = "get_system_settings"
export const USER_SIGNUP = "user_signup"
export const UPDATE_PROFILE = "update_profile"
export const GET_SLIDERS = "get_slider"
export const GET_CATEGORES = "get_categories"
export const GET_PROPETRES = "get_property"
export const GET_ARTICLES = "get_articles"
export const GET_COUNT_BY_CITIES_CATEGORIS = "get_count_by_cities_categoris"
export const ADD_FAVOURITE = "add_favourite"
export const GET_LANGUAGES = "get_languages"
export const CONTACT_US = "contct_us"
export const GET_FAV = "get_favourite_property"
export const GET_PACKAGES = "get_package";
export const GET_PAYMENT_SETTINGS = "get_payment_settings";
export const CREATEPAYMENT = "createPaymentIntent";
export const CONFIRMPAYMENT = "confirmPayment"
export const POST_PROPERTY = "post_property"
export const GET_FACILITITES = "get_facilities"
export const GET_LIMITS = "get_limits"
export const GET_PAYMENT_DETAILS = "get_payment_details";
export const UPDATE_POST_PROPERTY = "update_post_property";
export const DELETE_PROPERTY = "delete_property"
export const INTEREST_PROPERTY = "interested_users"
export const STORE_ADVERTISEMENT = "store_advertisement"
export const GET_NOTIFICATION_LIST = "get_notification_list"
export const ASSIGN_FREE_PACKAGE = "assign_free_package"
export const GET_CHATS = "get_chats"
export const GET_CHATS_MESSAGES = "get_messages"
export const SEND_MESSAGE = "send_message"
export const DELETE_MESSAGES = "delete_chat_message"
export const DELETE_USER = "delete_user"
export const GET_REPORT_REASONS = "get_report_reasons"
export const ADD_REPORT = "add_reports"
export const GET_NEARBY_PROPERTIES = "get_nearby_properties"
export const GET_SEO_SETTINGS = "get_seo_settings"
export const SET_PROPERTY_TOTAL_CLICKS = "set_property_total_click"
export const UPDATE_PROPERTYY_STATUS = "update_property_status"

// is login user check
export const getUserID = () => {
    let user = store.getState()?.User_signup
    if (user) {
        try {
            return user?.data?.data?.id
        } catch (error) {
            return null;
        }
    } else {
        return null
    }

}



// GET SETTINGS
export const getSettingApi = (type, user_id) => {
    return {
        url: `${GET_SETTINGS}`,
        method: "POST",
        data: {
            type: type,
            user_id: user_id,
        },
        authorizationHeader: false,

    }
}

// USER SIGNUP
export const user_signupApi = (name, email, mobile, type, address, firebase_id, logintype, profile, fcm_id) => {
    let data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("mobile", mobile);
    data.append("firebase_id", firebase_id);
    data.append("address", address);
    data.append("logintype", logintype);
    data.append("type", type);
    data.append("profile", profile);
    data.append("fcm_id", fcm_id);
    return {
        url: `${USER_SIGNUP}`,
        method: 'POST',
        data,
        authorizationHeader: false,

    }
}
// UPDATE PROFILE
export const update_profile = (userid, name, email, mobile, type, address, firebase_id, logintype, profile, latitude, longitude, about_me, facebook_id, twiiter_id, instagram_id, pintrest_id, fcm_id, notification, city, state, country) => {
    let data = new FormData();
    data.append("userid", userid);
    data.append("name", name);
    data.append("email", email);
    data.append("mobile", mobile);
    data.append("firebase_id", firebase_id);
    data.append("address", address);
    data.append("logintype", logintype);
    data.append("type", type);
    data.append("profile", profile);
    data.append("latitude", latitude);
    data.append("longitude", longitude);
    data.append("about_me", about_me);
    data.append("facebook_id", facebook_id);
    data.append("twiiter_id", twiiter_id);
    data.append("instagram_id", instagram_id);
    data.append("pintrest_id", pintrest_id);
    data.append("fcm_id", fcm_id);
    data.append("notification", notification);
    data.append("city", city);
    data.append("state", state);
    data.append("country", country);
    return {
        url: `${UPDATE_PROFILE}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}

// GET Slider 

export const getSliderApi = () => {

    return {
        url: `${GET_SLIDERS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// GET CATEGORIES

export const getCategorieApi = () => {

    return {
        url: `${GET_CATEGORES}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// get Propertyes 
export const getAllProperties = (promoted, top_rated, id, category_id, most_liked, city, get_simiilar, offset, limit, current_user, property_type, max_price, min_price, posted_since, state, country, search, userid, users_promoted, slug_id) => {

    return {
        url: `${GET_PROPETRES}`,
        method: "GET",
        params: {
            promoted: promoted,
            top_rated: top_rated,
            id: id,
            category_id: category_id,
            most_liked: most_liked,
            city: city,
            get_simiilar: get_simiilar,
            offset: offset,
            limit: limit,
            current_user: current_user,
            property_type: property_type,
            max_price: max_price,
            min_price: min_price,
            posted_since: posted_since,
            state: state,
            country: country,
            search: search,
            userid: userid,
            users_promoted: users_promoted,
            slug_id: slug_id,
        },
        authorizationHeader: false,

    }
}

// GET ARTICLES
export const getArticlesApi = (id, category_id, get_simiilar, slug_id) => {

    return {
        url: `${GET_ARTICLES}`,
        method: "GET",
        params: {
            id: id,
            category_id: category_id,
            get_simiilar: get_simiilar,
            slug_id: slug_id,
        },
        authorizationHeader: false,

    }
}

// GET_COUNT_BY_CITIES_CATEGORIS
export const getCountByCitysCategories = () => {
    return {
        url: `${GET_COUNT_BY_CITIES_CATEGORIS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// ADD_FAVOURITE
export const addFavourite = (property_id, type) => {
    return {
        url: `${ADD_FAVOURITE}`,
        method: "POST",
        data: {
            property_id: property_id,
            type: type
        },
        authorizationHeader: true,

    }
}

// GET_LANGUAGES

export const getLanguages = (language_code, web_language_file) => {
    return {
        url: `${GET_LANGUAGES}`,
        method: "GET",
        params: {
            language_code: language_code,
            web_language_file: web_language_file
        },
        authorizationHeader: false,

    }
}


// CONTACT US 
export const ContactUs = (first_name, last_name, email, subject, message) => {
    let data = new FormData();
    data.append("first_name", first_name);
    data.append("last_name", last_name);
    data.append("email", email);
    data.append("subject", subject);
    data.append("message", message);
    return {
        url: `${CONTACT_US}`,
        method: 'POST',
        data,
        authorizationHeader: false,

    }
}

// GET_FAV_PROPERTY

export const getFav = (offset, limit) => {
    return {
        url: `${GET_FAV}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,

    }
}

// GET_PACKAGES

export const getPackages = () => {
    let getuserid = getUserID();
    return {
        url: `${GET_PACKAGES}`,
        method: "GET",
        params: {
            current_user: getuserid
        },
        authorizationHeader: false,
    }
}

// GET_PAYMENT_SETTINGS
export const getPaymentSettings = () => {
    return {
        url: `${GET_PAYMENT_SETTINGS}`,
        method: "GET",
        params: {},
        authorizationHeader: true,
    }
}

// CREATEPAYMENT
export const createPaymentIntent = (description, name, address1, postalcode, city, state, country, amount, currency, card, packageID) => {
    let data = new FormData();
    data.append("description", description);
    data.append("shipping[name]", name);
    data.append("shipping[address][line1]", address1);
    data.append("shipping[address][postal_code]", postalcode);
    data.append("shipping[address][city]", city);
    data.append("shipping[address][state]", state);
    data.append("shipping[address][country]", country);
    data.append("amount", amount);
    data.append("currency", currency);
    data.append("payment_method_types[]", card);
    data.append("package_id", packageID);
    return {
        url: `${CREATEPAYMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// CONFIRMPAYMENT
export const confirmPayment = (paymentIntentId) => {
    let data = new FormData();
    data.append("paymentIntentId", paymentIntentId);

    return {
        url: `${CONFIRMPAYMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// POST PROPERTY
export const postProperty = (userid, package_id, title, description, city, state, country, latitude, longitude, address, price, category_id, property_type, video_link, parameters, facilities, title_image, threeD_image, gallery_images, meta_title, meta_description, meta_keywords, meta_image, rentduration) => {
    let data = new FormData();

    // Append the property data to the FormData object
    data.append('userid', userid);
    data.append('package_id', package_id);
    data.append('title', title);
    data.append('description', description);
    data.append('city', city);
    data.append('state', state);
    data.append('country', country);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    data.append('address', address);
    data.append('price', price);
    data.append('category_id', category_id);
    data.append('property_type', property_type);
    data.append('video_link', video_link);
    data.append('meta_title', meta_title);
    data.append('meta_description', meta_description);
    data.append('meta_keywords', meta_keywords);
    data.append('meta_image', meta_image);
    data.append('rentduration', rentduration);

    // Append the parameters array if it is an array
    if (Array.isArray(parameters)) {
        parameters.forEach((parameter, index) => {
            data.append(`parameters[${index}][parameter_id]`, parameter.parameter_id);
            data.append(`parameters[${index}][value]`, parameter.value);
        });
    }
    // Append the facilities array if it is an array
    if (Array.isArray(facilities)) {
        facilities.forEach((facility, index) => {
            data.append(`facilities[${index}][facility_id]`, facility.facility_id);
            data.append(`facilities[${index}][distance]`, facility.distance);
        });
    }
    data.append('title_image', title_image);
    data.append('threeD_image', threeD_image);

    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(gallery_images)) {
        gallery_images.forEach((image, index) => {
            data.append(`gallery_images[${index}]`, image);
        });
    }


    return {
        url: `${POST_PROPERTY}`,
        method: 'POST',
        data,
        authorizationHeader: true,
    };
};


// GET_COUNT_BY_CITIES_CATEGORIS
export const getFacilities = () => {
    return {
        url: `${GET_FACILITITES}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}

// GET_COUNT_BY_CITIES_CATEGORIS
export const getLimits = (id) => {
    return {
        url: `${GET_LIMITS}`,
        method: "GET",
        params: {
            id: id
        },
        authorizationHeader: true,

    }
}

// get payment detaisl
export const getPaymentDetials = (offset, limit) => {
    return {
        url: `${GET_PAYMENT_DETAILS}`,
        method: "GET",
        params: {
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,
    }
}


// UPDATE POST PROPERTY
export const updatePostProperty = (action_type, id, package_id, title, description, city, state, country, latitude, longitude, address, price, category_id, property_type, video_link, parameters, facilities, title_image, threeD_image, gallery_images, slug_id, meta_title, meta_description, meta_keywords, meta_image, rentduration) => {
    let data = new FormData();

    // Append the property data to the FormData object
    data.append('action_type', action_type);
    data.append('id', id);
    data.append('package_id', package_id);
    data.append('title', title);
    data.append('description', description);
    data.append('city', city);
    data.append('state', state);
    data.append('country', country);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    data.append('address', address);
    data.append('price', price);
    data.append('category_id', category_id);
    data.append('property_type', property_type);
    data.append('video_link', video_link);

    // Append the parameters array if it is an array
    if (Array.isArray(parameters)) {
        parameters.forEach((parameter, index) => {
            data.append(`parameters[${index}][parameter_id]`, parameter.parameter_id);
            data.append(`parameters[${index}][value]`, parameter.value);
        });
    }
    // Append the facilities array if it is an array
    if (Array.isArray(facilities)) {
        facilities.forEach((facility, index) => {
            data.append(`facilities[${index}][facility_id]`, facility.facility_id);
            data.append(`facilities[${index}][distance]`, facility.distance);
        });
    }
    data.append('title_image', title_image);
    data.append('threeD_image', threeD_image);

    // Check if gallery_images is defined and an array before using forEach
    if (Array.isArray(gallery_images)) {
        gallery_images.forEach((image, index) => {
            data.append(`gallery_images[${index}]`, image);
        });
    }
    data.append('slug_id', slug_id);
    data.append('meta_title', meta_title);
    data.append('meta_description', meta_description);
    data.append('meta_keywords', meta_keywords);
    data.append('meta_image', meta_image);
    data.append('rentduration', rentduration);


    return {
        url: `${UPDATE_POST_PROPERTY}`,
        method: 'POST',
        data,
        authorizationHeader: true,
    };
};


// DELETE_PROPERTY
export const deleteProperty = (id) => {
    let data = new FormData();
    data.append("id", id);

    return {
        url: `${DELETE_PROPERTY}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// FEATURE PROPERTY
export const featureProperty = (package_id, property_id, type, image) => {
    let data = new FormData();
    data.append("package_id", package_id);
    data.append("property_id", property_id);
    data.append("type", type);
    data.append("image", image);

    return {
        url: `${STORE_ADVERTISEMENT}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}


// Intrested Property
export const intrestedProperty = (property_id, type) => {
    let data = new FormData();
    data.append("property_id", property_id);
    data.append("type", type);

    return {
        url: `${INTEREST_PROPERTY}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
// get notification list
export const getNotificationList = (userid, offset, limit) => {

    // data.append("userid", userid);

    return {
        url: `${GET_NOTIFICATION_LIST}`,
        method: "GET",
        params: {
            userid: userid,
            offset: offset,
            limit: limit
        },
        authorizationHeader: true,
    }
}
// assign free package 
export const assignFreePackage = (package_id) => {
    let data = new FormData();
    data.append("package_id", package_id);

    return {
        url: `${ASSIGN_FREE_PACKAGE}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// GET CHAT LIST
export const getChatList = () => {

    return {
        url: `${GET_CHATS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: true,

    }
}
// GET CHAT messages
export const getChatMessages = (user_id, property_id, page, per_page) => {

    return {
        url: `${GET_CHATS_MESSAGES}`,
        method: "GET",
        params: {
            user_id: user_id,
            property_id: property_id,
            page: page,
            per_page: per_page
        },
        authorizationHeader: true,

    }
}

// USER SIGNUP
export const sendMessage = (sender_id, receiver_id, message, property_id, file, audio) => {
    let data = new FormData();

    data.append("sender_id", sender_id);
    data.append("receiver_id", receiver_id);
    data.append("message", message);
    data.append("property_id", property_id);
    data.append("file", file);
    data.append("audio", audio);
    return {
        url: `${SEND_MESSAGE}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}
// DELETE CHAT messages
export const deleteChatMessages = (sender_id, receiver_id, property_id) => {
    let data = new FormData();

    data.append("sender_id", sender_id);
    data.append("receiver_id", receiver_id);
    data.append("property_id", property_id);
    return {
        url: `${DELETE_MESSAGES}`,
        method: 'POST',
        data,
        authorizationHeader: true,

    }
}
// Delete user api 
export const deleteUser = (userid) => {
    let data = new FormData();
    data.append("userid", userid);

    return {
        url: `${DELETE_USER}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}

// Get Report Reasons list 
export const getReportReasons = () => {
    return {
        url: `${GET_REPORT_REASONS}`,
        method: "GET",
        params: {

        },
        authorizationHeader: false,

    }
}
// ADD Report 
export const addReport = (reason_id, property_id, other_message) => {
    let data = new FormData();
    data.append("reason_id", reason_id);
    data.append("property_id", property_id);
    data.append("other_message", other_message);
    return {
        url: `${ADD_REPORT}`,
        method: "POST",
        data,
        authorizationHeader: true,

    }
}
// GET_NEARBY_PROPERTIES    
export const getNearbyProperties = (city, state, type) => {
    return {
        url: `${GET_NEARBY_PROPERTIES}`,
        method: "GET",
        params: {
            city: city,
            state: state,
            type: type,
        },
        authorizationHeader: false,
    }
}
// set property clicks     
export const setPropertyTotalClicks = (slug_id) => {
    let data = new FormData();
    data.append("slug_id", slug_id);
    return {
        url: `${SET_PROPERTY_TOTAL_CLICKS}`,
        method: "POST",
        data,
        authorizationHeader: false,
    }
}
// set property status     
export const changePropertyStatus = (property_id, status) => {
    let data = new FormData();
    data.append("property_id", property_id);
    data.append("status", status);
    return {
        url: `${UPDATE_PROPERTYY_STATUS}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
}
