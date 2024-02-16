import React from "react";
import Skeleton from "react-loading-skeleton";

const CustomHorizontalSkeleton = () => {
    return (
        <div className="horizontal_card skeleton">
            <div className="card" id="main_prop_card">
                <div className="image_div col-md-4">
                    <Skeleton width="100%" height="100%" className="horizontal_skeleton_img" />
                </div>

                <div className="card-body" id="main_prop_card_body">
                    <div>
                        <div className="prop_card_mainbody">
                            <div className="cate_image">
                                <Skeleton width={20} height={20} />
                            </div>
                            <div className="body_title">
                                <Skeleton width={100} height={20} />
                            </div>
                        </div>
                        <div id="prop_card_middletext">
                            <div>
                                <Skeleton width="100%" height={20} />
                            </div>
                            <div>
                                <Skeleton width="100%" height={16} />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer" id="prop_card_footer">
                        <div className="row">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div className="col-sm-12 col-md-6" key={index}>
                                    <div className="footer_content">
                                        <div>
                                            <Skeleton width={20} height={16} />
                                        </div>
                                        <div className="text_footer">
                                            <Skeleton width={80} height={16} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomHorizontalSkeleton;
