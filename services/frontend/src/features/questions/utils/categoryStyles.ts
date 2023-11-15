import { createHash } from "crypto";

export const hashStringToColour = (str: string) => {
  const hash = createHash("md5").update(str).digest("hex");
  const colorClasses = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "fuchsia",
    "cyan",
    "rose",
    "lime",
  ];
  const colorIndex = parseInt(hash.substring(0, 6), 16) % colorClasses.length;
  const color = colorClasses[colorIndex];

  // Define the base color intensity
  const bgAndBorderIntensity = "100";
  const textIntensity = "700";
  const hoverBgAndBorderIntensity = "200"; // Darker background and border on hover in light mode
  const hoverTextIntensity = "900"; // Darker text on hover in light mode

  // Define the dark mode color intensity
  const darkBgAndBorderIntensity = "800"; // Darker background and border in dark mode
  const darkTextIntensity = "200"; // Lighter text in dark mode
  const darkHoverBgAndBorderIntensity = "900"; // Darker background and border on hover in dark mode
  const darkHoverTextIntensity = "100"; // Lighter text on hover in dark mode

  return `bg-${color}-${bgAndBorderIntensity} text-${color}-${textIntensity} border-${color}-${bgAndBorderIntensity} 
          hover:bg-${color}-${hoverBgAndBorderIntensity} hover:text-${color}-${hoverTextIntensity} hover:border-${color}-${hoverBgAndBorderIntensity}
          dark:bg-${color}-${darkBgAndBorderIntensity} dark:text-${color}-${darkTextIntensity} 
          dark:border-${color}-${darkBgAndBorderIntensity} 
          dark:hover:bg-${color}-${darkHoverBgAndBorderIntensity} dark:hover:text-${color}-${darkHoverTextIntensity} dark:hover:border-${color}-${darkHoverBgAndBorderIntensity}`;
};
