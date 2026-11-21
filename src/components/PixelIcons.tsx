import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function PixelIconBase({ className = 'w-4 h-4', children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PixelSun(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="1" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="5" y="5" width="6" height="6" />
    </PixelIconBase>
  );
}

export function PixelMoon(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="6" y="2" width="4" height="1" />
      <rect x="4" y="3" width="4" height="1" />
      <rect x="3" y="4" width="3" height="2" />
      <rect x="2" y="6" width="3" height="4" />
      <rect x="3" y="10" width="3" height="2" />
      <rect x="4" y="12" width="5" height="1" />
      <rect x="6" y="13" width="6" height="1" />
      <rect x="9" y="12" width="4" height="1" />
      <rect x="11" y="11" width="2" height="1" />
    </PixelIconBase>
  );
}

export function PixelMenu(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="3" width="12" height="2" />
      <rect x="2" y="7" width="12" height="2" />
      <rect x="2" y="11" width="12" height="2" />
    </PixelIconBase>
  );
}

export function PixelClose(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelArrowUpRight(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="3" width="8" height="2" />
      <rect x="11" y="5" width="2" height="6" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelArrowRight(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="7" width="10" height="2" />
      <rect x="8" y="3" width="2" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="10" y="9" width="2" height="2" />
      <rect x="8" y="11" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelCpu(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="1" width="2" height="2" />
      <rect x="9" y="1" width="2" height="2" />
      <rect x="5" y="13" width="2" height="2" />
      <rect x="9" y="13" width="2" height="2" />
      <rect x="1" y="5" width="2" height="2" />
      <rect x="1" y="9" width="2" height="2" />
      <rect x="13" y="5" width="2" height="2" />
      <rect x="13" y="9" width="2" height="2" />
      <rect x="3" y="3" width="10" height="2" />
      <rect x="3" y="11" width="10" height="2" />
      <rect x="3" y="5" width="2" height="6" />
      <rect x="11" y="5" width="2" height="6" />
      <rect x="6" y="6" width="4" height="4" />
    </PixelIconBase>
  );
}

export function PixelCompass(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="1" width="6" height="2" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelLayers(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="6" y="2" width="4" height="2" />
      <rect x="4" y="4" width="8" height="2" />
      <rect x="2" y="6" width="12" height="2" />
      <rect x="4" y="9" width="8" height="2" />
      <rect x="2" y="11" width="12" height="2" />
      <rect x="5" y="13" width="6" height="1" />
    </PixelIconBase>
  );
}

export function PixelUsers(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="3" width="4" height="4" />
      <rect x="2" y="8" width="8" height="2" />
      <rect x="1" y="10" width="10" height="3" />
      <rect x="10" y="4" width="3" height="3" />
      <rect x="10" y="8" width="4" height="2" />
      <rect x="12" y="10" width="3" height="3" />
    </PixelIconBase>
  );
}

export function PixelShieldCheck(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="2" width="10" height="2" />
      <rect x="2" y="4" width="2" height="5" />
      <rect x="12" y="4" width="2" height="5" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="11" y="9" width="2" height="2" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="9" y="5" width="2" height="4" />
    </PixelIconBase>
  );
}

export function PixelGlobe(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="1" width="6" height="2" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="7" y="3" width="2" height="10" />
    </PixelIconBase>
  );
}

export function PixelPlus(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="2" width="2" height="12" />
      <rect x="2" y="7" width="12" height="2" />
    </PixelIconBase>
  );
}

export function PixelSearch(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="2" width="5" height="2" />
      <rect x="2" y="4" width="2" height="5" />
      <rect x="9" y="4" width="2" height="5" />
      <rect x="4" y="9" width="5" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="13" y="13" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelBrain(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="2" width="3" height="2" />
      <rect x="9" y="2" width="3" height="2" />
      <rect x="2" y="4" width="5" height="4" />
      <rect x="9" y="4" width="5" height="4" />
      <rect x="3" y="8" width="4" height="4" />
      <rect x="9" y="8" width="4" height="4" />
      <rect x="5" y="12" width="2" height="2" />
      <rect x="9" y="12" width="2" height="2" />
      <rect x="7" y="4" width="2" height="8" opacity="0.45" />
    </PixelIconBase>
  );
}

export function PixelSparkles(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="1" width="2" height="14" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="5" y="5" width="6" height="6" />
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelCheckCircle(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="1" width="6" height="2" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="7" y="10" width="2" height="2" />
      <rect x="9" y="6" width="2" height="4" />
    </PixelIconBase>
  );
}

export function PixelRotateCcw(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="3" width="2" height="5" />
      <rect x="2" y="6" width="5" height="2" />
      <rect x="5" y="2" width="6" height="2" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="12" y="6" width="2" height="4" />
      <rect x="11" y="10" width="2" height="2" />
      <rect x="5" y="12" width="6" height="2" />
      <rect x="3" y="10" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelEdit(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="10" y="2" width="2" height="2" />
      <rect x="12" y="4" width="2" height="2" />
      <rect x="8" y="4" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="4" y="8" width="2" height="2" />
      <rect x="6" y="10" width="2" height="2" />
      <rect x="2" y="10" width="2" height="4" />
      <rect x="4" y="12" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelTrash(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="5" y="1" width="6" height="2" />
      <rect x="2" y="3" width="12" height="2" />
      <rect x="3" y="5" width="2" height="9" />
      <rect x="11" y="5" width="2" height="9" />
      <rect x="5" y="12" width="6" height="2" />
      <rect x="6" y="6" width="1" height="5" />
      <rect x="9" y="6" width="1" height="5" />
    </PixelIconBase>
  );
}

export function PixelCheckSquare(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="12" width="12" height="2" />
      <rect x="2" y="4" width="2" height="8" />
      <rect x="12" y="4" width="2" height="8" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="9" y="6" width="2" height="3" />
    </PixelIconBase>
  );
}

