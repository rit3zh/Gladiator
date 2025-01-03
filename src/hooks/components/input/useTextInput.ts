import { useState } from "react";

interface UseTextInputReturn {
  value: string;
  onChangeText: (text: string) => void;
  reset: () => void;
}

const useTextInput = <T extends string>(
  initialValue: T
): UseTextInputReturn => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChangeText = (text: string) => {
    setValue(text);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    onChangeText: handleChangeText,
    reset,
  };
};

export default useTextInput;
