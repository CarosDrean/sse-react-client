import './App.css';
import {useBufferedState} from "./useBufferedState";
import { EventSourcePolyfill } from 'event-source-polyfill';

let es

function App() {
  const [buffer, push] = useBufferedState(10);
  const url = "http://localhost:10000/api/v1/sse";
  const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3MjMsImVtYWlsIjoiYWouc29mdHdhcmVkZXZlbG9wZXJAZ21haWwuY29tIiwicm9sZXMiOlsxLDRdLCJzZXNzaW9uX2lkIjo3NjYzNDMsImlwX2NsaWVudCI6IjEyNy4wLjAuMSIsInVzZXJfdHlwZSI6MSwiZXhwIjoxNjE5NTQ5MDA3LCJpc3MiOiJDdXJzb3MgRUR0ZWFtIn0.OxWD3W-YUc8-Gbt3c9sUFOYfuT7Kg_CLfGgWKgB-xSyDvjkUwuUBvNnBYajs7FdxExjF09S_0Th0CzH8kVbfaGd7Vjs1CFrNVrh6WrOHbDQOFR11BEvAMBlHVkTYxyG_oLjapKobqGbf42m35yajTZo14bwPviClZV53da15WBQ'

  const handleStreamStart = () => {
    if (!es) {
      es = new EventSourcePolyfill(`${url}/subscription`, {headers: {authorization: token, 'Content-Type': 'application/json'}} );
      push("event source start");
      es.onmessage = (msg) => {
          console.log(msg)
        push(msg.data);
      };
    }
  };

  const handleStreamStop = () => {
    if (es) {
      es.close();
      push("close event source");
      es = null;
    }
  };

  const sendRequest = async (method) => {
    await fetch(`${url}/notification`, {
      body: method !== "GET" ? Math.random().toString() : null,
      method
    })
  }

  return (
      <div className="App">
        <h1>Event Streaming </h1>
        <button onClick={handleStreamStart}>Start Streaming</button>
        <button onClick={handleStreamStop}>Stop Streaming</button>
        <br />
        <br />
        <button onClick={() => sendRequest("POST")}>POST TO /log</button>
        <button onClick={() => sendRequest("GET")}>GET TO /log</button>
        <button onClick={() => sendRequest("DELETE")}>
          DELETE TO /log
        </button>
        <button onClick={() => sendRequest("PATCH")}>
          PATCH TO /log
        </button>
        <br />
        <div className="Streams">
          {buffer.map((d, i) => (
              <pre key={i + Math.random()}>{d}</pre>
          ))}
        </div>
      </div>
  );
}

export default App;
