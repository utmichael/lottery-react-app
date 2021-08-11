import './App.css';
import Web3 from 'web3';
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

var web3 = new Web3(Web3.givenProvider);
// after givenProvide: || "ws://localhost:7545"

let lotteryAddress = '0x3C4FcB5Fb51D3400E7fd64709eC24F7aA67Eb32d';
let lotteryABI =[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "_pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

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
    await this.getWinEvents();
    await this.getFailEvents();
    this.makeFinalRecords();
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
    this.lotteryContract = new web3.eth.Contract(lotteryABI,lotteryAddress);
    let owner = await this.lotteryContract.methods.owner().call();
    // to test, bet 0.05 eth
    //this.lotteryContract.methods.betAndDistribute('0xcd').send({from: this.account, value:5000000000000000, gas: 300000})
  }
  getPot = async()=>{
    let pot = await this.lotteryContract.methods.getPot().call();
    console.log(pot);
    let potString = web3.utils.fromWei(pot.toString(), 'ether');
    console.log(potString);
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
    this.setState({betRecords:records})
    // console.log(records);
  }
  getFailEvents = async()=>{
    const records = [];
    let events = await this.lotteryContract.getPastEvents('FAIL',{fromBlock:0, toBlock:'latest'});
    for (let i=0; i<events.length;i++){
      const record={}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.answer = events[i].returnValues.answer;
      records.unshift(record);
    }
    this.setState({failRecords:records})
    // console.log(records);
  }
  getWinEvents = async()=>{
    const records = [];
    let events = await this.lotteryContract.getPastEvents('WIN',{fromBlock:0, toBlock:'latest'});
    for (let i=0; i<events.length;i++){
      const record={}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.amount = parseInt(events[i].returnValues.amount, 10).toString();
      records.unshift(record);
    }
    this.setState({winRecords:records})
    // console.log(records);
  }
  makeFinalRecords = async()=>{
    let f=0, w=0;
    const records = [...this.state.betRecords];
    for(let i=0;i<this.state.betRecords.length;i+=1){
      for(let i=0;i<this.state.betRecords.length;i+=1) {
        console.log(this.state.winRecords.length)
        if(this.state.winRecords.length > 0 && this.state.betRecords[i].index === this.state.winRecords[w].index){
          records[i].win = 'WIN'
          records[i].answer = records[i].challenges;
          records[i].pot = web3.utils.fromWei(this.state.winRecords[w].amount, 'ether');
          if(this.state.winRecords.length - 1 > w) w++;
  
        } else if(this.state.failRecords.length > 0 && this.state.betRecords[i].index === this.state.failRecords[f].index){
          
          records[i].win = 'FAIL'
          records[i].answer = this.state.failRecords[f].answer;
          records[i].pot = 0;
          if(this.state.failRecords.length - 1 > f) f++;
  
        }
      }
      
    }
    this.setState({finalRecords:records})
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
            <p className='card-text'></p>
            <p className='card-text text-center' style={{fontSize:300}}>{_card}</p>
            <p className='card-text'></p>
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
              <h1>Lottery</h1>
              <br></br>
              <h2>Current Pot : {this.state.pot}</h2>
              <br></br><br></br>
              <h3>Your Bet</h3>
              <p style={{fontSize:50}}><b>{this.state.challenges[0]} {this.state.challenges[1]} {this.state.challenges[2]}</b></p>
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
 
                </tr>
              </thead>
              <tbody>
                {
                  this.state.finalRecords.map((record, index) => {
                    return (
                      <tr key={index}>
                        <td>{record.index}</td>
                        <td>{record.bettor}</td> 
                        <td>{record.challenges}</td>      
                        <td>{record.answer}</td>      
                        <td>{record.pot}</td>      
                        <td>{record.win}</td>            
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
