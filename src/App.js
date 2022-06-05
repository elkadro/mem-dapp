import logo from './logo.svg'
import './App.css'
import MintCard from './components/MintCard'
import './polyfill'

function App() {
  return (
    <div className="App">
      <div class="videooverlay"></div>
      <video className="background-video" autoPlay loop playsInline muted>
        <source src="img/background.mp4" />
        <source src="img/background.webm" />
      </video>
      <div className="container">
        <div className="header">
          <img src="img/logo.png" className="logo" />
          <p className="header-text">10,000 NFT's on the Ethereum Blockchain</p>
        </div>
        <h1 class="display minting">
          Meta Estate
          <br />
          <span class="highlight-yellow">Moguls</span>
        </h1>
        <div className="mint-container">
          <MintCard
            containerClass="margin-top-50"
            title="MINT YOUR MOGUL NOW"
            max={3}
            buttonColor="rgb(230, 179, 64)"
            buttonText="MINT YOUR MEM"
            price={0.1}
            currency="ETH"
            maxText="Max Amount: 3"
            priceText="Mint Price:"
            img="img/empress.png"
          />
        </div>
        <div className="copyright">Copyright 2022 - Mega Estate Moguls</div>
      </div>
    </div>
  )
}

export default App
