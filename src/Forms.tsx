import React from 'react'

interface InputProps extends
  React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

interface TextAreaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

interface ButtonProps extends
  React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement> {
  label?: string
}

export function InputField({ label, ...inputProps }: InputProps): JSX.Element {
  const modifiedProps = {...inputProps, 
    placeholder: inputProps.placeholder ?? `${label}...`
  }
  return (
    <>
      <label htmlFor={inputProps.name}>{label ?? inputProps.name ?? "Data"}: </label>
      <input {...modifiedProps} ></input>
    </>
  )
}

export function TextAreaField({ label, ...textAreaProps }: TextAreaProps): JSX.Element {
  return (
    <>
      <label htmlFor={textAreaProps.name}>{label ?? textAreaProps.name ?? "Data"}: </label>
      <textarea {...textAreaProps}></textarea>
    </>
  )
}

export function Button({ label, ...buttonProps }: ButtonProps): JSX.Element {
  return (<button {...buttonProps}>
    {label ?? "Submit"}
  </button>)
}