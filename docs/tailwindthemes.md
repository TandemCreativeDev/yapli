Theme colors with Tailwind CSS v4.0 and Next Themes (Dark/Light/Custom mode)
Kevin Ochoa Guerrero
Kevin Ochoa Guerrero

Follow
10 min read
·
Mar 12, 2025
8

With the new Tailwind update, I’ve been browsing and searching for information on how to implement dark mode and light mode in my app, but I couldn’t find all the information I needed in one place. After a long search through all the forums and other information on the internet, I was able to find exactly what I needed: the ability to switch between themes and use Tailwind’s dark classes.

Example with Dark Mode
Important note!
Before we dive into this tutorial, I’m sharing the repository and the app where the feature is already implemented, along with some example usage. If you’d rather skip the implementation details and jump straight into using it, you can check them out here.

If you find them useful, I’d really appreciate it if you could give the repository a star. Feel free to use them however you like. Thank you!

https://github.com/kevstrosky/tailwind-v4-theme-colors-example

https://tailwindv4themes.netlify.app/

First step: Setting up the project
To make this tutorial shorter I will use a newly created project in Next.js and then install next-themes.

npx create-next-app@latest
Following this command this was the configuration I used. I usually use pnpm but by default this project uses npm so for this tutorial I will continue using npm.

Now, I will install the next-themes package using the following command:

npm i next-themes
With this, we can use the ThemeProvider in the layout, which allows us to change all theme colors throughout the application.

Second step: Modify the layout.tsx file
I adjusted my layout.tsx this way, overriding all the default code that came with it, adding the ThemeProvider and making some changes.

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "Tailwind v4.0 Theme Colors Example",
description: "Tailwind v4.0 Theme Colors Example made by Kevstrosky",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en" suppressHydrationWarning>
<body className={`${geistSans.variable} antialiased`}>
<ThemeProvider enableSystem={true} defaultTheme="system">
{children}
</ThemeProvider>
</body>
</html>
);
}
If you look at the code, you’ll notice that the suppressHydrationWarning was added to the HTML tag. I’ll quote the official documentation of the next-themes library so you can see why this was used.

Note that ThemeProvider is a client component, not a server component.

Note! If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes updates that element. This property only applies one level deep, so it won't block hydration warnings on other elements.

Source: https://www.npmjs.com/package/next-themes

If we take a closer look at this, we have these properties enableSystem={true} defaultTheme="system":

<ThemeProvider enableSystem={true} defaultTheme="system">
  {children}
</ThemeProvider>
enableSystem={true}
This enables automatic detection of the user's operating system. If the user has set their system to dark or light mode, next-themes will adjust the application's theme to match the system's configuration.

defaultTheme="system"
This indicates that the default theme will be the one set in the user's system (dark or light). If no other theme is specified, the application will take the system's theme by default.

Third step: Modify the globals.css file
One of the features of this new version of Tailwind is that we can make the following configurations in a single global.css file. I'll provide the final CSS, and then we'll take a closer look at each part of the code, explaining what it does.

@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] \*));

@theme {
--color-card: hsl(207 97% 12%);
--color-background-light: hsl(0 0% 100%);
--color-background-dark: hsl(207 95% 8%);
--color-background-custom: hsl(187 71% 82%);
--color-background-pastel: hsl(279 100% 93%);
}

@layer base {
[data-theme="light"] {
--color-card: hsl(207 97% 12%);
}
[data-theme="dark"] {
--color-card: hsl(0 0% 96%);
}
[data-theme="custom"] {
--color-card: hsl(182, 87%, 39%);
}
[data-theme="pastel"] {
--color-card: hsl(291 46% 83%);
}
}

:root[data-theme="light"] {
background-color: var(--color-background-light);
}

:root[data-theme="dark"] {
background-color: var(--color-background-dark);
}

:root[data-theme="custom"] {
background-color: var(--color-background-custom);
}

:root[data-theme="pastel"] {
background-color: var(--color-background-pastel);
}
Explaining each part of the global.css file

@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] _));
At the beginning of the file, we have @import "tailwindcss";, which allows us to use this version of Tailwind. Additionally, we have this line of code: @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] _));, which enables us to use the dark class within HTML tags, such as in:

