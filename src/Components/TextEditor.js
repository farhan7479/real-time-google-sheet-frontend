import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
const { io } = require("socket.io-client");

// Options for the TextEditor Toolbar
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
];

export default function TextEditor() {
  // State Declarations
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [editAllow, setEdit] = useState(false);
  const { id: docID } = useParams();
  const [Title, setTitle] = useState("");
  const authtoken = localStorage.getItem("sheets-auth-token");
  const SAVE_INTERVAL_MS = 2000;
  const Navigate = useNavigate();
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const state = useLocation().state;

  // Send to signUp if authtoken doesnt exist
  useEffect(() => {
    if (!authtoken) {
      Navigate("/");
    }
  }, []);


  //   Getting Doc ID
  // Connection to Socket
  useEffect(() => {
    const s = io(baseURL, {
      auth: { token: authtoken },
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // Document Load
  useEffect(() => {
    if (socket == null || quill == null) return;
    // Checking for unauthorized-access from Backend
    socket.once("unauthorized-access", () => {
      quill.setContents("Access not Given. Please ask owner for access");
      quill.enable(false);
    });

    socket.on("load-document", ({ data, title,isEdit }) => {
      quill.setContents(data);
      setTitle(title);
      if(isEdit){
        setEdit(true);
        quill.enable();
      }
      else{
        setEdit(false);
        quill.enable(false);
      }
    });
    const documentTitle = state?.title || "Untitled Document";
    socket.emit("get-document", { documentId: docID, title: documentTitle });
  }, [socket, quill, docID]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // Sending Quill changes to socket
  useEffect(() => {
    if (socket === null || quill === null || quill === undefined) return;

    const sender = (delta, oldDelta, source) => {
      // Making sure source is user
      if (source !== "user") {
        return;
      }
      socket.emit("send-change", delta);
    };
    quill.on("text-change", sender);

    return () => {
      quill.off("text-change", sender);
    };
  }, [socket, quill]);

  // Recieving Socket changes
  useEffect(() => {
    if (
      socket === null ||
      socket === undefined ||
      quill === null ||
      quill === undefined
    )
      return;

    const sender = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-change", sender);

    return () => {
      socket.off("receive-change", sender);
    };
  }, [socket, quill]);

  // CallBack Ref to add the text editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);
  return (
    <div>
      <Navbar title={Title} DocID={docID} edit={editAllow}/>
      <div className="DocContainer" ref={wrapperRef}></div>
    </div>
  );
}
