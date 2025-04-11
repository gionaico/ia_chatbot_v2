import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import React, { useState } from "react";
import { FaUserSecret } from "react-icons/fa6";
import { LiaUserSecretSolid } from "react-icons/lia";

import { SiProbot } from "react-icons/si";
import { FaRobot } from "react-icons/fa";
import { GiRobotAntennas } from "react-icons/gi";

const MessageArea = ({ onSendMessage, ModelsState, setModelsState }: any) => {
  const modelSelected = ModelsState?.find((item: any) => item.selected);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = ModelsState.find((element: any) => element.selected);
    //const index = ModelsState.findIndex((element: any) => element.id === value);

    if (!data.inputText?.trim()) return alert("el input esta vacio");

    const index = parseInt(data?.id);

    setModelsState((prevItems: any) =>
      prevItems.map((item: any, i: number) => {
        const new_item =
          i === index
            ? {
                ...item,
                mesagges: [
                  ...item.mesagges,
                  { sender: "user", text: item.inputText },
                ],
                inputText: "",
                loadingIaReaponse: true,
              }
            : { ...item, loadingIaReaponse: false };
        return new_item;
      })
    );

    fetch(`http://localhost:8000/model${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: data?.inputText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setModelsState((prevItems: any) =>
          prevItems.map((item: any, i: number) => {
            const new_item =
              i === index
                ? {
                    ...item,
                    mesagges: [
                      ...item.mesagges,
                      { sender: "chat", text: data.response },
                    ],
                    inputText: "",
                    loadingIaReaponse: false,
                  }
                : { ...item, loadingIaReaponse: false };
            return new_item;
          })
        );
      })
      .catch((err) => console.error("Error al obtener datos:", err));
  };

  const handleSelectChange = (e: any) => {
    const value = e.target.value;
    //setSelected(value);
    const index = ModelsState.findIndex((element: any) => element.id === value);

    setModelsState((prevItems: any) =>
      prevItems.map((item: any, i: number) => {
        const new_item =
          i === index
            ? {
                ...item,
                loadingIaReaponse: false,
                selected: true,
                inputText: "",
              }
            : {
                ...item,
                loadingIaReaponse: false,
                selected: false,
                inputText: "",
              };
        return new_item;
      })
    );
    // Aquí haces lo que quieras con el valor seleccionado
    console.log("Seleccionaste:", value, ModelsState, index);
    // Por ejemplo: actualizar un estado global, llamar una API, etc.
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    //setSelected(value);
    const index = ModelsState.findIndex((element: any) => element.selected);

    setModelsState((prevItems: any) =>
      prevItems.map((item: any, i: number) => {
        const new_item =
          i === index
            ? { ...item, loadingIaReaponse: false, inputText: value }
            : { ...item, loadingIaReaponse: false, inputText: "" };
        return new_item;
      })
    ); //setSelected(value);
    // Aquí haces lo que quieras con el valor seleccionado
    console.log("Seleccionaste:", value);
    // Por ejemplo: actualizar un estado global, llamar una API, etc.
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full px-4 pb-4 message-input flex space-x-2 mx-auto"
    >
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2 w-full">
        <div>
          <select
            id="options"
            name="options"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handleSelectChange}
          >
            <option></option>
            {ModelsState?.map((data: any, index: number) => (
              <option
                value={data.id}
                /* selected={data.selected} */
                key={`${index}`}
              >
                {data.name}
              </option>
            ))}
          </select>
          {ModelsState?.find((data: any) => data.selected)?.length ? null : (
            <label
              htmlFor="options"
              className="pointer-events-none absolute left-7 top-2 text-xs text-gray-500 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
            >
              Selecciona un modelo
            </label>
          )}
        </div>
        <input
          type="text"
          value={ModelsState?.find((item: any) => item.selected)?.inputText}
          onChange={handleInputChange}
          placeholder={modelSelected?.placeholder}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Enviar
        </button>
      </div>
    </form>
  );
};
const LoadingText = () => {
  return (
    <div className="text-center text-gray-700 text-lg font-medium">
      Cargando<span className="animate-pulse">...</span>
    </div>
  );
};
//export default MessageArea;

const ChatWindowV0 = ({ ModelsState }: any) => {
  const modelSelected = ModelsState?.find((item: any) => item.selected);
  return (
    <div className="w-full chat-window p-4 bg-white rounded-lg shadow-lg ">
      {modelSelected?.mesagges.map((msg: any, index: number) => (
        <div
          key={index}
          className={`message ${
            msg.sender === "user" ? "bg-white" : "bg-gray-100"
          } p-2 my-2 rounded-md`}
        >
          {msg.text}
        </div>
      ))}
      {modelSelected?.loadingIaReaponse ? <LoadingText /> : null}
    </div>
  );
};
const ChatWindow = ({ ModelsState }: any) => {
  const modelSelected = ModelsState?.find((item: any) => item.selected);

  return (
    <div className="w-full chat-window p-4 bg-white rounded-lg shadow-lg">
      {modelSelected?.mesagges.map((msg: any, index: number) => {
        const isUser = msg.sender === "user";
        const isChat = msg.sender === "chat";

        return (
          <div
            key={index}
            className={`flex items-start my-5 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            {/* Icono de robot a la izquierda */}
            {isChat && (
              <FaRobot className="w-6 h-6 text-purple-500 mr-2 mt-1" />
            )}

            {/* Mensaje */}
            <div
              className={`max-w-2xl p-3 rounded-lg shadow-sm ${
                isUser ? "bg-blue-100 text-right" : "bg-gray-100"
              }`}
            >
              {msg.text}
            </div>

            {/* Icono de usuario a la derecha */}
            {isUser && (
              <FaUserSecret className="w-6 h-6 text-blue-600 ml-2 mt-1" />
            )}
          </div>
        );
      })}

      {modelSelected?.loadingIaReaponse && <LoadingText />}
    </div>
  );
};

