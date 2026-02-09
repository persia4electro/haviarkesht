import React from "react";
import "./Input.css";

export default function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
