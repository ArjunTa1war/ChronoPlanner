import React from 'react'

export default function Alert(props) {
    const capitalize = (word)=>{
    if(word==="danger")word="error"
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    if (!props.alert) return null;
    return (
    <div style={{position: 'static',marginTop:'65px'}}>
    {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
    <strong>{capitalize(props.alert.type) }</strong>:{props.alert.msg}
    </div>}
    </div>
  )
}

