import React from "react";
import { Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

const AgentCardSkeleton = () => {
    return (
        <Card id="main_agent_card">
            <Card.Body>
                <div className="agent_card_content">
                    <div>
                        <Skeleton width={100} height={100} className="agent-profile" />
                    </div>
                    <div className="mt-2">
                        <Skeleton width="80%" height="20px" className="agent-name" />
                    </div>
                    <div>
                        <Skeleton width="60%" height="16px" className="agent-main" />
                    </div>
                    <div className="view-all-agent mt-5">
                        <Skeleton width="40%" height="16px" />
                        <Skeleton width="20px" height="20px" className="" />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AgentCardSkeleton;
