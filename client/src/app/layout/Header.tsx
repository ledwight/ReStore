import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    darkMode: boolean;
    setDarkMode: (bool: boolean) => void;
}

export default function Header({darkMode, setDarkMode}: Props) {

    return (
        <>
            <AppBar position="static" sx={{mb: 4}}>
                <Toolbar>
                    <Typography variant="h6">
                        Re-Store
                    </Typography>
                    <Switch 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    />
                </Toolbar>
            </AppBar>
        </>
    );
}
