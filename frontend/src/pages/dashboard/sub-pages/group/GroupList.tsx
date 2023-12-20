import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {styled} from "@mui/material/styles";
import {Card, tableCellClasses, useTheme} from "@mui/material";
import {DeleteForeverRounded} from "@mui/icons-material";
import {GroupData, GroupListData} from "../../../../redux/rootslices/api/groups.slice";
import {useSelector} from "react-redux";
import {selectSearchValue} from "../../../../redux/rootslices/data/search.slice";
import {useNavigate} from "react-router-dom";
import {authorizedPaths} from "../../../../router/paths";
import {formatDateToIndianStandard, isEmpty} from "../../../../util/validation";
import {selectGroupData} from "../../../../redux/rootslices/data/groups.slice";

function Row(props: { row: GroupData }) {
    const {row} = props;
    const theme = useTheme()
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);

    const handleRowClick = () => {
        navigate(authorizedPaths.manageGroup, {state: props.row.id})
    };

    const handleDateString = (date: string | null) => {
        if (!isEmpty(date) && date !== null) {
            return  formatDateToIndianStandard(date);
        }

        return ''
    };

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    "& > *": {borderBottom: "unset"},
                    cursor: "pointer",
                    "&:hover": {
                        background: theme.palette.action.hover
                    },
                }}
                onClick={handleRowClick}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(!open)
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.groupName}
                </TableCell>
                <TableCell align="right">{row.groupOwner.emailAddress}</TableCell>

                <TableCell align="right">{handleDateString(row.updatedAt)}</TableCell>
                <TableCell align="right">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            //TODO: Handle delete button click logic here
                        }}
                    >
                        <DeleteForeverRounded/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Description
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {row.groupDescription}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function GroupList(): React.ReactElement {

    const search = useSelector(selectSearchValue)
    const groupData: GroupListData = useSelector(selectGroupData)

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const filteredRows = groupData.filter((data) => {
        const searchTerm = search.toLowerCase();
        return Object.values(data).some((value) =>
            String(value).toLowerCase().includes(searchTerm)
        );
    });

    return (
        <Card sx={{borderRadius: 2, mt: 2, mb: 5}}>
            {filteredRows.length !== 0 ?
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell/>
                                <StyledTableCell>Group Name</StyledTableCell>
                                <StyledTableCell align="right">Owner ID</StyledTableCell>
                                <StyledTableCell align="right">Last Modified</StyledTableCell>
                                <StyledTableCell align="right">Delete Group</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row) => (
                                <Row key={row.id} row={row}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <Typography variant="body2" color="text.secondary" align="center">
                    No results found
                </Typography>
            }
        </Card>
    );
}
