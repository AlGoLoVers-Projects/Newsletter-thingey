import {useLocation} from 'react-router-dom';
import {authorizedPaths, paths} from "../router/paths";

export const useBuildRedirectPath = (): string => {
    const location = useLocation();
    const isFormPath = /^\/form\/(.+)$/.test(location.pathname);

    const pathsToIgnore = ['signOut', 'groups'];

    const isAuthorizedPath = Object.entries(authorizedPaths).some(([key, path]) => {
        const pathRegex = new RegExp(`^${path.replace(/\//g, '\\/').replace(/\*/g, '.*')}$`);
        return !pathsToIgnore.includes(key) && pathRegex.test(location.pathname);
    });

    return isAuthorizedPath || isFormPath ? `${paths.signIn}?redirect=${encodeURIComponent(location.pathname)}` : paths.signIn;
};
