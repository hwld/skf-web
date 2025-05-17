import { type ComponentProps, useId } from "react";

type Props = {
  label: string;
  error?: string;
} & ComponentProps<"input">;

export function TextField({ label, error, ...props }: Props) {
  const inputId = useId();
  const errorMessageId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-xs w-fit flex gap-3 items-center"
      >
        {label}
      </label>
      <div className="flex flex-col gap-1">
        <input
          {...props}
          id={inputId}
          aria-invalid={!!error}
          aria-errormessage={errorMessageId}
          className="border h-8 rounded-sm border-base-600 bg-white/5 placeholder:text-base-400 px-2 max-w-[500px] w-full aria-[invalid=true]:border-red-400 aria-[invalid=true]:outline-red-400"
        />
        <div className="h-4">
          {error ? (
            <p id={errorMessageId} className="text-red-400 text-xs">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
