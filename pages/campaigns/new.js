import React, {Component} from "react";
import Layout from "../../components/Layout";
import {Button, Form, Input, Message} from "semantic-ui-react";
import CampaignFactoryContract from "../../ethereum/Factory";
import web3 from "../../ethereum/web3";
import {Router} from '../../routes';

class CampaignNew extends Component {
    state = {
        minContribution: "",
        errorMessage: "",
        creatingCampaign: false,
    }

    onSubmit = async (event) => {
        // Prevent to attempt to submit a form and send it to the server
        event.preventDefault();

        try {
            const accounts = await web3.eth.getAccounts();

            // Show the user a spinner
            this.setState({creatingCampaign: true})
            // Reset the value of the error
            this.setState({errorMessage: ""})

            await CampaignFactoryContract.methods.deployCampaign(this.state.minContribution).send({
                from: accounts[0],
                gas: '1000000'
            });

            // Redirect the user over the campaign page
            Router.pushRoute('/');
        } catch (error) {
            // Send a message to the user that something went wrong
            this.setState({errorMessage: error.message})
        } finally {
            // Remove the spinner
            this.setState({creatingCampaign: false})
        }
    }

    render() {
        return (
            <Layout>
                <h3>Create a new campaign!</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum amount in order to be a contributor</label>
                        <Input
                            label="wei"
                            labelPosition="left"
                            onChange={(event) => this.setState({minContribution: event.target.value})}
                            value={this.state.minContribution}/>
                    </Form.Field>
                    <Message error header="Oops" content={this.state.errorMessage}>
                    </Message>
                    <Button loading={this.state.creatingCampaign} primary>Create</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew
