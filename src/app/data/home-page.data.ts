// Home/profile data, sourced from the single source of truth: ./info.json
import info from './info.json';

export const homePageData = {
  name: info.personalInfo.name,
  designation: info.designation,
  email: info.personalInfo.email,
  description: info.taglines.profile,
};

export const SocialLinks = {
  telegram: info.socialLinks.telegram,
  instagram: info.socialLinks.instagram,
  facebook: info.socialLinks.facebook,
  discordServer: info.socialLinks.discordServer,
  github: info.socialLinks.github,
  strava: info.socialLinks.strava,
};
