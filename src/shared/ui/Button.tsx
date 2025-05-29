interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  styleType: "primary" | "ghost";
  label: string | React.ReactNode;
}

export default function Button({
  label,
  styleType,
  className,
  ...props
}: IButtonProps) {
  const buttonStyle = {
    primary: "border bg-[#4880EE] cursor-pointer text-white border-transparent",
    ghost: "border bg-[#F2F4F6] cursor-pointer border-transparent",
  };

  return (
    <button
      className={`${buttonStyle[styleType]} rounded-lg py-4 font-medium box-border ${className}`}
      {...props}
    >
      <div className="block break-all whitespace-nowrap">{label}</div>
    </button>
  );
}
