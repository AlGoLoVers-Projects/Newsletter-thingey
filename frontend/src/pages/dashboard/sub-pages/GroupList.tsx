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
import {Card, tableCellClasses} from "@mui/material";
import {DeleteForeverRounded} from "@mui/icons-material";

type GroupData = {
    name: string,
    description: string
    ownerId: string,
    lastModified: string,
    modifiedBy: string,
    groupId: string
}

function Row(props: { row: GroupData }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
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
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.ownerId}</TableCell>
                <TableCell align="right">{row.modifiedBy}</TableCell>
                <TableCell align="right">{row.lastModified}</TableCell>
                <TableCell align="right">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
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
                                {row.description}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable(): React.ReactElement {

    const rows: GroupData[] = [
        {
            name: "Group A",
            ownerId: "soorya.s27@gmail.com",
            lastModified: "07-01-2023",
            groupId: "21321-123213-123123",
            modifiedBy: "soorya.s27@gmail.com",
            description: "This is a group"
        },
    ];

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    return (
        <Card sx={{
            borderRadius: 2,
            mt: 2
        }}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell/>
                            <StyledTableCell>Group Name</StyledTableCell>
                            <StyledTableCell align="right">Owner ID</StyledTableCell>
                            <StyledTableCell align="right">Modified By</StyledTableCell>
                            <StyledTableCell align="right">Last Modified</StyledTableCell>
                            <StyledTableCell align="right">Delete Group</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
