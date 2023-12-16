import * as React from "react";
import {useSelector} from "react-redux";
import {selectSearchValue} from "../../../redux/rootslices/search.slice";

export default function Groups(): React.ReactElement {
    let search = useSelector(selectSearchValue)
    return (<div>{search}</div>)
}