// import React, { useState } from 'react';
// import './TextField.css';

// const TextField = ({ 
//   label, 
//   type = "text", 
//   value, 
//   onChange, 
//   required = false 
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
  
//   const hasValue = value && value.length > 0;
//   const isFloating = isFocused || hasValue;

//   return (
//     <div className="text-field-container">
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         className="text-field-input"
//       />
//       <label className={`text-field-label ${isFloating ? 'floating' : ''}`}>
//         {label}
//         {required && <span className="required-asterisk">*</span>}
//       </label>
//     </div>
//   );
// };

// export default TextField;

import React, { useState } from 'react';
import './TextField.css';

const TextField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  validator,          // <-- new
  errorMessage        // <-- new
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  const isValid = validator ? validator(value) : true;
  const showError = isTouched && !isValid;

  return (
    <div className={`text-field-container ${showError ? "error" : ""}`}>
      <div className="text-field-inner">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e);
          if (!isTouched) setIsTouched(true);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setIsTouched(true);
        }}
        className={`text-field-input ${isFocused ? "focused" : ""}`}
      />

      <label className={`text-field-label ${isFloating ? 'floating' : ''}`}>
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      {showError && (
        <p className="text-field-error">{errorMessage}</p>
      )}
    </div>
    </div>
  );
};

export default TextField;
