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
import {GroupData} from "../../../redux/rootslices/groups.slice";
import {useSelector} from "react-redux";
import {selectSearchValue} from "../../../redux/rootslices/search.slice";

function Row(props: { row: GroupData }) {
    const {row} = props;
    let theme = useTheme()
    const [open, setOpen] = React.useState(false);

    const handleRowClick = () => {
        console.log("Row clicked:", row.groupName);
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
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.groupName}
                </TableCell>
                <TableCell align="right">{row.groupOwner.emailAddress}</TableCell>
                <TableCell align="right">{row.updatedAt}</TableCell>
                <TableCell align="right">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            // Handle delete button click logic here
                            console.log("Delete button clicked:", row.groupName);
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

export default function GroupList(props: { rows: GroupData[] }): React.ReactElement {

    const search = useSelector(selectSearchValue)

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const filteredRows = props.rows.filter((data) => {
        const searchTerm = search.toLowerCase();
        return Object.values(data).some((value) =>
            String(value).toLowerCase().includes(searchTerm)
        );
    });

    return (
        <Card sx={{borderRadius: 2, mt: 2}}>
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
