import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const SAVE_INTERVAL_MS = 2000;

export default function TextEditor() {

  const {id: documentId}  = useParams();

  let [quill, setQuill]  = useState()
  let [socket, setSocket]  = useState()


  useEffect(()=>{
    let s = io("https://docs-server-gisiaspfk-awalho.vercel.app")
    setSocket(s);

    return ()=>{
      s.close();
    }
  },[]);


  // useEffect(() => {
  //   socket = new WebSocket("");


  //   return () => {
  //       if (socket.readyState === 1) { // <-- This is important
  //           socket.close();
  //       }
  //   };
  // })


  useEffect(()=>{
    if(socket == null || quill == null) return;
    
    socket.once("load-document", (document)=>{
      quill.setContents(document)
      quill.enable();
    })

    socket.emit('get-document', documentId)

  },[socket, quill, documentId])


  useEffect(()=>{
    if (socket == null || quill == null) return

    const interval = setInterval(()=>{
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS)

  },[socket, quill])

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
      q.disable();
      q.setText("Loading")
      setQuill(q)

  },[]);
  return (
    <div className="container" ref={wrapperRef}></div>
  )
}
