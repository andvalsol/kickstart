import React, {Component} from "react";
import CampaignFactoryContract from "../ethereum/Factory";
import {Card, Button} from "semantic-ui-react";
import Layout from "../components/Layout";
import {Link} from "../routes";

class Index extends Component {
    // This defines a class function. NOTE: This function is only available through Next.js
    static async getInitialProps() {
        const campaigns = await CampaignFactoryContract.methods.getDeployedCampaigns().call();

        return {campaigns};
    }

    renderCampaigns() {
        // Iterate through every campaign
        const items = this.props.campaigns.map((address) => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a >
                            View campaign
                        </a>
                    </Link>
                ),
                fluid: true
            }
        });

        return <Card.Group items={items}/>
    }

    render() {
        return (
            <div>
                <Layout>
                    <h2>Open Campaigns</h2>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                content="Create campaign"
                                primary
                                floated="right"/>
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </Layout>
            </div>
        )
    }
}

export default Index;