//export default ChatWindow;

export function Welcome() {
  //const { messages, addMessage } = useChat();
  const [ModelsState, setModelsState] = useState([
    {
      id: "0",
      description:
        "Modelo que a través de un input de entrada intenta predecir el texto que sigue a continuación.",
      name: "Chart Model",
      placeholder:
        "Por favor introduce el texto que quieres que el modelo contiue.",
      inputText: "",
      selected: false,
      loadingIaReaponse: false,
      mesagges: [],
    },
    {
      id: "1",
      description:
        "Modelo que a través de un input de entrada intenta clasificarlo.",
      name: "Sentiments Model",
      placeholder:
        "Por favor introduce el texto que quieres que el modelo clasifique.",
      inputText: "",
      selected: false,
      loadingIaReaponse: false,
      mesagges: [],
    },
    {
      id: "2",
      description:
        "Modelo Gp2 al que se le a aplicado un Fine Tuning para que de mas peso unos textos concretos de una tematica.",
      name: "Gp2 Fine Tuning Model",
      placeholder: "En que podemos ayudarte.",
      inputText: "",
      selected: false,
      loadingIaReaponse: false,
      mesagges: [],
    },
  ]);

  const handleSendMessage = async (message: any) => {
    /* addMessage(message, 'user');
    const reply = await sendMessage(message);
    addMessage(reply, 'bot'); */
    console.log(message);
  };

  return (
    <div className="flex flex-col gap-2 p-4 min-h-screen">
      <h1 className="text-center text-xl p-4">
        Chatbot:{" "}
        <strong>
          {ModelsState?.find((item: any) => item.selected)?.name || ""}{" "}
        </strong>
      </h1>
      <h2>
        <p className="text-center">
          {ModelsState?.find((item: any) => item.selected)?.description || ""}
        </p>
      </h2>
      <ChatWindow
        ModelsState={ModelsState}
        /* messages={
          ModelsState?.find((item: any) => item.selected)?.mesagges || []
        } */
        /* [ { sender: "user", text: "text1" },
        { sender: "chat", text: "messages2" },
      ] */
      />
      <MessageArea
        ModelsState={ModelsState}
        setModelsState={setModelsState}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
