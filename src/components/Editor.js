import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';

const Editor = ({ code, setCode, language }) => {
  return (
    <CodeMirror
      value={code}
      options={{
        mode: language === 'java' ? 'text/x-java' : language === 'python' ? 'python' : 'text/x-c++src',
        theme: 'material',
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        setCode(value);
      }}
    />
  );
};

export default Editor;
