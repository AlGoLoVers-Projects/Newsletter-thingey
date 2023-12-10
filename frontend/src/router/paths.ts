export const paths = {
    home: '/',
    oauthSuccess: '/oauthSuccess',
    oauth2Failure: '/oauth2Failure',
    login: '/login',
    signup: '/signup',
    notFound: '*'
}

export const authorizedPaths = {
    dashboard: '/dashboard'
}

const allPaths = { ...paths, ...authorizedPaths } as const;
export type Path = typeof allPaths[keyof typeof allPaths]
