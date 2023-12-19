import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Route, Routes, useLocation, useNavigate, Navigate} from 'react-router-dom';
import {alpha, InputBase} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {selectSearchValue, setSearchValue} from "../../redux/rootslices/data/search.slice";
import Groups from "./sub-pages/group/Groups";
import {
    ContactPage, ExitToApp,
    Group,
    InfoRounded, Person2Rounded, QuestionAnswer,
} from "@mui/icons-material";
import {authorizedPaths, dashboardPaths, Path} from "../../router/paths";
import BreadCrumb from "../../components/elements/BreadCrumb";
import {ReactElement} from "react";
import NewGroup from "./sub-pages/group/NewGroup";
import ManageGroup from "./sub-pages/group/ManageGroup";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Dashboard(): React.ReactElement {
    const theme = useTheme();
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch();
    const searchValue = useSelector(selectSearchValue);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchValue(e.target.value ?? ''));
    };

    type NavData = {
        title: string,
        icon: ReactElement
        path: Path,
    }

    const primaryNavigation: NavData[] = [
        {
            title: 'Groups',
            icon: <Group/>,
            path: authorizedPaths.groups
        },
        {
            title: 'Questions',
            icon: <QuestionAnswer/>,
            path: authorizedPaths.questions
        },
    ]

    const secondaryNavigation: NavData[] = [
        {
            title: 'Profile',
            icon: <Person2Rounded/>,
            path: authorizedPaths.profile
        },
        {
            title: 'About Us',
            icon: <InfoRounded/>,
            path: authorizedPaths.aboutUs
        },
        {
            title: 'Contact Us',
            icon: <ContactPage/>,
            path: authorizedPaths.contactUs
        },
    ]

    const buildNavigation = (nav: NavData[]) => {
        return nav.map((data, index) => (
            <ListItem key={data.title} disablePadding sx={{
                display: 'block',
                backgroundColor: data.path === location.pathname ? theme.palette.primary.main : 'initial'
            }}
            >
                {buildNavButton(data)}
            </ListItem>
        ))
    }

    const buildNavButton = (data: NavData) => {
        return <ListItemButton
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
            onClick={() => {
                navigate(data.path)
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                }}
            >
                {data.icon}
            </ListItemIcon>
            <ListItemText primary={data.title} sx={{opacity: open ? 1 : 0}}/>
        </ListItemButton>
    }


    return (
        <Box sx={{display: 'flex', height: "100vh"}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open} sx={{backgroundColor: theme.palette.primary.main}}>
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                    >
                        Newsletter
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon/>
                        </SearchIconWrapper>
                        <StyledInputBase
                            onChange={handleSearchChange}
                            value={searchValue}
                            placeholder="Search…"
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {buildNavigation(primaryNavigation)}
                </List>
                <Divider/>
                <List>
                    {buildNavigation(secondaryNavigation)}
                </List>
                <List sx={{marginTop: 'auto'}}>
                    {buildNavButton({title: 'Sign Out', icon: <ExitToApp/>, path: authorizedPaths.signOut})}
                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3, height: "maxContent", display: "flex", flexDirection: "column"}}>
                <DrawerHeader/>
                <BreadCrumb/>
                <Routes>
                    <Route path={'/'} element={<Navigate to={authorizedPaths.groups}/>}/>
                    <Route path={dashboardPaths.groups} element={<Groups/>}/>
                    <Route path={dashboardPaths.newGroup} element={<NewGroup/>}/>
                    <Route path={dashboardPaths.manageGroup} element={<ManageGroup/>}/>
                </Routes>
            </Box>
        </Box>
    );
}
