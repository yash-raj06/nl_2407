import React from 'react';

const InputField = ({ input, setInput }) => {
  return (
    <div className="input-field">
      <label htmlFor="input">Input:</label>
      <textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input here..."
      />
    </div>
  );
};

export default InputField;