export function PixelSquare(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="12" width="12" height="2" />
      <rect x="2" y="4" width="2" height="8" />
      <rect x="12" y="4" width="2" height="8" />
    </PixelIconBase>
  );
}

export function PixelCalendar(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="4" y="1" width="2" height="2" />
      <rect x="10" y="1" width="2" height="2" />
      <rect x="2" y="3" width="12" height="3" />
      <rect x="2" y="6" width="2" height="8" />
      <rect x="12" y="6" width="2" height="8" />
      <rect x="2" y="12" width="12" height="2" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="9" y="8" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelMessageSquare(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="4" width="2" height="7" />
      <rect x="12" y="4" width="2" height="7" />
      <rect x="2" y="10" width="12" height="2" />
      <rect x="3" y="12" width="3" height="2" />
      <rect x="5" y="6" width="6" height="2" />
    </PixelIconBase>
  );
}

export function PixelSend(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="4" height="2" />
      <rect x="6" y="4" width="4" height="2" />
      <rect x="10" y="6" width="4" height="4" />
      <rect x="6" y="10" width="4" height="2" />
      <rect x="2" y="12" width="4" height="2" />
      <rect x="4" y="7" width="6" height="2" />
    </PixelIconBase>
  );
}

export function PixelBookmark(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="2" width="10" height="2" />
      <rect x="3" y="4" width="2" height="10" />
      <rect x="11" y="4" width="2" height="10" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelBookmarkCheck(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="3" y="2" width="10" height="9" />
      <rect x="3" y="11" width="3" height="3" />
      <rect x="10" y="11" width="3" height="3" />
      <rect x="6" y="11" width="4" height="1" />
    </PixelIconBase>
  );
}

export function PixelBarChart(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="9" width="3" height="5" />
      <rect x="6" y="5" width="3" height="9" />
      <rect x="10" y="2" width="3" height="12" />
      <rect x="1" y="14" width="14" height="1" />
    </PixelIconBase>
  );
}

export function PixelFolderKanban(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="1" y="3" width="6" height="2" />
      <rect x="1" y="5" width="14" height="2" />
      <rect x="1" y="7" width="2" height="6" />
      <rect x="13" y="7" width="2" height="6" />
      <rect x="1" y="12" width="14" height="2" />
      <rect x="4" y="8" width="2" height="3" />
      <rect x="7" y="8" width="2" height="2" />
      <rect x="10" y="8" width="2" height="3" />
    </PixelIconBase>
  );
}

export function PixelSettings(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="1" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="5" y="4" width="6" height="2" />
      <rect x="5" y="10" width="6" height="2" />
      <rect x="4" y="5" width="2" height="6" />
      <rect x="10" y="5" width="2" height="6" />
    </PixelIconBase>
  );
}

export function PixelBell(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="1" width="2" height="2" />
      <rect x="5" y="3" width="6" height="2" />
      <rect x="4" y="5" width="8" height="4" />
      <rect x="3" y="9" width="10" height="2" />
      <rect x="2" y="11" width="12" height="1" />
      <rect x="6" y="13" width="4" height="2" />
    </PixelIconBase>
  );
}

export function PixelLogOut(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="6" height="2" />
      <rect x="2" y="4" width="2" height="8" />
      <rect x="2" y="12" width="6" height="2" />
      <rect x="7" y="7" width="6" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="12" y="6" width="2" height="4" />
      <rect x="10" y="10" width="2" height="2" />
    </PixelIconBase>
  );
}

export function PixelSave(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="2" y="2" width="10" height="2" />
      <rect x="12" y="4" width="2" height="10" />
      <rect x="2" y="4" width="2" height="10" />
      <rect x="2" y="12" width="12" height="2" />
      <rect x="5" y="4" width="5" height="3" />
      <rect x="5" y="9" width="6" height="3" />
    </PixelIconBase>
  );
}

export function PixelUser(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="6" y="2" width="4" height="4" />
      <rect x="4" y="8" width="8" height="2" />
      <rect x="3" y="10" width="10" height="4" />
    </PixelIconBase>
  );
}

export function PixelAlertTriangle(props: IconProps) {
  return (
    <PixelIconBase {...props}>
      <rect x="7" y="2" width="2" height="2" />
      <rect x="6" y="4" width="4" height="2" />
      <rect x="4" y="6" width="8" height="2" />
      <rect x="3" y="8" width="10" height="2" />
      <rect x="2" y="10" width="12" height="2" />
      <rect x="1" y="12" width="14" height="2" />
      <rect x="7" y="6" width="2" height="4" fill="#090E23" />
      <rect x="7" y="11" width="2" height="1" fill="#090E23" />
    </PixelIconBase>
  );
}
