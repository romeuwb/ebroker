import React from 'react';
import { Card } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


const CustomCategorySkeleton = () => {


    return (

        <div className='Category_card'>
            <Card id='main_aprt_card'>
                <Card.Body>
                    <div className='apart_card_content'>
                        <div id='apart_icon'>
                            <Skeleton width="20px" height="20px" /> {/* Skeleton for the image */}
                        </div>
                        <div id='apart_name'>
                            <Skeleton width="80%" height="20px" /> {/* Skeleton for the category */}
                            <Skeleton width="60%" height="16px" /> {/* Skeleton for the properties count */}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>


    );
};

export default CustomCategorySkeleton;
