import React, {useEffect, useState} from 'react'
import Web3EthContract from 'web3-eth-contract'
import Web3 from 'web3'
import MEM from '../MEM.json'



const MintCard = ({
  img,
  title,
  max,
  maxText,
  containerClass,
  currency,
  price,
  priceText,
  buttonColor,
  buttonText,
}) => {

    const [mintNumber, setmintNumber] = useState(1);
    const [account, setaccount] = useState(null);
    const [smartContract, setsmartContract] = useState(null);
    const [provider, setprovider] = useState(null);
    const [theweb3, settheweb3] = useState(null);
    const [connectButtonText, setconnectButtonText] = useState('Connect')
    const [claimingNFT,setClaimingNft] = useState(false);
    const [contractMax, setContractMax] = useState(0);
    const [contractTotal, setContractTotal] = useState(0);
    const [contractCost, setContractCost] = useState(0);
    async function disconnectBlockchain() {
      setaccount(null);
      setsmartContract(null);
      setprovider(null);
      settheweb3(null);
      setconnectButtonText('Connect');
    }
    async function getRevertReason(web3,txHash){
      try {
        
        const tx = await web3.eth.getTransaction(txHash)
      
        //  console.log(" block #: ",tx.blockNumber)
        var result = await web3.eth.call(tx, tx.blockNumber)
        //  console.log(" result #: ",result)
        result = result.startsWith('0x') ? result : `0x${result}`
      
        if (result && result.substr(138)) {
      
          const reason = web3.utils.toAscii(result.substr(138))
          // console.log('Revert reason:', reason)
          return reason
      
        } else {
      
          // console.log('Cannot get reason - No return value')
      
        }
      } catch (error) {
        // console.log("revert error:",error)
      }
      
      }
    async function connectBlockchain() {
      const { ethereum } = window
         const metamaskIsInstalled = ethereum && ethereum.isMetaMask
         if (metamaskIsInstalled) {
    
           Web3EthContract.setProvider(ethereum)
          let web3 = new Web3(ethereum)
          try {
            const accounts = await ethereum.request({
              method: 'eth_requestAccounts',
            })
            const networkId = await ethereum.request({
              method: 'net_version',
            })
            // const NetworkData = await SmartContract.networks[networkId];
            if (networkId.toString() === '4') {
              const SmartContractObj = new Web3EthContract(
                MEM,
                '0x3b37ee4256050f38fa6cb008afedb42ccd92062f',
              )
              setaccount(accounts[0]);
              setsmartContract(SmartContractObj);
              setprovider(ethereum);
              settheweb3(web3);
              setconnectButtonText('Disconnect');
              
              // Add listeners start
              ethereum.on('accountsChanged', (accounts) => {
                setaccount(accounts[0]);
              })
              ethereum.on('chainChanged', () => {
                window.location.reload()
              })
              // Add listeners end
            } else {
              alert(`Change network to Ethereum Mainnet, current: ${networkId}`)
            }
          } catch (err) {
            // console.log(err.message)
            alert('Something went wrong: ' + err.message)
          }
        } else {
          alert('Install Metamask Please.')
        }
    }
    useEffect(()=>{
      fetchData(account)
    },[account])

    async function mintNFTs (_amount) {
      if (_amount <= 0 && contractCost <= 0) {
        return;
      }
      // alert("Minting your Moguls...");
      setClaimingNft(true);
      //smartContract.handleRevert = true;
      smartContract.methods
        .mint(account, _amount)
        .send({
          gasLimit: (70000 + (30000*(_amount - 1))).toString(),
          to: "0x3b37ee4256050f38fa6cb008afedb42ccd92062f",
          from: account,
          value: theweb3.utils.toWei((contractCost * _amount).toString(), "ether"),
        })
        .once("error", async (err) => {
          // console.log("error:",err);
  
          var splitArr = err.toString().split("{")
          var message = splitArr[0]
          if(message.indexOf("reverted") > -1)
          {
            if(splitArr.length > 1)
            {
              var str = splitArr[1]
              var hash = "0"+str.substring(
                str.indexOf("0",str.indexOf('"transactionHash"',1)) + 1,
                str.indexOf('",',str.indexOf('"transactionHash"',1) )
              );
              //get the reason from the transaction
              
              //var reas = getRevertReason(hash)
              // console.log("hash: ",hash)
              var reas = getRevertReason(theweb3,hash).finally(()=>{
                // console.log("reason: ",reas)
              })
              
              //console.log("real reason is:",reas);
              alert("Sorry Transaction cancelled, Try again please");
            }else
            {
              alert("Sorry Transaction cancelled, Try again please");
            }
          }else
          {
            alert("Sorry Transaction cancelled, Try again please");
          }
          setClaimingNft(false);
        })
        .then((receipt) => {
          // console.log(receipt)
          alert(
            `WOW, you are now a mogul owner. Tx: ${receipt.transactionHash}. It may take few minutes to show under your opensea account`
          );
          setClaimingNft(false);
          fetchData(account);
        });
    }
    async function fetchData(_account) 
    {
        try {
          
            let maxMint = await smartContract.methods.maxMintAmount()
            .call()
          let totalSupply = await smartContract.methods.totalSupply()
            .call();
          // let cost = await smartContract.methods.cost()
          //   .call();
          setContractMax(maxMint);
          setContractTotal(totalSupply);
          // setContractCost(cost)
          // dispatch(
          //   fetchDataSuccess({
          //     maxMint,
          //     totalSupply,
          //     cost,
          //   })
          // );
        } catch (err) {
          // console.log(err);
          // alert("Could not load data from contract.");
        }
    }
  return (
    <div className={'mint-card ' + containerClass}>
      <img src={img} className="mint-card-img" />
      <div className="mint-card-wrapper">
        <div className="mint-card-title">{title}</div>
        <div className="mint-card-amount-wrapper">
            <div className='mint-amount-numeric-wrapper'>
                <button onClick={()=>{mintNumber > 1 && setmintNumber(mintNumber - 1)}}>-</button>
                <div className='number'>{mintNumber}</div>
                <button onClick={()=>{mintNumber < 3 && setmintNumber(mintNumber + 1)}}>+</button>
            </div>
            <div className='mint-max-text'>{maxText}</div>
        </div>
        <div className="mint-card-price-text">
          <span className='mint-card-price-text-main'>{priceText}</span>
          <span> </span>
          <span>{price}</span>
          <span> </span>
          <span>{currency}</span>
        </div>
        {/* <div className="mint-card-price-text">
          <span className='mint-card-price-text-main'>Total Minted:</span>
          <span> </span>
          <span>{contractTotal}</span>
        </div>
        <div className="mint-card-price-text">
          <span className='mint-card-price-text-main'>Contract Cost:</span>
          <span> </span>
          <span>{contractCost}</span>
        </div>
        <div className="mint-card-price-text">
          <span className='mint-card-price-text-main'>Contract Max:</span>
          <span> </span>
          <span>{contractMax}</span>
        </div> */}
        <button className="mint-card-button" onClick={()=>{connectButtonText === 'Connect'? connectBlockchain():disconnectBlockchain()}} style={{backgroundColor: buttonColor}}>{connectButtonText}</button>
        <button className="mint-card-button" disabled={claimingNFT === true || connectButtonText === 'Connect'} onClick={()=>{mintNFTs(mintNumber)}} style={{backgroundColor: (claimingNFT === true || connectButtonText === 'Connect') ? 'gray' : buttonColor}}>{buttonText}</button>
      </div>
    </div>
  )
}

export default MintCard
