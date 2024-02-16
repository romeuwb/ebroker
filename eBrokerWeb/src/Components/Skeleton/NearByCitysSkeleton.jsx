import React from 'react'
import Skeleton from 'react-loading-skeleton'


const NearByCitysSkeleton = () => {
    return (
        <div className='row' id='nearBy-Citys'>
            <div className='col-lg-6' id='city_image_main_div'>
                <Skeleton width="100%" height="286px"/>
            </div>
            <div className='col-12 col-md-6 col-lg-3' id='city_img_div'>
                <Skeleton width="100%" height="387px"/>
            </div>
            <div className='col-12 col-md-6 col-lg-3' id='city_img_div'>
                <Skeleton width="100%" height="387px"/>
            </div>
            <div className='col-12 col-md-6 col-lg-3' id='city_img_div01'>
                <Skeleton width="100%" height="387px"/>
            </div>
            <div className='col-12 col-md-6 col-lg-3' id='city_img_div01'>
                <Skeleton width="100%" height="387px"/>
            </div>
            <div className='col-lg-6' id='city_image_main_div'>
                <Skeleton width="100%" height="286px"/>
            </div>
        </div>
    )
}

export default NearByCitysSkeleton
