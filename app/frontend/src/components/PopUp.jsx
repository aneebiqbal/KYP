'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PopUp({ props}) {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    console.log(props);
    setShowPopup(props.show)
    setTimeout(()=>{
      setShowPopup(false)
    },props.timeout)
  }, [props, props.show, props.timeout]);
  return <>
    {showPopup &&(<div className="pop-up bg-ffffff search-drop-shadow-class" >
      <div className="flex items-center">
        <Image width={35} height={35} src={props.type === 'error'?'/fail.gif':props.type === 'warning'?'/alert.gif':'/success.gif'} alt="popupIcon"/>
        <p style={props.type === 'error'?{color:'#A12928'}:props.type === 'warning'?{color:'#FE9900'}:{color:'#04AA6D'}} className="text-14 text-weight-400 ml-12 popup-p">{props.message}</p>
      </div>
      <Image className="cursor-pointer ml-12" width={10} height={10} src="/crossIcon.png" alt="closeIcon" onClick={()=>{setShowPopup(false)}}/>
    </div>)}
  </>
}
