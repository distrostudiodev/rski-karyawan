import { ButtonProps } from "@chakra-ui/react";
import { Interface__SelectOption } from "../../../../constant/interfaces";
import { optionsAgama } from "../../../../constant/selectOptions";
import SingleSelectDrawer from "../SingleSelectDrawer";

interface Props extends ButtonProps {
  id: string;
  name: string;
  onConfirm: (inputValue: Interface__SelectOption | undefined) => void;
  inputValue: Interface__SelectOption | undefined;
  withSearch?: boolean;
  optionsDisplay?: "list" | "chip";
  isError?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  placeholder?: string;
  nonNullable?: boolean;
}

export default function SelectAgama({
  id,
  name,
  onConfirm,
  inputValue,
  withSearch,
  optionsDisplay,
  isError,
  placement = "bottom",
  placeholder,
  nonNullable,
  ...props
}: Props) {
  return (
    <SingleSelectDrawer
      id={id}
      name={name}
      options={optionsAgama}
      onConfirm={onConfirm}
      inputValue={inputValue}
      withSearch={withSearch}
      optionsDisplay={optionsDisplay}
      isError={isError}
      placement={placement}
      placeholder={placeholder}
      nonNullable={nonNullable}
      {...props}
    />
  );
}
