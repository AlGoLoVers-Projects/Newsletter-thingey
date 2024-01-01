import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RedirectPathContextValue {
    redirectPath: string;
    setRedirect: (path: string) => void;
}

const RedirectPathContext = createContext<RedirectPathContextValue | undefined>(undefined);

interface RedirectPathProviderProps {
    children: ReactNode;
}

export const RedirectPathProvider: React.FC<RedirectPathProviderProps> = ({ children }) => {
    const [redirectPath, setRedirectPath] = useState<string>('');

    const setRedirect = (path: string) => {
        setRedirectPath(path);
    };

    return (
        <RedirectPathContext.Provider value={{ redirectPath, setRedirect }}>
            {children}
        </RedirectPathContext.Provider>
    );
};

export const useRedirectPath = (): RedirectPathContextValue => {
    const context = useContext(RedirectPathContext);

    if (!context) {
        throw new Error('useRedirectPath must be used within a RedirectPathProvider');
    }

    return context;
};
