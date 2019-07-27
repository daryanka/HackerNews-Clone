import React, { useState, useEffect } from "react";
import { EventEmitter } from "events";

function useFormValidation(initialState, validate, authenticate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmiting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmiting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        console.log("Authenticated");
        authenticate();
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = event => {
    event.persist();
    setValues(prevVal => {
      return {
        ...prevVal,
        [event.target.name]: event.target.value
      };
    });
  };

  const handleBlur = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    console.log(validationErrors);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
    console.log(validationErrors);
  };

  return {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmiting
  };
}

export default useFormValidation;
