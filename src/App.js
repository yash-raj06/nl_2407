import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "./components/Editor";
import Output from "./components/Output";
import LanguageSelector from "./components/LanguageSelector";
import SdkModal from "./components/SdkModal";
import "./App.css";

const App = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [interactive, setInteractive] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sdks, setSdks] = useState([]);

  useEffect(() => {
    const getRuntimes = async () => {
      try {
        const response = await axios.get(
          "https://emkc.org/api/v2/piston/runtimes"
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getRuntimes();
  }, []);

  const getLanguageVersion = (lang) => {
    switch (lang) {
      case "python":
        return "3.10.0";
      case "cpp":
        return "10.2.0";
      case "java":
        return "15.0.2";
      default:
        return "latest";
    }
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setError("");
    setOutput("");

    const files = [
      {
        name: `main.${
          language === "python" ? "py" : language === "java" ? "java" : "cpp"
        }`,
        content: code,
      },
    ];

    const config = {
      method: "post",
      url: "https://emkc.org/api/v2/piston/execute",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        language: language,
        version: getLanguageVersion(language),
        files: files,
        stdin: input,
      },
    };

    try {
      console.log("Request Config:", config);
      const response = await axios(config);
      console.log("Response Data:", response.data);
      setIsLoading(false);
      handleOutput(
        response.data.run.stdout ||
          response.data.run.stderr ||
          "No output received"
      );
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error("Error Response:", err.response);
        setError(
          `Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        );
      } else if (err.request) {
        console.error("Error Request:", err.request);
        setError("Error: No response received from server");
      } else {
        console.error("Error Message:", err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleOutput = (output) => {
    setOutput((prevOutput) => prevOutput + "\n" + output);
    if (output.includes("Enter")) {
      setInteractive(true);
    } else {
      setInteractive(false);
    }
  };

  const handleInput = async () => {
    setIsLoading(true);
    setError("");

    const config = {
      method: "post",
      url: "https://emkc.org/api/v2/piston/execute",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        language: language,
        version: getLanguageVersion(language),
        files: [
          {
            name: `main.${
              language === "python"
                ? "py"
                : language === "java"
                ? "java"
                : "cpp"
            }`,
            content: code,
          },
        ],
        stdin: currentInput,
      },
    };

    try {
      console.log("Request Config:", config);
      const response = await axios(config);
      console.log("Response Data:", response.data);
      setIsLoading(false);
      handleOutput(
        response.data.run.stdout ||
          response.data.run.stderr ||
          "No output received"
      );
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error("Error Response:", err.response);
        setError(
          `Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`
        );
      } else if (err.request) {
        console.error("Error Request:", err.request);
        setError("Error: No response received from server");
      } else {
        console.error("Error Message:", err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    const newSdk = {
      name: language,
      language: language,
      code: code,
      description: description,
    };

    try {
      await axios.post("http://localhost:5000/api/sdks", newSdk);
      alert("SDK saved successfully");
      setCode("");
      setLanguage("cpp");
      setOutput("");
      setInput("");
      setDescription("");
    } catch (error) {
      console.error("Error adding SDK:", error);
      setError("Error adding SDK");
    }
  };

  const fetchSdks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sdks");
      setSdks(response.data);
    } catch (error) {
      console.log("Error fetching SDKs:", error);
    }
  };

  const handleShowSdks = () => {
    fetchSdks();
    setShowModal(true);
  };

  return (
    <div className="App">
      <button className="show-sdks-btn" onClick={handleShowSdks}>
        Show SDKs
      </button>
      <h1>Online IDE</h1>
      <LanguageSelector setLanguage={setLanguage} />
      <Editor code={code} setCode={setCode} language={language} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for the program"
      />
      <button onClick={handleCompile} disabled={isLoading}>
        {isLoading ? "Running..." : "Run"}
      </button>
      {interactive && (
        <div>
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter input"
          />
          <button onClick={handleInput} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Input"}
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <Output output={output} />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description for the SDK"
      />
      <button onClick={handleSave}>Save</button>
      {showModal && (
        <SdkModal sdks={sdks} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default App;

/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './components/Editor';
import Output from './components/Output';
import LanguageSelector from './components/LanguageSelector';
import './App.css';

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interactive, setInteractive] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [description, setDescription] = useState(''); // New state for description

  useEffect(() => {
    const getRuntimes = async () => {
      try {
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getRuntimes();
  }, []);

  const getLanguageVersion = (lang) => {
    switch(lang) {
      case 'python':
        return '3.10.0';
      case 'cpp':
        return '10.2.0';
      case 'java':
        return '15.0.2';
      default:
        return 'latest';
    }
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    const files = [
      {
        name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`,
        content: code,
      }
    ];

    const config = {
      method: 'post',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        language: language,
        version: getLanguageVersion(language),
        files: files,
        stdin: input,
      },
    };

    try {
      console.log('Request Config:', config);
      const response = await axios(config);
      console.log('Response Data:', response.data);
      setIsLoading(false);
      handleOutput(response.data.run.stdout || response.data.run.stderr || 'No output received');
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error('Error Response:', err.response);
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error('Error Request:', err.request);
        setError('Error: No response received from server');
      } else {
        console.error('Error Message:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleOutput = (output) => {
    setOutput((prevOutput) => prevOutput + '\n' + output);
    if (output.includes('Enter')) {
      setInteractive(true);
    } else {
      setInteractive(false);
    }
  };

  const handleInput = async () => {
    setIsLoading(true);
    setError('');

    const config = {
      method: 'post',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        language: language,
        version: getLanguageVersion(language),
        files: [
          {
            name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`,
            content: code,
          }
        ],
        stdin: currentInput,
      },
    };

    try {
      console.log('Request Config:', config);
      const response = await axios(config);
      console.log('Response Data:', response.data);
      setIsLoading(false);
      handleOutput(response.data.run.stdout || response.data.run.stderr || 'No output received');
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error('Error Response:', err.response);
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error('Error Request:', err.request);
        setError('Error: No response received from server');
      } else {
        console.error('Error Message:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    const sdky= language === 'python' ? 'PyCharm' : language === 'java' ? 'JDK' : 'Mingw';
    const newSdk = {
      name: sdky,
      language: language,
      code: code,
      description: description,
    };
    
    try {
      await axios.post('http://localhost:5000/api/sdks', newSdk);
      alert('SDK saved successfully');
    } catch (error) {
      console.error('Error adding SDK:', error);
      setError('Error adding SDK');
    }
  };

  return (
    <div className="App">
      <h1>Online IDE</h1>
      <LanguageSelector setLanguage={setLanguage} />
      <Editor code={code} setCode={setCode} language={language} />
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for the program"
      />
      <button onClick={handleCompile} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run'}
      </button>
      {interactive && (
        <div>
          <textarea 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter input"
          />
          <button onClick={handleInput} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Input'}
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <Output output={output} />
      <textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description for the SDK"
      />
      <button onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default App;
 */

/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './components/Editor';
import Output from './components/Output';
import LanguageSelector from './components/LanguageSelector';
import './App.css';

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState(''); // New state for input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interactive, setInteractive] = useState(false); // State to handle interactive mode
  const [currentInput, setCurrentInput] = useState(''); // Current input from user

  useEffect(() => {
    const getRuntimes = async () => {
      try {
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getRuntimes();
  }, []);

  const getLanguageVersion = (lang) => {
    switch(lang) {
      case 'python':
        return '3.10.0'; // Use a specific supported version
      case 'cpp':
        return '10.2.0'; // Use a specific supported version
      case 'java':
        return '15.0.2'; // Use a specific supported version
      default:
        return 'latest';
    }
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    const files = [
      {
        name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`,
        content: code,
      }
    ];

    const config = {
      method: 'post',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        language: language,
        version: getLanguageVersion(language), // Specify the version based on language
        files: files,
        stdin: input, // Include user input
      },
    };

    try {
      console.log('Request Config:', config); // Add this line
      const response = await axios(config);
      console.log('Response Data:', response.data); // Add this line
      setIsLoading(false);
      handleOutput(response.data.run.stdout || response.data.run.stderr || 'No output received');
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        // Server responded with a status other than 200 range
        console.error('Error Response:', err.response);
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('Error Request:', err.request);
        setError('Error: No response received from server');
      } else {
        // Something else happened while setting up the request
        console.error('Error Message:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleOutput = (output) => {
    setOutput((prevOutput) => prevOutput + '\n' + output);
    if (output.includes('Enter')) { // Detect if output is prompting for input
      setInteractive(true);
    } else {
      setInteractive(false);
    }
  };

  const handleInput = async () => {
    setIsLoading(true);
    setError('');
    
    const config = {
      method: 'post',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        language: language,
        version: getLanguageVersion(language),
        files: [
          {
            name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`,
            content: code,
          }
        ],
        stdin: currentInput, // Send the current user input
      },
    };

    try {
      console.log('Request Config:', config);
      const response = await axios(config);
      console.log('Response Data:', response.data);
      setIsLoading(false);
      handleOutput(response.data.run.stdout || response.data.run.stderr || 'No output received');
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error('Error Response:', err.response);
        setError(`Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error('Error Request:', err.request);
        setError('Error: No response received from server');
      } else {
        console.error('Error Message:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="App">
      <h1>Online IDE</h1>
      <LanguageSelector setLanguage={setLanguage} />
      <Editor code={code} setCode={setCode} language={language} />
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for the program"
      />
      <button onClick={handleCompile} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run'}
      </button>
      {interactive && (
        <div>
          <textarea 
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter input"
          />
          <button onClick={handleInput} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Input'}
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <Output output={output} />
      <button>
        'Save'
      </button>
    </div>
  );
};

export default App;
 */
