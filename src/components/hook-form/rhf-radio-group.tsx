import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn, Radio, RadioGroup, RadioGroupProps } from "@nextui-org/react";

// ----------------------------------------------------------------------

type Props = RadioGroupProps & {
  name: string;
  label: string;
  options: { value: string | number; label: string; description?: string }[];
};

// ----------------------------------------------------------------------

export default function RHFRadioGroup({
  name,
  label,
  options,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioGroup label={label} {...field} {...other}>
          {options.map((option) => (
            <CustomRadio
              key={option.value}
              description={option?.description || ""}
              value={option.value}
              isSelected={field.value === option.value}
            >
              {option.label}
            </CustomRadio>
          ))}
        </RadioGroup>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export const CustomRadio = (props: any) => {
  const { children, isSelected, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "m-0 bg-content1 hover:bg-content2 items-center justify-center text-center",
          "cursor-pointer rounded-lg gap-4 px-4 py-2 border-1 max-w-none grow",
          "data-[selected=true]:bg-secondaryT-main rounded-sm",
        ),
        label: isSelected && "text-white text-base",
        description: "justify-center" && isSelected && "text-slate-200",
        wrapper: "hidden",
      }}
    >
      {children}
    </Radio>
  );
};
