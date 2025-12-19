import "./TextField.css";

const TextField = ({
  // Basic input props
  label,
  placeholder,
  value = "",
  maxLength,
  type = "text",
  id,
  required = false,
  disabled = false,
  pattern,
  
  // Event handlers (parent handles all logic)
  onChange,
  onFocus,
  onBlur,
  
  // Additional classNames (base classes are hardcoded, these are appended)
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  prefixClassName = "",
  footerClassName = "",
  errorContainerClassName = "",
  errorClassName = "",
  counterClassName = "",
  
  // Prefix (parent controls when to show)
  prefix,
  showPrefix = false,
  
  // Icons (parent controls when to show)
  showErrorIcon = false,
  showValidIcon = false,
  
  // Error message (parent passes the message to display)
  errorMessage,
  
  // Counter (parent calculates and passes the text)
  counterText,
  
  // Other props
  ...rest
}) => {
  // Base class names are hardcoded, additional classes are merged
  const containerClass = `input-field-container ${containerClassName}`.trim();
  const labelClass = `input-field-label ${labelClassName}`.trim();
  const inputClass = `input-field ${inputClassName}`.trim();
  const prefixClass = `input-field-prefix ${prefixClassName}`.trim();
  const footerClass = `input-field-footer ${footerClassName}`.trim();
  const errorContainerClass = `input-field-error-container ${errorContainerClassName}`.trim();
  const errorClass = `input-field-error ${errorClassName}`.trim();
  const counterClass = `input-field-counter ${counterClassName}`.trim();
  
  return (
    <>
      <div className={containerClass}>
        <label htmlFor={id} className={labelClass}>
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
        <div className="input-field-input-wrapper">
          {showPrefix && prefix && (
            <span className={prefixClass}>
              {prefix}
            </span>
          )}
          <input
            type={type}
            id={id}
            className={inputClass}
            value={value}
            maxLength={maxLength}
            pattern={pattern}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange && onChange(e.target.value)}
            onFocus={() => onFocus && onFocus()}
            onBlur={() => onBlur && onBlur()}
            {...rest}
          />
        </div>
        {/* Error icon - parent controls when to show */}
        {showErrorIcon && (
          <svg
            rpl=""
            className="trailing-icon invalid"
            fill="currentColor"
            height="20"
            icon-name="error-outline"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
          </svg>
        )}
        {/* Valid checkmark - parent controls when to show */}
        {showValidIcon && (
          <svg
            rpl=""
            className="trailing-icon valid"
            fill="currentColor"
            height="20"
            icon-name="checkmark-fill"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.09 15.84c-.23 0-.46-.09-.64-.26L1.3 10.42a.9.9 0 010-1.27.9.9 0 011.27 0l4.52 4.52L17.5 3.26a.9.9 0 011.27 0 .9.9 0 010 1.27L7.73 15.58c-.18.18-.41.26-.64.26z"></path>
          </svg>
        )}
      </div>
      <div className={footerClass}>
        {/* Error message - parent passes the message */}
        {errorMessage && (
          <div className={errorContainerClass}>
            <svg
              rpl=""
              className="error-icon"
              fill="currentColor"
              height="20"
              icon-name="error-outline"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.21 13.5a1.21 1.21 0 11-2.42 0 1.21 1.21 0 012.42 0zM19 10c0-4.963-4.038-9-9-9s-9 4.037-9 9 4.038 9 9 9 9-4.037 9-9zm-1.801 0c0 3.97-3.229 7.2-7.199 7.2-3.97 0-7.199-3.23-7.199-7.2S6.03 2.8 10 2.8c3.97 0 7.199 3.23 7.199 7.2zm-6.441 1.24l.242-6H9l.242 6h1.516z"></path>
            </svg>
            <p className={errorClass}>{errorMessage}</p>
          </div>
        )}
        {/* Counter - parent passes the text */}
        {counterText && (
          <span className={counterClass}>
            {counterText}
          </span>
        )}
      </div>
    </>
  );
};

export default TextField;