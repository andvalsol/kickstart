import React, {Component} from "react";
import {Form, Input, Button, Message} from "semantic-ui-react";
import Campaign from "../ethereum/Campaign";
import web3 from "../ethereum/web3";
import Router from '../routes'

class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event?.preventDefault();

        this.setState({loading: true});
        this.setState({errorMessage: ''})

        const campaign = Campaign(this.props.address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether'),
            });

            // Reload the campaign route
            await Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (error) {
            this.setState({errorMessage: error});
        } finally {
            this.setState({loading: false});
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        onChange={(event) => this.setState({value: event.target.value})}
                        value={this.state.value}
                        label="ETH"
                        labelPosition="left"/>
                </Form.Field>
                <Message error header="Oops" content={this.state.errorMessage} />
                <Button loading={this.state.loading} onClick={this.onSubmit} primary>Contribute</Button>
            </Form>
        )
    }
}

export default ContributeForm;
