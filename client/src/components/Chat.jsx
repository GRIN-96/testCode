import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { messageData, messageUpdate } from "./api/Firebase";

// 내가 만든 firebase의 프로젝트의 URL 이다.
// const databaseURL = "https://test-project-c773d-default-rtdb.firebaseio.com/";

const Chat = ({ socket, room, username }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // useEffect(() => {
  //   socket.on("messageReturn", (data) => {
  //     console.log(data);
  //     setMessageList((prev) => [...prev, data]);
  //   });
  // }, [socket]);

  // firebase 내 database 메세지 정보들 실시간으로 가져오기 .
  useEffect(() => {
    // 파일 리스트 가져오기 .
    const data = messageData();
    // data.then((response) => console.log(response));
    // 데이터가 오브젝트 형식으로 오기 때문에 ex ( {1 : {name:~ , message :2~}})
    // value 값만 가져와 리스트로 만들어주는 작업이 필요하다 . // Object.value(response)
    // data.then((response) => console.log(Object.values(response)));
    data.then((response) => setMessageList(Object.values(response)));

    // 메세지를 주고 받을 때마다 화면 아래로 스크롤
    let chat = document.querySelector("#chat");
    chat.scrollTop = chat.scrollHeight;
  });

  // 소켓에 message를 담아 서버에 전달 !
  const sendMessage = async () => {
    const messageContent = {
      username: username,
      message: message,
      room: room,
      date:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    // messageContent 값이 먼저 정의 된 후 메세지 전달.
    socket.emit("message", messageContent);
    // 메세지 리스트에 방금 보낸 메세지도 함께 추가.
    // setMessageList((prev) => [...prev, messageContent]);

    // fireBase에 메세지 내용 추가
    messageUpdate(messageContent);
    setMessage("");
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-1/3 h-[600px] bg-white relative">
        <div className="w-full h-16 bg-gray-700 flex items-center p-3">
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </div>
        <div id="chat" className="w-full h-[400px] overflow-y-auto">
          {messageList &&
            messageList
              .filter((msg) => msg.room === room)
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    username === msg.username ? "flex justify-end" : ""
                  }`}
                >
                  <div
                    className={`${
                      username === msg.username ? "bg-green-600" : "bg-blue-600"
                    } w-2/3 h-auto p-2 text-white m-2 rounded-xl rounded-br-none`}
                  >
                    <div>{msg.message}</div>
                    <div className="w-full flex justify-end text-xs">
                      {msg.username}
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-3/4 h-12 border p-3 outline-none"
            type="text"
            placeholder="message send"
            onKeyDown={onKeyPress}
          />
          <button
            onClick={sendMessage}
            className="w-1/4 bg-indigo-600 text-white h-12 hover-opacity-70"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
