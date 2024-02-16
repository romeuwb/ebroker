import React from "react";
import { Card } from "react-bootstrap";
import { FiArrowRightCircle } from "react-icons/fi";
import Image from "next/image";

const AgentCard = ({ ele }) => {
    return (
        <Card id="main_agent_card">
            <Card.Body>
                <div className="agent_card_content">
                    <div>
                        <Image loading="lazy" src={ele.agentimg} className="agent-profile" width={100} height={100} alt="no_img"/>
                    </div>
                    <div className="mt-2">
                        <span className="agent-name">{ele.agentName}</span>
                    </div>
                    <div>
                        <span className="agent-main">{ele.agentEmail}</span>
                    </div>
                    <div className="view-all-agent mt-5">
                        <span>{ele.agentProp}</span>
                        <FiArrowRightCircle size={25} className="view-agent-deatils" />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AgentCard;
