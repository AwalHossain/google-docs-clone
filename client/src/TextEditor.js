import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]



export default function TextEditor() {

  let [quill, setQuill]  = useState()
  let [socket, setSocket]  = useState()


  useEffect(()=>{
    let s = io("http://localhost:3001")
    setSocket(s);

    return ()=>{
      s.disconnect();
    }
  },[])

  useEffect(()=>{
    if (socket == null || quill == null) return
    let handler = (delta)=>{

      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return ()=>{
      socket.off('receive-change', handler)
    }

  },[socket, quill]);

  useEffect(()=>{
    if (socket == null || quill == null) return
    let handler = (delta, oldDelta, source)=>{

      if(source !== 'user'){
        return
      }
      socket.emit('send-changes', delta)
    }

    quill.on('text-change', handler);

    return ()=>{
      quill.off('text-change', handler)
    }

  },[socket, quill]);

  const wrapperRef = useCallback((wrapper)=>{
      if(wrapper == null) return;
      wrapper.innerHTML = "";
    let editor = document.createElement("div");
    wrapper.append(editor);
      let q = new Quill(editor, {
        theme: 'snow',
        modules:{toolbar: TOOLBAR_OPTIONS}
      })

      setQuill(q)

  },[]);
  return (
    <div className="container" ref={wrapperRef}></div>
  )
}
