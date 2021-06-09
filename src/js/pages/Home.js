import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import 'bootstrap/dist/css/bootstrap.css'
import CampaignFactory from '../../../build/contracts/CampaignFactory.json'
import Navbar from '../components/Navbar'
import CampaignFactoryTitle from '../components/CampaignFactoryTitle'
import Campaign from '../../../build/contracts/Campaign.json'
import Modal from '../components/Modal'
import SingleCampaign from '../components/SingleCampaign'

class Home extends React.Component {
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

    this.createNewCampaignHandler = this.createNewCampaignHandler.bind(this)
  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      console.log('Creating campaign factory')
      this.campaignFactory.deployed().then(campaignFactoryInstance => {
        this.campaignFactoryInstance = campaignFactoryInstance
        console.log('CampaignFactoryInstance => ', campaignFactoryInstance)
        this.setState({
          campaignFactoryAddress: campaignFactoryInstance.address
        })
        this.getAllDeployedCampaigns()
      })
    })
  }


  getAllDeployedCampaigns = () => {
    try {
      let allCampaignsArr = []
      console.log('Fetching all the campaigns')
      this.campaignFactoryInstance.getDeployedCampaigns().then(allCampaigns => {
        if (allCampaigns !== undefined) {
          console.log(`All campaign ${allCampaigns}`)
          allCampaigns.map(camp => {
            console.log(`Campaign: ${camp}`)
            console.log('this.campaign.at(camp); ', this.campaign.at(camp))
            this.campaign.at(camp).then(campaignInstance => {
              console.log(campaignInstance)
              allCampaignsArr.push(campaignInstance.address)
              // SetState the retrieve campaigns from blockchain
              this.setState({ campaignsFromBlockchain: allCampaignsArr })
              console.log("this state",this.state)
            })
          })
        }
      })
    } catch (error) {
      console.log(`Unable to get the all campaigns from blockchain. ${error}`)
    }
  }

  createNewCampaignHandler = (title, description, minimumFund) => {
    try {
      if (title && description && minimumFund >= 0) {
        this.campaignFactoryInstance
          .createCampaign(title, description, minimumFund, {
            from: this.state.account,
            gas: 4712388,
            gasPrice: 100000000000
          })
          .then(campaignFactory => {
            console.log(
              `New campaign created with address - ${campaignFactory}`
            )
            this.reRender()
          })
      } else {
        console.log('Enter minimum funding amount greater than 0')
      }
    } catch (error) {
      console.log(`Something went wrong while creating new campaign ${error}`)
    }
  }

  reRender = () => {
    console.log('Reload started')
    window.location.reload()
    console.log('Reload completed')
  }
  render() {
    return (
      <React.Fragment>
        <Navbar accountAddress={this.state.account} />
        <Modal createNewCampaignHandler={this.createNewCampaignHandler} />
        <div className="container" style={{marginTop: '5rem'}}>
          <div className="row">
            <div className="col">
              <CampaignFactoryTitle
                campaignFactoryAddress={this.state.campaignFactoryAddress}
              />
              <SingleCampaign
                campaignsFromBlockchain={this.state.campaignsFromBlockchain}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Home
