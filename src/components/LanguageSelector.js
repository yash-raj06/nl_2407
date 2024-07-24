import React from 'react';

const LanguageSelector = ({ setLanguage }) => (
  <select onChange={(e) => setLanguage(e.target.value)}>
    <option value="cpp">C++</option>
    <option value="java">Java</option>
    <option value="python">Python</option>
  </select>
);

export default LanguageSelector;
