import React, { useRef } from 'react';

export default function UseRef() {
    // const [rerenderCount, setRerenderCount] = useState(0);
    const inputRef = useRef(null);
    const focusInput = ()=>{
        inputRef.current.focus();
    }
  return (
    <div>
        
        <input ref={inputRef} />
        <button onClick={focusInput}> Focus Input</button>
        </div>
  )
}
