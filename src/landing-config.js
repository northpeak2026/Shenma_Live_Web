// Set VITE_MAIN_SITE_URL for a separately hosted landing page, or edit mainSiteUrl.
export const landingConfig={
 mainSiteUrl:import.meta.env.VITE_MAIN_SITE_URL||`${import.meta.env.BASE_URL}#/`,
 liveSceneCover:'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1100&q=85',
 footballBackground:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1500&q=80',
 basketballBackground:'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1000&q=80'
};
