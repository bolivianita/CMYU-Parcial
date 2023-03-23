import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ServiceBusClient } from "@azure/service-bus";

//falta coneccion
const connectionString = "  ";
const queueName = " ";
const sbClient = new ServiceBusClient(connectionString);
const queueClient = sbClient.createQueueClient(queueName);

function App() {
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState("");

  const sender = queueClient.createSender();

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const messageBody = {
      body: message,
    };
    await sender.send(messageBody);
    setMessage("");
  };  

  useEffect(() => {
    const receiver = queueClient.createReceiver();
    const messages = [];
    const messageHandler = async (msg) => {
      messages.push(msg.body);
      setQueue(messages);
      await receiver.completeMessage(msg);
    };
    receiver.registerMessageHandler(messageHandler);
    return () => {
      receiver.close();
    };
  }, []);

  return (
    <div>
      <h1>Cola transaccional </h1>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Mandar Mensaje</button>
      </form>
      {queue.map((message, index) => (
        <div key={index}>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

