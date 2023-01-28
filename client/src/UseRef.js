import React, { useRef, useState } from 'react';

export default function UseRef() {
    // const [rerenderCount, setRerenderCount] = useState(0);
    const [first, setfirst] = useState("second")
    const prevName = useRef(null);

   const focusInput = ()=>{
        prevName.current.focus();
    }
    // useEffect(()=>{
    //     prevName.current = first
    // },[first])
  return (
    <div>
        
        <input ref={prevName}  />
       
       {/* <div>this is prev Name`{prevName.current}` and this is curr name `{first}`</div> */}
       <button onClick={focusInput}>Click</button>
       </div>
  )
}
