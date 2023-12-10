import React from "react";

import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function OrDivider(): React.ReactElement {
    return (
        <Box display="flex" alignItems="center" sx={{mt: 2, mb: 2}}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body1" sx={{ px: 2 }}>
                or
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
        </Box>
    );
};