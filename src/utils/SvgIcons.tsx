// Thin wrappers around @heroicons/react so the whole app uses one icon set.
//
// Historically these were hand-pasted SVG paths (copied from Heroicons). They
// now re-export the real Heroicons components under the app's existing names,
// preserving each icon's original size/style classes so call sites and their
// rendered output stay identical. Each wrapper forwards props, so callers can
// override className or pass aria-* when needed while keeping a sensible
// default.
//
// "solid" vs "outline" is chosen per icon to match how each one looked before
// the consolidation (filled glyphs came from solid, stroked glyphs from
// outline).

import type { ComponentProps } from "react";
import {
  PlusCircleIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowLeftCircleIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  PencilSquareIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowRightIcon,
  CheckIcon as HeroCheckIcon,
} from "@heroicons/react/24/solid";

type IconProps = ComponentProps<"svg">;

export const AddIcon = ({ className = "size-6", ...props }: IconProps) => (
  <PlusCircleIcon className={className} {...props} />
);

export const EditIcon = ({ className = "size-5", ...props }: IconProps) => (
  <PencilSquareIcon className={className} {...props} />
);

export const DeleteIcon = ({ className = "size-5", ...props }: IconProps) => (
  <TrashIcon className={className} {...props} />
);

export const QuestionMarkIcon = ({
  className = "size-4",
  ...props
}: IconProps) => <QuestionMarkCircleIcon className={className} {...props} />;

export const PhoneIcon = ({
  className = "h-[1em] opacity-50",
  ...props
}: IconProps) => <DevicePhoneMobileIcon className={className} {...props} />;

export const EmailIcon = ({
  className = "h-[1em] opacity-50",
  ...props
}: IconProps) => <EnvelopeIcon className={className} {...props} />;

export const GearIcon = ({ className = "size-6", ...props }: IconProps) => (
  <Cog6ToothIcon className={className} {...props} />
);

export const LogoutIcon = ({ className = "size-6", ...props }: IconProps) => (
  <ArrowRightStartOnRectangleIcon className={className} {...props} />
);

export const BackIcon = ({ className = "size-6", ...props }: IconProps) => (
  <ArrowLeftCircleIcon className={className} {...props} />
);

export const WarningIcon = ({
  className = "h-6 w-6 shrink-0 stroke-current",
  ...props
}: IconProps) => <ExclamationTriangleIcon className={className} {...props} />;

export const RightArrowIcon = ({
  className = "size-5",
  ...props
}: IconProps) => <ArrowRightIcon className={className} {...props} />;

export const CheckIcon = ({
  className = "flex-shrink-0 w-5 h-5 text-primary",
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps) => (
  <HeroCheckIcon className={className} aria-hidden={ariaHidden} {...props} />
);

export const MenuIcon = ({
  className = "h-5 w-5",
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps) => (
  <Bars3Icon className={className} aria-hidden={ariaHidden} {...props} />
);

export const OverflowIcon = ({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps) => (
  <EllipsisVerticalIcon className={className} aria-hidden={ariaHidden} {...props} />
);
