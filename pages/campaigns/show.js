import React, {Component} from 'react';
import Layout from "../../components/Layout";
import CampaignContract from "../../ethereum/Campaign";
import {Card} from 'semantic-ui-react';
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

class CampaignShow extends Component {
    // the props passed to this function is different from the props from the component
    static async getInitialProps(props) {
        // this will return the address from the url
        const campaign = CampaignContract(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        return {
            minContribution: summary[0], // Even though is an object we need to access it as if its an array
            balance: summary[1],
            requestCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4],
        }
    }

    renderCards = () => {
        const {balance, requestCount, contributorsCount, manager, minContribution} = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of the manager',
                description: 'The manager created this campaign and it can withdraw if the request is approved.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minContribution,
                meta: 'Minimum contribution',
                description: 'The minimum contribution to become a contributor and approver for a manager request'
            },
            {
                header: requestCount,
                meta: 'Request count',
                description: 'The number of requests that the manager has made'
            },
            {
                header: contributorsCount,
                meta: 'Contributors count',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Balance in ether',
                description: 'The current balance for this campaign'
            },
        ];

        return (
            <Card.Group items={items}/>
        )
    }

    render() {
        return (
            <Layout>
                <h3>Campaign</h3>
                {this.renderCards()}
                <ContributeForm/>
            </Layout>
        )
    }
}

export default CampaignShow
