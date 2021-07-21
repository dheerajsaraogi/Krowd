import React from 'react'
import Navbar from '../components/Navbar'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import CampaignFactory from '../../../build/contracts/CampaignFactory.json'
import Campaign from '../../../build/contracts/Campaign.json'


class contact extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          account: '0x0',
          loading: true,
          campaignFactoryAddress: null,
          campaignsFromBlockchain: []
        }
    
        if (typeof window.ethereum != 'undefined') {
          window.ethereum.enable();
          this.web3Provider = web3.currentProvider
        } else {
          alert("Error: Please install MetaMask then refresh the page.");
          this.web3Provider = new Web3.providers.HttpProvider(
            'http://127.0.0.1:8545'
          )
        }
    
        this.web3 = new Web3(this.web3Provider)
    
        this.campaignFactory = TruffleContract(CampaignFactory)
        this.campaignFactory.setProvider(this.web3Provider)
    
        this.campaign = TruffleContract(Campaign)
        this.campaign.setProvider(this.web3Provider)
    
        // this.createNewCampaignHandler = this.createNewCampaignHandler.bind(this)
      }

      componentDidMount() {
        this.web3.eth.getCoinbase((err, account) => {
          this.setState({ account })
          console.log('Creating campaign factory')
          this.campaignFactory.deployed().then(campaignFactoryInstance => {
            this.campaignFactoryInstance = campaignFactoryInstance
            this.setState({
              campaignFactoryAddress: campaignFactoryInstance.address
            })
            // this.getAllDeployedCampaigns()
          })
        })
      }

    render() {
        return (
           <React.Fragment>
                <Navbar accountAddress={this.state.account} />
           </React.Fragment>
       
        )
      }
}

export default contact