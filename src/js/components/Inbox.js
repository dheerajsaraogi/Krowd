import React from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import 'bootstrap/dist/css/bootstrap.css'
import ChatWei from '../../../build/contracts/ChatWei.json'

var replyToAddress;
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
      this.props.toggle();
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
        this.props.toggle();
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
          this.props.toggle();
          return null;
        }
      }
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error checking user registration; see log");
      this.props.toggle();
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
      this.props.toggle();
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

  unixTime = (unixtime) => {

    var u = new Date(unixtime*1000);

    return ('0' + u.getDate()).slice(-2) + '-' + ('0' + (u.getMonth() + 1)).slice(-2) + '-' + u.getFullYear() + ' ' + ('0' + u.getHours()).slice(-2) + ':' + ('0' + u.getMinutes()).slice(-2) + ':' + ('0' + u.getSeconds()).slice(-2)
  };

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
        cell1.innerHTML = this.unixTime(timestamp[m]);
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
        rows[i].onclick = (function(e) {
          replyToAddress = this.cells[1].innerHTML;
          var thisRowContent = (this.cells[2].innerHTML);
          document.getElementById("reply").innerHTML = thisRowContent;
        });
        console.log(table);
        console.log(rows);
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
      clearInboxButton.addEventListener("click", () => {
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
    const styles = {
      "inbox": {
        "marginLeft": "0%",
        "marginRight": "0%",
        "marginTop": "1%",
        "marginBottom": "1%",
        "padding": "35px",
        "border": "2px solid DarkGray",
        "fontSize": "12px",
        "fontFamily": "\"Lucida Console\", Monaco, monospace"
      },
      "h1": {
        "display": "inline-block",
        "verticalAlign": "middle",
        "marginTop": "0px",
        "marginBottom": "10px",
        "fontSize": "22px",
        "wordBreak": "break-all"
      },
      "h2": {
        "color": "#AAA",
        "fontSize": "18px",
        "marginTop": "-10px",
        "wordBreak": "break-all"
      },
      "label": {
        "display": "inline-block",
        "width": "200px",
        "fontSize": "12px",
        "paddingBottom": "5px"
      },
      "a_type_addressLinks": {
        "padding": "0px",
        "color": "#666",
        "fontSize": "12px",
        "verticalAlign": "top",
        "resize": "none",
        "overflow": "hidden",
        "height": "auto",
        "width": "75%",
        "border": "0px solid #000",
        "outline": "none",
        "paddingLeft": "0px",
        "wordBreak": "break-all"
      },
      "textarea_type_mySimpleLabel": {
        "padding": "0px",
        "color": "#666",
        "fontSize": "12px",
        "verticalAlign": "top",
        "resize": "none",
        "overflow": "hidden",
        "height": "auto",
        "width": "75%",
        "border": "0px solid #000",
        "outline": "none",
        "paddingLeft": "0px",
        "wordBreak": "break-all"
      },
      "select_type_registeredUsersAddressMenu": {
        "width": "100%",
        "height": "33px",
        "display": "block",
        "borderRadius": "1px",
        "padding": "0px 0px 0px 0px",
        "backgroundColor": "White",
        "border": "1.0px solid #000",
        "fontSize": "12px",
        "letterSpacing": "1px",
        "textAlign": "left",
        "overflow": "hidden",
        "outline": "none",
        "color": "#666"
      },
      "button_type_clearInboxButton": {
        "padding": "0px",
        "fontSize": "12px",
        "marginTop": "0px",
        "borderRadius": "1px",
        "borderStyle": "solid",
        "border": "1.0px solid #000",
        "height": "30px",
        "lineHeight": "30px",
        "width": "60px",
        "textAlign": "center",
        "backgroundColor": "#EEE",
        "outline": "none",
        "cursor": "default",
        "WebkitTouchCallout": "none",
        "WebkitUserSelect": "none",
        "KhtmlUserSelect": "none",
        "MozUserSelect": "none",
        "MsUserSelect": "none",
        "userSelect": "none"
      },
      "input_type_myDefaultButton": {
        "padding": "0px",
        "fontSize": "12px",
        "marginTop": "0px",
        "borderRadius": "1px",
        "border": "1.0px solid #000",
        "height": "30px",
        "lineHeight": "30px",
        "width": "60px",
        "textAlign": "center",
        "backgroundColor": "#EEE",
        "outline": "none",
        "cursor": "pointer",
        "WebkitTouchCallout": "none",
        "WebkitUserSelect": "none",
        "KhtmlUserSelect": "none",
        "MozUserSelect": "none",
        "MsUserSelect": "none",
        "userSelect": "none",
        "float": "right"
      },
      "textarea_type_myInputTextArea": {
        "border": "1.0px solid #000",
        "padding": "10px",
        "fontSize": "12px",
        "borderRadius": "1px",
        "verticalAlign": "top",
        "resize": "none",
        "userSelect": "none",
        "outline": "none",
        "overflow": "hidden",
        "color": "#666",
        "width": "100%"
      },
      "textarea_type_messageTextArea": {
        "border": "1.0px solid #000",
        "fontSize": "12px",
        "borderRadius": "1px",
        "resize": "none",
        "outline": "none",
        "lineHeight": "26px",
        "overflow": "hidden",
        "color": "Black",
        "backgroundColor": "White",
        "display": "block",
        "width": "96%",
        "height": "26px",
        "paddingLeft": "10px",
        "width": "95%"
      },
      "table": {
        "borderCollapse": "collapse",
        "maxWidth": "100%",
        "width": "100%",
        "border": "1px solid Black",
        "marginTop": "-5px"
      },
      "th": {
        "border": "1px solid Black",
        "fontSize": "10px",
        "textAlign": "center",
        "padding": "5px",
        "wordWrap": "break-word",
        "wordBreak": "break-all",
        "userSelect": "none"
      },
      "td": {
        "border": "1px solid Black",
        "fontSize": "10px",
        "textAlign": "center",
        "padding": "5px",
        "wordWrap": "break-word",
        "wordBreak": "break-all",
        "userSelect": "none"
      },
      "tr_nth_child_even": {
        "backgroundColor": "White"
      },
      "th_sorted_ascending_after": {
        "content": "\"  \\2191\""
      },
      "th_sorted_descending_after": {
        "content": "\" \\2193\""
      },
      "tr_hover": {
        "backgroundColor": "#EEE",
        "color": "#000000"
      }
    }
    return (
      <React.Fragment>
        <div style={styles.inbox}>
        <label style={styles.label}>Your Ethereum address:</label> <br />
        <a style={styles.a_type_addressLinks} target="_blank" type="addressLinks" id="myAddress" spellCheck="false">Could not load</a>
        <br /><br />
        <label style={styles.label}>User directory:</label> <br />
        <input type="myDefaultButton" defaultValue="Copy" onClick={() => this.copyAddressToSend()} style={styles.input_type_myDefaultButton} />
        <div style={{overflow: 'hidden', paddingRight: '10px'}}>
          <select style={styles.select_type_registeredUsersAddressMenu} type="registeredUsersAddressMenu" id="registeredUsersAddressMenu" />​
        </div>
        <br />
        <label style={styles.label}>Send to:</label> <br />
        <textarea type="myInputTextArea" id="receiver" spellCheck="false" style={styles.textarea_type_myInputTextArea} maxLength={42} rows={1} defaultValue={""} />
        <br /><br />
        <br /><label style={styles.label}>Message:</label> <br />
        <input type="myDefaultButton" id="sendMessageButton" defaultValue="Send" onClick={() => this.sendMessage()} style={styles.input_type_myDefaultButton} />
        <div style={{overflow: 'hidden', paddingRight: '10px'}}>
          <textarea type="messageTextArea" id="message" style={styles.textarea_type_messageTextArea} maxLength={30} rows={1} defaultValue={""} />​
        </div>
        <div id="receivedTable" style={{display: 'none'}}>
          <br /><label style={styles.label}>Received:</label> <br />
          <input type="myDefaultButton" id="replyButton" defaultValue="Reply" onClick={() => this.replyToMessage()} style={styles.input_type_myDefaultButton} />
          <div style={{overflow: 'hidden', paddingRight: '10px'}}>
            <textarea type="messageTextArea" id="reply" defaultValue={""} style={styles.textarea_type_messageTextArea} />​
          </div>
          <br />
          <table id="mytable" style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>From</th>
                <th style={{display: 'none'}}>Content</th>
              </tr>
            </thead>
            <tbody id="mytable-tbody">
            </tbody>
          </table>
        </div>
        <br />
        <label style={styles.label}>Status:</label> <br />
        <span id="status">Inactive</span>
        </div>
      </React.Fragment>
    )
  }
}

export default Inbox
