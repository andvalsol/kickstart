import React, {Component} from 'react';
import {Form, Button, Message, Input} from "semantic-ui-react";
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/Campaign';
import web3 from "../../../ethereum/web3";
import {Link, Router} from '../../../routes'

class New extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false,
    };

    static async getInitialProps(props) {
        const address = props.query.address;

        return {address};
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMessage: ''});

        const campaign = Campaign(this.props.address);

        const {description, value, recipient} = this.state;

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });

            // Take the user back to the requests
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (error) {
            this.setState({errorMessage: error});
        } finally {
            this.setState({loading: false});
        }
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        Back to requests
                    </a>
                </Link>
                <h3>Create a request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input onChange={(event) => this.setState({description: event.target.value})}
                               value={this.state.description}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Value in ETH</label>
                        <Input onChange={(event => this.setState({value: event.target.value}))}
                               value={this.state.value}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input onChange={(event) => this.setState({recipient: event.target.value})}
                               value={this.state.recipient}/>
                    </Form.Field>
                    <Message error header='Oops' content={this.state.errorMessage}/>
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default New;
