export const profile = {
  user: "ansh",
  host: "gujral.life",
  /** shown as "role" in the neofetch block, suffixed with the current org */
  title: "full-stack engineer",
  location: "bengaluru, in",
  editor: "nvim v0.12.5",
};

export type Social = { label: string; href: string };

export const socials: Social[] = [
  { label: "github", href: "https://github.com/gujraI" },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/ansh-gujral-9b2a7a23b/",
  },
  { label: "x", href: "https://x.com/laxpsy" },
];
