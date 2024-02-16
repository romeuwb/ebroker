import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { translate } from "@/utils";

import Image from "next/image";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";

const ArticleHorizonatalCard = ({ ele, expandedStates, index, PlaceHolderImg }) => {
    const stripHtmlTags = (htmlString) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        return tempDiv.textContent || tempDiv.innerText || "";
    };
    const systemsettingsData = useSelector(settingsData)
  
    const [timeAgo, setTimeAgo] = useState(null);
    useEffect(() => {
        const postDate = new Date(ele.created_at);
        const currentDate = new Date();
        
        const timeDifference = currentDate - postDate;
    
        if (timeDifference < 30 * 24 * 60 * 60 * 1000) {
          // Less than 30 days, show days ago
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          setTimeAgo(`${days} day${days !== 1 ? 's' : ''} ago`);
        } else if (timeDifference < 12 * 30 * 24 * 60 * 60 * 1000) {
          // More than 30 days but less than 12 months, show months ago
          const months = Math.floor(timeDifference / (30 * 24 * 60 * 60 * 1000));
          setTimeAgo(`${months} month${months !== 1 ? 's' : ''} ago`);
        } else {
          // More than 12 months, show years ago
          const years = Math.floor(timeDifference / (12 * 30 * 24 * 60 * 60 * 1000));
          setTimeAgo(`${years} year${years !== 1 ? 's' : ''} ago`);
        }
      }, [ele.created_at]);
    return (
        <div>
            <div className="card" id="article_horizontal_card">
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-3">
                        <div className="article_card_image">
                            <Image loading="lazy" variant="top" alt="no_img" className="article_Img" src={ele.image ? ele.image : PlaceHolderImg} width={200} height={200} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-9">
                        <div className="article-card-content">
                            {ele.category?.category && ele.category?.category ? <span className="article-apartment-tag">{ele.category?.category}</span> : <span className="article-apartment-tag">General</span>}
                            <div className="article-card-headline">
                                <span> {stripHtmlTags(ele.title).substring(0, 30)}</span>
                                {ele && ele.description && (
                                    <>
                                        <p>{expandedStates[index] ? stripHtmlTags(ele.description) : stripHtmlTags(ele.description).substring(0, 100) + "..."}</p>
                                        {ele.description.length > 100 && (
                                            <div className="article-readmore">
                                                <Link href="/article-details/[slug]" as={`/article-details/${ele.slug_id}`} passHref>
                                                    <button className="article-readmore-button">
                                                        {translate("showMore")} <AiOutlineArrowRight className="article-arrow-icon" size={18} />
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="card-footer" id="article-card-footer">
                                <div id="admin_pic">
                                    <Image loading="lazy" src={systemsettingsData?.admin_image} alt="no_img" className="admin" width={200} height={200} />
                                </div>
                                <div className="article_footer_text">
                                    <span className="byadmin"> {translate("by")} {systemsettingsData?.admin_name}</span>
                                    <p>{timeAgo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleHorizonatalCard;
