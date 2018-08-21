import React from 'react';

const Confirmation = (props) => (
  <div>
    <div className="has-text-centered content">
    <h4>{props.confirmationMessage}</h4>
    <button onClick = {props.yes} className={`button ${props.yesButtonStyle}`} >Yes</button>
    <button onClick = {props.no} className="button" >No</button>
    </div>
  </div>
);

export default Confirmation;
