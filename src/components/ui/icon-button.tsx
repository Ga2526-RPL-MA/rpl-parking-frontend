import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

type IconButtonProps = {
  icon: LucideIcon;
} & Pick<ButtonProps, "variant" | "size" | "asChild"> &
  React.ComponentProps<"button">;

export default function IconButton({
  icon: Icon,
  ...buttonProps
}: IconButtonProps) {
  return (
    <Button {...buttonProps}>
      <Icon />
    </Button>
  );
}
