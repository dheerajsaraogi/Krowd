import React from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import 'bootstrap/dist/css/bootstrap.css'
import ChatWei from '../../../build/contracts/ChatWei.json'

class Inbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      myInboxSize: 0,
    }

    if (typeof window.ethereum != 'undefined') {
      window.ethereum.enable();
      this.web3Provider = web3.currentProvider
      this.setStatus('MetaMask detected');
    } else {
      alert("Error: Please install MetaMask then refresh the page.");
      this.web3Provider = new Web3.providers.HttpProvider(
        'http://127.0.0.1:8545'
      )
    }

    this.web3 = new Web3(this.web3Provider)

    this.ChatWei = TruffleContract(ChatWei)
    this.ChatWei.setProvider(this.web3Provider)
  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      if (!account) {
        this.setStatus("Please login to MetaMask");
        alert("Could not fetch your account. Make sure you are logged in to MetaMask, then refresh the page.");
        return;
      }
      this.getContractProperties()
    })
  }

  getContractProperties = () => {
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.getContractProperties({from: this.state.account});
    }).then((value) => {
      var by = value[0];
      var registeredUsersAddress = value[1];
      var numRegisteredUsers = registeredUsersAddress.length;
      var select = '';
      for (let i = 0; i < numRegisteredUsers; i++) {
        select += '<option val=' + i + '>' + registeredUsersAddress[i] + '</option>';
      }
      console.log(registeredUsersAddress)
      $('#registeredUsersAddressMenu').html(select);
    }).catch((e) => {
      console.log(e);
      this.setStatus("");
    });
    return this.displayMyAccountInfo();
  }

  displayMyAccountInfo = () => {
    this.web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        this.setState({ account })
        document.getElementById("myAddress").innerHTML = account;
      }
    });
    return this.checkUserRegistration();
  }

  checkUserRegistration = () => {
    this.setStatus("Checking user registration...please wait");
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.checkUserRegistration({from: this.state.account});
    }).then((value) => {
      if (value) {
        this.setStatus("User is registered...ready");
      } else {
        if (confirm("New user: we need to setup an inbox for you on the Ethereum blockchain. For this you will need to submit a transaction in MetaMask. You will only need to do this once.")) {
          this.registerUser();
        } else {
          return null;
        }
      }
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error checking user registration; see log");
    });
    return this.getMyInboxSize();
  }

  registerUser = () => {
    this.setStatus("User registration:(open MetaMask->submit->wait)");
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.registerUser({}, {
        from: this.state.account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then((result) => {
      var gasUsedWei = result.receipt.gasUsed;
      this.setStatus("User is registered...gas spent: " + gasUsedWei + "(Wei)");
      alert("A personal inbox has been established for you on the Ethereum blockchain. You're all set!");
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error logging in; see log");
    });
    return null;
  }

  getMyInboxSize = () => {
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.getMyInboxSize({from: this.state.account});
    }).then((value) => {
      // Set global variable
      this.setState({
        myInboxSize: value[1]
      })
      if (this.state.myInboxSize > 0) {
        document.getElementById("receivedTable").style.display = "inline";
        return this.receiveMessages();
      } else {
        document.getElementById("receivedTable").style.display = "none";
        return null;
      }
    }).catch((e) => {
      console.log(e);
      this.setStatus("");
    });
  }

  setStatus = (message) => {
    var elem = document.getElementById("status");
    if(typeof elem !== 'undefined' && elem !== null) {
      elem.innerHTML = message;
    }
  }

  sendMessage = () => {
    var receiver = document.getElementById("receiver").value;
    if (receiver == "") {
      this.setStatus("Send address cannot be empty");
      return null;
    }
    if (!this.web3.isAddress(receiver)) {
      this.setStatus("You did not enter a valid Ethereum address");
      return null;
    }
    var myAddress = document.getElementById("myAddress").innerHTML;
    var newMessage = document.getElementById("message").value;
    if (newMessage == "") {
      this.setStatus("Oops! Message is empty");
      return null;
    }
    document.getElementById("message").value = "";
    document.getElementById("sendMessageButton").disabled = true;
    this.setStatus("Sending message: (open MetaMask->submit->wait)");
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.sendMessage(receiver, newMessage, {
        from: this.state.account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then((result) => {
      console.log(result);
      var gasUsedWei = result.receipt.gasUsed;
      this.setStatus("Message successfully sent...gas spent: " + gasUsedWei + " Wei");
      document.getElementById("sendMessageButton").disabled = false;
      document.getElementById("message").value = "";
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error sending message; see log");
    });
  }

  receiveMessages = () => {
    var meta;
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.receiveMessages({}, {from: this.state.account});
    }).then((value) => {
      var content = value[0];
      var timestamp = value[1];
      var sender = value[2];
      for (var m = 0; m < this.state.myInboxSize; m++) {
        var tbody = document.getElementById("mytable-tbody");
        var row = tbody.insertRow();
        var cell1 = row.insertCell();
        cell1.innerHTML = timestamp[m];
        var cell2 = row.insertCell();
        cell2.innerHTML = sender[m];
        var cell3 = row.insertCell();

        var thisRowReceivedText = content[m].toString();
        var receivedAscii = web3.toAscii(thisRowReceivedText);
        var thisRowSenderAddress = sender[m];
        cell3.innerHTML = receivedAscii;
        cell3.hidden = true;
      }
      var table = document.getElementById("mytable");
      var rows = table.rows;
      for (var i = 1; i < rows.length; i++) {
        rows[i].onClick = (function(e) {
          replyToAddress = this.cells[1].innerHTML;
          var thisRowContent = (this.cells[2].innerHTML);
          document.getElementById("reply").innerHTML = thisRowContent;
        });
      }
      // create inbox clear all button
      var clearInboxButton = document.createElement("button");
      clearInboxButton.id = "clearInboxButton";
      clearInboxButton.type = "clearInboxButton";
      clearInboxButton.disabled = false;
      clearInboxButton.style.width = "100%";
      clearInboxButton.style.height = "30px";
      clearInboxButton.style.margin = "15px 0px";
      clearInboxButton.innerHTML = "Clear inbox";
      document.getElementById("receivedTable").appendChild(clearInboxButton);
      clearInboxButton.addEventListener("click", function() {
        document.getElementById("clearInboxButton").disabled = true;
        this.clearInbox();
      });
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error getting messages; see log");
    });
    return;
  }

  clearInbox = () => {
    var meta;
    this.setStatus("Clearing inbox: (open MetaMask->submit->wait)");
    this.ChatWei.deployed().then((instance) => {
      meta = instance;
      return meta.clearInbox({}, {
        from: this.state.account,
        gas: 6385876,
        gasPrice: 20000000000
      });
    }).then((value) => {
      var clearInboxButton = document.getElementById("clearInboxButton");
      clearInboxButton.parentNode.removeChild(clearInboxButton);
      $("#mytable tr").remove();
      document.getElementById("receivedTable").style.display = "none";
      alert("Your inbox was cleared");
      this.setStatus("Inbox cleared");
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error clearing inbox; see log");
    });
  }

  replyToMessage = () => {
    document.getElementById("message").focus();
    document.getElementById("message").select();
    document.getElementById("receiver").value = replyToAddress;
  }

  copyAddressToSend = () => {
    var sel = document.getElementById("registeredUsersAddressMenu");
    var copyText = sel.options[sel.selectedIndex];
    document.getElementById("receiver").value = copyText.innerHTML;
    document.getElementById("message").focus();
    document.getElementById("message").select();
  }

  render() {
    return (
      <React.Fragment>
        <h1>Campaign Inbox</h1><br />
        <hr style={{border: '1px solid black', marginTop: '-5px'}} />
        <br />
        <label>Your Ethereum address:</label> <br />
        <a target="_blank" type="addressLinks" id="myAddress" spellCheck="false">Could not load</a>
        <br /><br />
        <label>User directory:</label> <br />
        <input type="myDefaultButton" defaultValue="Copy" onClick={() => this.copyAddressToSend()} style={{float: 'right'}} />
        <div style={{overflow: 'hidden', paddingRight: '10px'}}>
          <select type="registeredUsersAddressMenu" id="registeredUsersAddressMenu" />​
        </div>
        <br />
        <label>Send to:</label> <br />
        <textarea type="myInputTextArea" id="receiver" spellCheck="false" style={{width: '95%'}} maxLength={42} rows={1} defaultValue={""} />
        <br /><br />
        <br /><label>Message:</label> <br />
        <input type="myDefaultButton" id="sendMessageButton" defaultValue="Send" onClick={() => this.sendMessage()} style={{float: 'right'}} />
        <div style={{overflow: 'hidden', paddingRight: '10px'}}>
          <textarea type="messageTextArea" id="message" maxLength={30} rows={1} defaultValue={""} />​
        </div>
        <div id="receivedTable" style={{display: 'none'}}>
          <br /><label>Received:</label> <br />
          <input type="myDefaultButton" id="replyButton" defaultValue="Reply" onClick={() => this.replyToMessage()} style={{float: 'right'}} />
          <div style={{overflow: 'hidden', paddingRight: '10px'}}>
            <textarea type="messageTextArea" id="reply" defaultValue={""} />​
          </div>
          <br />
          <table id="mytable" style={{marginTop: '-5px'}}>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th style={{display: 'none'}}>Content</th>
              </tr>
            </thead>
            <tbody id="mytable-tbody">
            </tbody>
          </table>
        </div>
        <br />
        <label>Status:</label> <br />
        <span id="status">Inactive</span>
      </React.Fragment>
    )
  }
}

export default Inbox
