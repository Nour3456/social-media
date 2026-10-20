import type { InputProps } from "../types/inputProps";

export function getInputProps(
  type: string = "text",
  label?: string,
): InputProps {
  return {
    variant: "bordered",
    type: type,
    label: label,
  };
}

export function getAge(value: string) {
  const birthDate = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
