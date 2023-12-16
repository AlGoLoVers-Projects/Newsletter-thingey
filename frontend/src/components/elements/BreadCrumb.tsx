import React from 'react';
import {Breadcrumbs, Link, Typography} from '@mui/material';
import {useLocation} from 'react-router-dom';

const BreadCrumb = (): React.ReactElement => {
    const location = useLocation();
    const pathName = location.pathname.split('/').filter((x) => x !== ''); // Exclude empty strings

    const camelCaseToTitleCase = (str: string) => {
        const result = str.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
        <Breadcrumbs aria-label="breadcrumb">

            {pathName.map((name, index) => {
                const routeTo = `/${pathName.slice(0, index + 1).join('/')}`;
                return (
                    <span key={name}>
                        <Link underline="hover" color="inherit" href={routeTo}>
                            {camelCaseToTitleCase(name)}
                        </Link>
                    </span>
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadCrumb;
