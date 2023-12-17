export const paths = {
    home: '/',
    oauthSuccess: '/oauthSuccess',
    oauth2Failure: '/oauth2Failure',
    signIn: '/signin',
    signUp: '/signup',
    contactUs: '/contactUs',
    oauth2Authentication: '/oauth2/authorization/google',
    verification: '/verification',
    forgotPassword: '/forgotPassword',
    resetPassword: '/resetPassword',
    notFound: '*'
}

export const dashboardPaths = {
    groups: 'groups',
    questions: 'questions',
    profile: 'profile',
    aboutUs: 'aboutUs',
    contactUs: 'contactUs',
    newGroup: 'groups/newGroup'
};

export const authorizedPaths = {
    dashboardRoot: '/dashboard/',
    dashboard: '/dashboard/*',
    groups: `/dashboard/${dashboardPaths.groups}`,
    questions: `/dashboard/${dashboardPaths.questions}`,
    profile: `/dashboard/${dashboardPaths.profile}`,
    aboutUs: `/dashboard/${dashboardPaths.aboutUs}`,
    contactUs: `/dashboard/${dashboardPaths.contactUs}`,
    newGroup: `/dashboard/${dashboardPaths.newGroup}`,
    signOut: '/signout',
};


const allPaths = { ...paths, ...authorizedPaths } as const;
export type Path = typeof allPaths[keyof typeof allPaths]
