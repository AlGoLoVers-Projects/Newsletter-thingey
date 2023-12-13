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

export const authorizedPaths = {
    dashboard: '/dashboard',
    signOut: '/signout',
}

const allPaths = { ...paths, ...authorizedPaths } as const;
export type Path = typeof allPaths[keyof typeof allPaths]
