import { runtimeContent } from './_runtime';

const HOME_FALLBACK = {
  name: 'Mohamed Imdaah Nasrullah',
  designation: 'Full-Stack Developer · Military Veteran · Athlete',
  email: 'mohamed.imdaah@gmail.com',
  description:
    'Blending disciplined military precision with creative engineering to build meaningful digital experiences. Passionate about innovation, performance, and leaving a legacy of excellence both in technology and in life.',
};

const SOCIAL_FALLBACK = {
  instagram: 'https://www.instagram.com/zourielcorbett?igsh=Y3hiMGtwOWlyamVx',
  facebook: 'https://www.facebook.com/share/16UeLZKDHU/',
  discordServer: 'https://discord.gg/xkQ5bEzU',
  github: 'https://github.com/zouriel',
  strava: 'https://strava.app.link/purJE6Rb0Xb',
};

export const homePageData: typeof HOME_FALLBACK = new Proxy(HOME_FALLBACK, {
  get(target, prop) {
    const live = runtimeContent.home;
    return (live ?? target)[prop as keyof typeof HOME_FALLBACK];
  },
});

export const SocialLinks: typeof SOCIAL_FALLBACK = new Proxy(SOCIAL_FALLBACK, {
  get(target, prop) {
    const live = runtimeContent.settings?.social;
    return (live ?? target)[prop as keyof typeof SOCIAL_FALLBACK];
  },
});
