export const paths = {
    home: '/',
    oauthSuccess: '/oauthSuccess',
    oauth2Failure: '/oauth2Failure',
    signIn: '/signin',
    signUp: '/singup',
    oauth2Authentication: '/oauth2/authorization/google',
    notFound: '*'
}

export const authorizedPaths = {
    dashboard: '/dashboard'
}

const allPaths = { ...paths, ...authorizedPaths } as const;
export type Path = typeof allPaths[keyof typeof allPaths]
