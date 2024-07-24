import React from "react";
import "./SdkModal.css";

const SdkModal = ({ sdks, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <center>
          <h2>Available SDKs</h2>
        </center>
        <ul className="sdk-list">
          {sdks.map((sdk, index) => (
            <li key={sdk._id} className="sdk-item">
              <div className="sdk-item-content">
                <h3>
                  {index + 1} - {sdk.name}
                </h3>
                <p>
                  <b>Language: </b>
                  {sdk.language}
                </p>
                <p style={{margin:"0px"}}><b>Code:</b></p>
                <pre> {sdk.code}</pre>
                <p><b>Description:</b> {sdk.description}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* <h2>SDKs</h2>
        <ul>
          {sdks.map((sdk) => (
            <li key={sdk._id}>
              <h3>{sdk.name} ({sdk.language})</h3>
              <pre>{sdk.code}</pre>
              <p>{sdk.description}</p>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default SdkModal;
