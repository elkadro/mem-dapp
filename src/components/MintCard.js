import React, {useState} from 'react'

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
    const [mintNumber, setmintNumber] = useState(1)
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
        <button className="mint-card-button" onClick={()=>{alert(mintNumber)}} style={{backgroundColor: buttonColor}}>{buttonText}</button>
      </div>
    </div>
  )
}

export default MintCard
