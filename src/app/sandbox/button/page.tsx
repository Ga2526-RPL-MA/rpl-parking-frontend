import { LucideIcon, Search } from "lucide-react";

import Typography from "@/components/Typography";
import { Button, ButtonProps } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";

export default function ButtonPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] items-center justify-center py-20">
      <Typography as="h1" variant="h1" font="sans" weight="bold">
        Buttons
      </Typography>

      <div className="flex flex-wrap gap-4">
        {BUTTONS.map((button, idx) => (
          <Button
            key={idx}
            variant={button.variant}
            size={button.size}
            leftIcon={button.LeftIcon}
            rightIcon={button.RightIcon}
          >
            {button.label}
          </Button>
        ))}
      </div>

      <Typography as="h1" variant="h1" weight="bold" className="mt-10">
        Icon Buttons
      </Typography>

      <div className="flex flex-wrap gap-4">
        {ICON_BUTTONS.map((iconButton, idx) => (
          <IconButton
            key={idx}
            icon={iconButton.icon}
            variant={iconButton.variant}
          />
        ))}
      </div>
    </main>
  );
}

type ButtonData = {
  label: string;
  variant: ButtonProps["variant"] | undefined;
  size: ButtonProps["size"];
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
};

const BUTTONS: ButtonData[] = [
  {
    label: "Default",
    variant: undefined,
    size: "default",
    LeftIcon: Search,
    RightIcon: Search,
  },
  {
    label: "Destructive",
    variant: "destructive",
    size: "default",
  },
  {
    label: "Outline",
    variant: "outline",
    size: "default",
  },
  {
    label: "Secondary",
    variant: "secondary",
    size: "default",
  },
  {
    label: "Ghost",
    variant: "ghost",
    size: "default",
  },
  {
    label: "Link",
    variant: "link",
    size: "default",
  },
  {
    label: "Small",
    variant: undefined,
    size: "sm",
  },
  {
    label: "Large",
    variant: undefined,
    size: "lg",
  },
];

type IconButtonData = {
  icon: LucideIcon;
  variant: ButtonProps["variant"] | undefined;
  size: ButtonProps["size"];
};

const ICON_BUTTONS: IconButtonData[] = [
  {
    icon: Search,
    variant: "default",
    size: "default",
  },
  {
    icon: Search,
    variant: "destructive",
    size: "default",
  },
  {
    icon: Search,
    variant: "outline",
    size: "default",
  },
  {
    icon: Search,
    variant: "secondary",
    size: "default",
  },
  {
    icon: Search,
    variant: "ghost",
    size: "default",
  },
  {
    icon: Search,
    variant: "link",
    size: "default",
  },
  {
    icon: Search,
    variant: "default",
    size: "sm",
  },
  {
    icon: Search,
    variant: "default",
    size: "lg",
  },
  {
    icon: Search,
    variant: "default",
    size: "icon",
  },
];
