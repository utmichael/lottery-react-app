import './App.css';
import Web3 from 'web3';
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

let lotteryAddress = '0x69bF039ED3c1Be51a491B77855245735faa7C365'
let lotteryABI =[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

class App extends Component{

  constructor(props){
    super(props);

    this.state={
      betRecords:[],
      winRecords:[],
      failRecords:[],
      pot:'0',
      challenges:['A','B'],
      finalRecords:[{
        bettor:'0xabcd',
        index:'0',
        challenges:'ab',
        answer:'ab',
        targetBlockAnswer:'10',
        pot:'0'
      }]
    }
  }

  async componentDidMount (){
    await this.initWeb3();
    
    await this.pollData();
    /*let account = await web3.eth.getAccounts();
    console.log(account);
    let balance = await web3.eth.getBalance(account[0]);
    console.log(balance);*/
    //let accounts = await this.web3.eth.getAccounts();
    //console.log(accounts);
  }
  pollData = async ()=>{
    await this.getPot();
    await this.getBetEvents();
  }
  initWeb3 = async () =>{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          // this.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
          console.log(`User denied account access: ${error}`)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        console.log('Legacy Mode')
        window.web3 = new Web3(Web3.currentProvider);
        // Acccounts always exposed
        // this.web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    let accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
    console.log(this.account);
    this.lotteryContract = new web3.eth.Contract(lotteryABI,lotteryAddress);
    let owner = await this.lotteryContract.methods.owner().call();
    // to test, bet 0.05 eth
    //this.lotteryContract.methods.betAndDistribute('0xcd').send({from: this.account, value:5000000000000000, gas: 300000})
  }
  getPot = async()=>{
    let pot = await this.lotteryContract.methods.getPot().call()
    let potString = web3.utils.fromWei(pot.toString(), 'ether');
    this.setState({pot:potString})
  }

  getBetEvents = async()=>{
    const records = [];
    let events = await this.lotteryContract.getPastEvents('BET',{fromBlock:0, toBlock:'latest'});
    for (let i=0; i<events.length;i++){
      const record={}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.bettor = events[i].returnValues.bettor;
      record.betBlockNumber = events[i].blockNumber;
      record.targetBlockNumber = events[i].returnValues.answerBlockNumber.toString();
      record.challenges=events[i].returnValues.challenges;
      record.win = "Not Revealed";
      record.answer = '0x00'
      records.unshift(record);

    }
    console.log(records);
  }
  
  bet = async()=>{
    let nonce = await web3.eth.getTransactionCount(this.account);
    let challenges = '0x'+this.state.challenges[0].toLowerCase()+this.state.challenges[1].toLowerCase();
    this.lotteryContract.methods.betAndDistribute(challenges).send({from: this.account, value:5000000000000000, gas: 300000, nonce:nonce})
    .on('transactionHash', (hash)=>{
      console.log(hash)
    })
  }
  onClickCard = (_Character)=>{
    this.setState({
      challenges:[this.state.challenges[1],_Character]
    })
  }
  getCard = (_Character, _cardStyle)=>{
    let _card = '';
    if (_Character==='A'){
      _card = '🂡'
    }
    if (_Character==='B'){
      _card = '🂱'
    }
    if (_Character==='C'){
      _card = '🃁'
    }
    if (_Character==='D'){
      _card = '🃑'
    }

    return (
      <button className={_cardStyle} onClick={()=>{
        this.onClickCard(_Character)
      }}> 
        <div className='card-body text-center'>
            <p className='card-test'></p>
            <p className='card-test text-center' style={{fontSize:300}}>{_card}</p>
            <p className='card-test'></p>
        </div>
      </button>
    )
  }

  render(){
      return (
        <div className="App">
          {/* Header - Pot, Betting characters */}
          <div className="container">
            <div className="jumbotron">
              <h1>Current Pot : {this.state.pot}</h1>
              <p>Lottery</p>
              <p>Your Bet</p>
              <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
            </div>
          </div>

          <div className='container'>
            <div className='card-group'>
              {this.getCard('A','card bg-primary')}
              {this.getCard('B','card bg-warning')}
              {this.getCard('C','card bg-danger')}
              {this.getCard('D','card bg-success')}
            </div> 
          </div>
          <br></br>
          <div>
            <button className='btn btn-danger btn-lg' onClick={this.bet}>BET!</button>
          </div>
          <br></br>
          <div className='container'>
            <table className='table table-dark table-striped'>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Address</th>
                  <th>Challenges</th>
                  <th>Answer</th>
                  <th>Pot</th>
                  <th>Status</th>
                  <th>Answer Block Number</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.finalRecords.map((record, index) => {
                    return (
                      <tr key={index}>
                        <td>0</td>
                        <td>0</td> 
                        <td>0</td>      
                        <td>0</td>      
                        <td>0</td>      
                        <td>0</td>      
                        <td>0</td>           
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
    );
  }
}

export default App;
