import React, {
    useRef,
    KeyboardEvent,
    useState,
    FormEvent,
    FocusEvent,
    useCallback, useEffect
} from "react";
import {Box, Input, styled} from "@mui/material";
import Typography from "@mui/material/Typography";

const VerificationInput = styled(Input)(({theme}) => ({
    width: "2.5rem",
    fontSize: "1.4rem",
    fontWeight: "600",
    color: theme.palette.secondary.main,
    input: {textAlign: "center "},
    backgroundColor: "#3a3a3a",
    borderRadius: 2,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 10px 0px inset",
    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0
    }
}));

type InputOrNull = HTMLInputElement | null;

export default function CodeInput(props: { length: number, error?: boolean, onChange?: Function }): React.ReactElement {

    const buildEmptyArray = () => {
        return Array(props.length).fill("");
    }

    const [code, setCode] = useState<string[]>(buildEmptyArray());
    const update = useCallback((index: number, val: string) => {
        return setCode((prevState) => {
            const slice = prevState.slice();
            slice[index] = val;
            return slice;
        });
    }, []);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setCode(buildEmptyArray())
    }, [props.error])

    useEffect(() => {
        if(props.onChange)  props.onChange(code.join(""));
    }, [code])

    function handleKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
        const index = parseInt(evt.currentTarget.dataset.index as string);
        const form = formRef.current;
        if (isNaN(index) || form === null) return;

        const prevIndex = index - 1;
        const nextIndex = index + 1;
        const prevInput: InputOrNull = form.querySelector(`.input-${prevIndex}`);
        const nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);
        switch (evt.key) {
            case "Backspace":
                if (code[index]) update(index, "");
                else if (prevInput) prevInput.select();
                break;
            case "ArrowRight":
                evt.preventDefault();
                if (nextInput) nextInput.focus();
                break;
            case "ArrowLeft":
                evt.preventDefault();
                if (prevInput) prevInput.focus();
        }
    }

    function handleChange(evt: FormEvent<HTMLInputElement>) {
        const value = evt.currentTarget.value;
        const index = parseInt(evt.currentTarget.dataset.index as string);
        const form = formRef.current;
        if (isNaN(index) || form === null) {
            setCode(buildEmptyArray())
            return;
        }

        let nextIndex = index + 1;
        let nextInput: InputOrNull = form.querySelector(`.input-${nextIndex}`);

        update(index, value[0] || "");
        if (value.length === 1) nextInput?.focus();
        else if (index < code.length - 1) {
            const split = value.slice(index + 1, code.length).split("");
            split.forEach((val) => {
                update(nextIndex, val);
                nextInput?.focus();
                nextIndex++;
                nextInput = form.querySelector(`.input-${nextIndex}`);
            });
        }
    }

    function handleFocus(evt: FocusEvent<HTMLInputElement>) {
        evt.currentTarget.select();
    }

    return (
        <Box
            ref={formRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                paddingTop: 1
            }}
        >
            <Typography
                variant="subtitle1">
                Enter verification Code
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    paddingTop: 1
                }}>
                {code.map((value, i) => (
                    <VerificationInput
                        key={i}
                        value={value}
                        error={props.error ?? false}
                        inputProps={{
                            type: "text",
                            className: `input-${i}`,
                            "aria-label": `Number ${i + 1}`,
                            "data-index": i,
                            pattern: "[0-9]*",
                            inputMode: "numeric",
                            onChange: handleChange,
                            onKeyDown: handleKeyDown,
                            onFocus: handleFocus
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};
