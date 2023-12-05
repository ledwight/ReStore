import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <Container component={Paper}>
            <Typography gutterBottom variant='h3'>Oops - we could not find what you are looking for m8</Typography>
            <Divider></Divider>
            <Button fullWidth component={Link} to='/catalog'>Go back to shop</Button>
        </Container>
    )
}