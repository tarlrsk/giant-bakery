import React from "react";

const Denied = () => {
  return (
    <div className="w3-display-middle">
      <h1 className="w3-jumbo w3-animate-top w3-center">
        <code>Access Denied</code>
      </h1>
      <h3 className="w3-center w3-animate-right">
        You dont have permission to view this site.
      </h3>
      <h6 className="w3-center w3-animate-zoom">
        <strong>Error Code</strong>: 403 forbidden
      </h6>
    </div>
  );
};

export default Denied;
