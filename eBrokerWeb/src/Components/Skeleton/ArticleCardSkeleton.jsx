import React from 'react';
import { Card } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

const ArticleCardSkeleton = () => {
  return (
    <Card id='article_main_card'>
      <Skeleton width="100%" height="180px" variant="top" className='article_card_img' />
      <span id='apartment_tag'>
        <Skeleton width="60px" height="20px" />
      </span>
      <Card.Body id='article_card_body'>
        <div id='article_card_headline'>
          <Skeleton width="80%" height="20px" />
          <Skeleton count={2} height="16px" />
          <div id='readmore_article'>
            <Skeleton width="100px" height="30px" />
          </div>
        </div>
      </Card.Body>
      <Card.Footer id='article_card_footer'>
        <div id='admin_pic'>
          <Skeleton width="40px" height="40px" />
        </div>
        <div className='article_footer_text'>
          <Skeleton width="80px" height="20px" />
          <Skeleton width="60px" height="16px" />
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ArticleCardSkeleton;
