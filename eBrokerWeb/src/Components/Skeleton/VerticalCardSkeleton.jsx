import React from 'react';
import Skeleton from 'react-loading-skeleton'

function VerticalCardSkeleton() {
  return (
    <div className='verticle_card'>
      <div className='card verticle_main_card'>
        <Skeleton width="100%" height="26vh" className="skeleton_img" />
        <div className="card-img-overlay">
          <Skeleton width="100px" height="35px" />
        </div>
        <div className='card-body'>

          <div id='feature_card_mainbody'>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="cate_image">
                <Skeleton width="20px" height="20px" />
              </div>
              <Skeleton width="100px" height="20px" />
            </div>
          </div>
          <div id='feature_card_middletext'>
            <Skeleton width="100%" height="20px" />
            <Skeleton width="100%" height="16px" />
          </div>
        </div>
        <div className='card-footer' id='skeleton_card_footer'>
          <div className="row">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="col-sm-12 col-md-6 " key={index}>
                <div id='skeleton_footer_content' key={index}>
                  <Skeleton width="20px" height="16px" />
                  <Skeleton width="80px" height="16px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerticalCardSkeleton;
