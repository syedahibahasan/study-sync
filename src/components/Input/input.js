import React from "react";
import InputContainer from "../InputContainer/InputContainer.js";
import styles from "./input.module.css";
const Input = React.forwardRef(
  ({ label, type, defaultValue, onChange, onBlur, name, error }, ref) => {
    const getErrorMessage = () => {
      if (!error) return "";
      if (error.message) return error.message;
      switch (error.type) {
        case "required":
          return "This Field Is Required";
        case "minLength":
          return "Field Is Too Short";
        default:
          return "*";
      }
    };

    return (
      <InputContainer label={label}>
        <input
          defaultValue={defaultValue}
          className={styles.input1}
          type={type}
          placeholder={label}
          ref={ref}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
        />
        {error && <div className={styles.error}>{getErrorMessage()}</div>}
      </InputContainer>
    );
  }
);

export default Input;
