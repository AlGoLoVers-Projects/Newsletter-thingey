import React from "react";
import {Container} from "@mui/material";
import {selectUserData, UserData} from "../../redux/rootslices/auth-data-slice";
import {useSelector} from "react-redux";

export default function Dashboard(): React.ReactElement {

    const authData: UserData = useSelector(selectUserData)

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                minHeight: "100vh"
            }}
        >
            {authData.toString()}
        </Container>
    );
}