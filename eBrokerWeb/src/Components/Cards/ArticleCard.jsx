import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { AiOutlineArrowRight } from "react-icons/ai";
import { translate } from "@/utils";
import Image from "next/image";
import { useSelector } from "react-redux";
import { settingsData } from "@/store/reducer/settingsSlice";

const ArticleCard = ({ ele, expandedStates, index, PlaceHolderImg }) => {
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
            <Card id="article_main_card">
                <Image loading="lazy" height={0} width={0} variant="top" id="article_card_img" src={ele.image ? ele.image : PlaceHolderImg} alt="no_img"/>
                {ele.category?.category && ele.category?.category ? <span id="apartment_tag">{ele.category?.category}</span> : <span id="apartment_tag">General</span>}
                <Card.Body id="article_card_body">
                    <div id="article_card_headline">
                        <span>{stripHtmlTags(ele.title).substring(0, 30)}</span>
                        {ele && ele.description && (
                            <>
                                <p>{expandedStates[index] ? stripHtmlTags(ele.description) : stripHtmlTags(ele.description).substring(0, 100) + "..."}</p>
                                {ele.description.length > 100 && (
                                    <div id="readmore_article">
                                        <Link href="/article-details/[slug]" as={`/article-details/${ele.slug_id}`} passHref>
                                            <button className="readmore">
                                                {translate("showMore")}
                                                <AiOutlineArrowRight className="mx-2" size={18} />
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card.Body>
                <Card.Footer id="article_card_footer">
                    <div id="admin_pic">
                        <Image loading="lazy" src={systemsettingsData?.admin_image} alt="no_img" className="admin" width={200} height={200} />
                    </div>
                    <div className="article_footer_text">
                        <span className="byadmin"> {translate("by")} {systemsettingsData?.admin_name}</span>
                        <p>{timeAgo}</p>
                    </div>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default ArticleCard;