<div className="bg-blue-500 dark:bg-red-500">
  <h2 className="text-xl">Example</h2>
</div>
I’ll quote the official documentation of the Using a data attribute.

To use a data attribute instead of a class to activate dark mode, just override the dark variant with an attribute selector instead. Now dark mode utilities will be applied whenever the data-theme attribute is set to dark somewhere up the tree.

Source: https://tailwindcss.com/docs/dark-mode

@theme {
--color-card: hsl(207 97% 12%);
--color-background-light: hsl(0 0% 100%);
--color-background-dark: hsl(207 95% 8%);
--color-background-custom: hsl(187 71% 82%);
--color-background-pastel: hsl(279 100% 93%);
}
Now I’m using themes where I’m defining my CSS variables (custom properties). In this case, I used examples with the following variables: --color-card, --color-background-light, --color-background-dark, --color-background-custom, and --color-background-pastel. Each variable changes the background color in different scenarios: light mode, dark mode, a custom color, and a pastel color to enhance the example.

I’ll quote the official documentation of the Theme variables.

Theme variables are special CSS variables defined using the @theme directive that influence which utility classes exist in your project.

Source: https://tailwindcss.com/docs/theme

@layer base {
[data-theme="light"] {
--color-card: hsl(207 97% 12%);
}
[data-theme="dark"] {
--color-card: hsl(0 0% 96%);
}
[data-theme="custom"] {
--color-card: hsl(182, 87%, 39%);
}
[data-theme="pastel"] {
--color-card: hsl(291 46% 83%);
}
}
In this code, we define the variable --color-card inside a CSS layer, where we specify a different color depending on the active theme. Each theme (light, dark, custom, and pastel) sets a unique color for --color-card using the HSL color model. This allows us to change the appearance of the card based on the theme, making it adaptable to different modes and styles.

I’ll quote the official documentation of the Adding base styles.

If you want to add your own default base styles for specific HTML elements, use the @layer directive to add those styles to Tailwind's base layer.

Source:https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles

:root[data-theme="light"] {
background-color: var(--color-background-light);
}

:root[data-theme="dark"] {
background-color: var(--color-background-dark);
}

:root[data-theme="custom"] {
background-color: var(--color-background-custom);
}

:root[data-theme="pastel"] {
background-color: var(--color-background-pastel);
}
These color changes are being applied directly from this file, using the :root selector to define the background color for each theme. The background color is set globally at the root level, and no other part of the application modifies the background color except for here. Each theme (light, dark, custom, pastel) gets its own specific background color defined by the respective CSS variable.

Fourth step: Adding buttons to change the themes in the theme-buttons.tsx component
We’ll add a single component where I’ll place all the necessary code without separating it into multiple components, so you can view everything in one file.

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeButtonProps {
themeName: string;
currentTheme: string | undefined;
onClick: () => void;
label: string;
}

interface StaticThemeButtonProps {
label: string;
}

const ThemeButton = ({
themeName,
currentTheme,
onClick,
label,
}: ThemeButtonProps) => {
return (
<button
onClick={onClick}
className={`flex items-center cursor-pointer px-4 py-2 rounded-md transition-colors ${
        currentTheme === themeName
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      }`} >
{label}
</button>
);
};

const StaticThemeButton = ({ label }: StaticThemeButtonProps) => {
return (
<button className="flex items-center cursor-pointer px-4 py-2 rounded-md bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
{label}
</button>
);
};

export const ThemeButtons = () => {
const { theme, setTheme, resolvedTheme } = useTheme();
const [mounted, setMounted] = useState<boolean>(false);

interface ThemeOption {
id: string;
label: string;
}

const themes: ThemeOption[] = [
{ id: "light", label: "Light Mode" },
{ id: "dark", label: "Dark Mode" },
{ id: "custom", label: "Custom Mode" },
{ id: "pastel", label: "Pastel Mode" },
];

useEffect(() => {
setMounted(true);
}, []);

useEffect(() => {
if (mounted && !theme) {
const systemTheme =
resolvedTheme ||
(window.matchMedia("(prefers-color-scheme: dark)").matches
? "dark"
: "light");

      setTheme(systemTheme);
    }

}, [mounted, theme, resolvedTheme, setTheme]);

if (!mounted) {
return (
<div className="flex flex-col gap-4">
{themes.map((themeOption: ThemeOption) => (
<StaticThemeButton key={themeOption.id} label={themeOption.label} />
))}
</div>
);
}

const effectiveTheme = resolvedTheme || theme;

return (
<div className="flex flex-col gap-4">
{themes.map((themeOption: ThemeOption) => (
<ThemeButton
key={themeOption.id}
themeName={themeOption.id}
currentTheme={effectiveTheme}
onClick={() => setTheme(themeOption.id)}
label={themeOption.label}
/>
))}
</div>
);
};
This code implements a theme switcher using the next-themes package. It consists of two types of buttons:

ThemeButton: A button that changes the theme when clicked. It highlights the currently active theme.
StaticThemeButton: A static button that is displayed when the component is mounted, showing the available theme options but not allowing interaction.
The ThemeButtons component:

Uses useTheme from next-themes to get and set the current theme.
Initializes the theme based on the system’s preferences on the first render.
Displays buttons for multiple themes (light, dark, custom, pastel), updating the theme when clicked.
It ensures that the theme preference persists by using the system theme if no explicit theme is set, and it conditionally renders the buttons depending on whether the component is mounted.

Fifth step: Finally, integrating all of this into the page.tsx file
As with everything in this post, I will first provide the final code for this page.tsx file, and then I will explain each part.

import { ThemeButtons } from "./components/theme-buttons";

export default function Home() {
return (
<div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
<h1 className="text-3xl font-semibold text-center">
Tailwind CSS v4.0 Theme Colors Example
</h1>
<div className="container mx-auto flex flex-wrap items-center justify-center gap-4">
<div className="h-64 w-full sm:w-52 bg-blue-500 text-white p-4 rounded-lg flex flex-col gap-4">
<h1 className="text-xl font-bold">Card using static color</h1>
<span>bg-blue-500</span>
</div>
<div className="h-64 w-full sm:w-52 bg-amber-500 dark:bg-violet-500 text-white p-4 rounded-lg flex flex-col gap-4">
<h1 className="text-xl font-bold">Card using dark class</h1>
<div className="flex flex-col gap-2">
<span>bg-amber-500</span>
<span>dark:bg-violet-500</span>
</div>
</div>
<div className="h-64 w-full sm:w-52 bg-card text-white dark:text-black p-4 rounded-lg flex flex-col gap-4">
<h1 className="text-xl font-bold">
Card using CSS Variables (Custom Properties)
</h1>
<span>bg-card</span>
</div>
<ThemeButtons />
</div>
</div>
);
}
The card using the static color
This card is using the Tailwind color class bg-blue-500. The color of this card will not change regardless of the theme you are using. It is a static color that will remain as is.

<div className="h-64 w-full sm:w-52 bg-blue-500 text-white p-4 rounded-lg flex flex-col gap-4">
  <h1 className="text-xl font-bold">Card using static color</h1>
  <span>bg-blue-500</span>
</div>
The card using dark class
In this card, we can see that I’m using the Tailwind class with the color bg-amber-500 and dark:bg-violet-500. The class bg-amber-500 will be displayed in all themes as a static color, except when the 'dark' theme is activated, at which point the color will change to bg-violet-500.

<div className="h-64 w-full sm:w-52 bg-amber-500 dark:bg-violet-500 text-white p-4 rounded-lg flex flex-col gap-4">
  <h1 className="text-xl font-bold">Card using dark class</h1>
  <div className="flex flex-col gap-2">
    <span>bg-amber-500</span>
    <span>dark:bg-violet-500</span>
  </div>
</div>
The card using CSS Variables (Custom Properties)
Now, we are using CSS Variables (Custom Properties) with bg-card, and depending on the active theme—whether it's light, dark, custom, or pastel—the bg-card color will change based on the color variables defined for each theme.

<div className="h-64 w-full sm:w-52 bg-card text-white dark:text-black p-4 rounded-lg flex flex-col gap-4">
  <h1 className="text-xl font-bold">
  Card using CSS Variables (Custom Properties)
  </h1>
  <span>bg-card</span>
</div>
I will include example images showing how the final application works with each of the themes. You’ll be able to see how the color changes in the cards and backgrounds for each theme.
