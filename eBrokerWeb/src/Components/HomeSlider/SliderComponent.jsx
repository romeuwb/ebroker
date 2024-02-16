import React, { useState, useEffect } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import { FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { GoPlay } from 'react-icons/go';
import VideoPlayerModal from '../PlayerModal/VideoPlayerModal';
import { useSelector } from 'react-redux';
import { settingsData } from '@/store/reducer/settingsSlice';
import { formatNumberWithCommas, translate } from '@/utils';
import { BiLeftArrowCircle, BiRightArrowCircle } from 'react-icons/bi';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const SliderComponent = ({ sliderData }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // Add state for controlling autoplay
  const priceSymbol = useSelector(settingsData);
  const CurrencySymbol = priceSymbol && priceSymbol.currency_symbol;

  const handleCloseModal = () => {
    setShowVideoModal(false);
    setAutoplay(true); // Enable autoplay when the video player is closed
  };

  const handleOpenModal = () => {
    setShowVideoModal(true);
    setAutoplay(false); // Disable autoplay when the video player is open
  };

  const ButtonContentLeft = <BiLeftArrowCircle className='custom_icons_slider' />;
  const ButtonContentRight = <BiRightArrowCircle className='custom_icons_slider' />;

  return (
    <div className="slider-container">
      <AutoplaySlider
        animation="cube"
        buttonContentRight={ButtonContentRight}
        buttonContentLeft={ButtonContentLeft}
        organicArrows={false}
        bullets={false}
        play={autoplay} // Use the state to control autoplay
        interval={3000}
        disableProgressBar={true} 
      >
        {sliderData.map((single, index) => (
          <div key={index} data-src={single.property_title_image} className='main_slider_div'>
            <div className="container">
              <div id="herotexts">
                <div>
                  <span id="priceteg">
                    {CurrencySymbol} {formatNumberWithCommas(single.property_price)}
                  </span>
                  <h1 id="hero_headlines">{single.property_title}</h1>  
                  <div className="hero_text_parameters">
                    {single.parameters &&
                      single.parameters.slice(0, 4).map((elem, index) => (
                        elem.value !== 0 && elem.value !== null && elem.value !== undefined && (
                          <span key={index} id="specification">
                          {elem.name} : {elem.value}{index < 3 ? ', ' : ''}
                          </span>
                        )
                      ))}
                  </div>
                </div>
                <div id="viewall_hero_prop">
                  <Link href="/properties-details/[slug]" as={`/properties-details/${single.slug_id}`} passHref>
                    <button className="view_prop">
                      <FaEye size={20} className="icon" />
                      {translate("viewProperty")}
                    </button>
                  </Link>
                  {single && single.video_link ? (
                    <>
                      <div>
                        <GoPlay
                          className="playbutton"
                          size={50}
                          onClick={handleOpenModal} // Open the video player
                        />
                      </div>
                      <VideoPlayerModal isOpen={showVideoModal} onClose={handleCloseModal} data={single} />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </AutoplaySlider>
    </div>
  );
};

export default SliderComponent;
