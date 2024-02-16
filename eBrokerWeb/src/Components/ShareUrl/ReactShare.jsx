import React from 'react'
import { Menu, Tooltip } from 'antd';
import { FacebookIcon, FacebookShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { CiLink } from "react-icons/ci";
const ReactShare = ({ currentUrl, handleCopyUrl, data, CompanyName }) => {
    return (
        <>
            <div className="card">
                <div className="card-header">Share</div>
                <div className="card-body">
                    <Menu>
                        <Menu.Item key="1">
                            <Tooltip title="Share on Facebook" placement="bottom">
                                <FacebookShareButton url={currentUrl} title={currentUrl + CompanyName} hashtag={CompanyName}>
                                    <FacebookIcon size={30} round />
                                </FacebookShareButton>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Tooltip title="Share on Twitter" placement="bottom">
                                <TwitterShareButton url={currentUrl}>
                                    <XIcon size={30} round />
                                </TwitterShareButton>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Tooltip title="Share on Whatsapp" placement="bottom">
                                <WhatsappShareButton url={currentUrl} title={data + "" + " - " + "" + CompanyName} hashtag={CompanyName}>
                                    <WhatsappIcon size={30} round />
                                </WhatsappShareButton>
                            </Tooltip>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Tooltip title="Copy URL" placement="bottom">
                                <span onClick={handleCopyUrl}>
                                    <CiLink size={30} />
                                </span>
                            </Tooltip>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        </>
    )
}

export default ReactShare
