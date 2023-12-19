export const paths = {
    home: '/',
    test: '/test',
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
    invitations: 'invitations',
    profile: 'profile',
    aboutUs: 'aboutUs',
    contactUs: 'contactUs',
    newGroup: 'groups/newGroup',
    manageGroup: 'groups/manageGroup'
};

export const authorizedPaths = {
    dashboardRoot: '/dashboard/',
    dashboard: '/dashboard/*',
    groups: `/dashboard/${dashboardPaths.groups}`,
    questions: `/dashboard/${dashboardPaths.questions}`,
    invitations: `/dashboard/${dashboardPaths.invitations}`,
    profile: `/dashboard/${dashboardPaths.profile}`,
    aboutUs: `/dashboard/${dashboardPaths.aboutUs}`,
    contactUs: `/dashboard/${dashboardPaths.contactUs}`,
    newGroup: `/dashboard/${dashboardPaths.newGroup}`,
    manageGroup: `/dashboard/${dashboardPaths.manageGroup}`,
    signOut: '/signout',
};


const allPaths = { ...paths, ...authorizedPaths } as const;
export type Path = typeof allPaths[keyof typeof allPaths]
