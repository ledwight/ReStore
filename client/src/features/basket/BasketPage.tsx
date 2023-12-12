import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { useStoreContext } from "../../app/context/StoreContext";
import agent from "../../app/api/agent";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Basket } from "../../app/models/basket";
import { formatPrice } from "../../app/util/util";
import { Link } from "react-router-dom";

export default function BasketPage() {
    const { basket, setBasket, removeItem } = useStoreContext();
    const [status, setStatus] = useState({
        loading: false,
        name: "",
    });

    const [basketSum, setBasketSum] = useState<number>(0);
    const [basketQuantity, setBasketQuantity] = useState<number>(0);

    useEffect(() => {
        if (basket) {
            let sum = 0;
            let quantity = 0;
            basket.items.forEach((item) => {
                sum += item.price * item.quantity;
                quantity += item.quantity;
            });
            setBasketSum(sum);
            setBasketQuantity(quantity);
        }
    }, [setBasketSum, setBasketQuantity, basket]);

    function handleAddItem(productId: number, name: string) {
        setStatus({ loading: true, name });
        agent.Basket.addItem(productId)
            .then((basket: Basket) => {
                setBasket(basket);
                setBasketQuantity((prevState) => prevState++);
                setBasketSum(
                    (prevState) =>
                        (prevState += basket.items.filter(
                            (item) => item.productId == productId
                        )[0].price)
                );
            })
            .catch((error) => console.log(error))
            .finally(() => setStatus({ loading: false, name: "" }));
    }

    function handleRemoveItem(
        productId: number,
        quantity: number = 1,
        name: string
    ) {
        setStatus({ loading: true, name });
        agent.Basket.removeItem(productId, quantity)
            .then(() => {
                removeItem(productId, quantity);
                setBasketQuantity((prevState) => (prevState -= quantity));
                setBasketSum(
                    (prevState) =>
                        (prevState -=
                            basket!.items.filter(
                                (item) => item.productId == productId
                            )[0].price * quantity)
                );
            })
            .catch((error) => console.log(error))
            .finally(() => setStatus({ loading: false, name: "" }));
    }

    if (!basket)
        return <Typography variant="h3">Your basket is empty</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map((item) => (
                        <TableRow
                            key={item.productId}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display="flex" alignItems="center">
                                    <img
                                        src={item.pictureUrl}
                                        alt={item.name}
                                        style={{ height: 50, marginRight: 20 }}
                                    />
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                ${formatPrice(item.price)}
                            </TableCell>
                            <TableCell align="center">
                                <LoadingButton
                                    loading={
                                        status.loading &&
                                        status.name === `rem${item.productId}`
                                    }
                                    onClick={() =>
                                        handleAddItem(
                                            item.productId,
                                            `rem${item.productId}`
                                        )
                                    }
                                    color="error"
                                >
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={
                                        status.loading &&
                                        status.name === `add${item.productId}`
                                    }
                                    onClick={() =>
                                        handleAddItem(
                                            item.productId,
                                            `add${item.productId}`
                                        )
                                    }
                                    color="secondary"
                                >
                                    <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">
                                ${formatPrice(item.price * item.quantity)}
                            </TableCell>
                            <TableCell>
                                <LoadingButton
                                    loading={
                                        status.loading &&
                                        status.name === `del${item.productId}`
                                    }
                                    onClick={() =>
                                        handleRemoveItem(
                                            item.productId,
                                            item.quantity,
                                            `del${item.productId}`
                                        )
                                    }
                                >
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell />
                        <TableCell align="right"> Total Quantity</TableCell>
                        <TableCell align="center">{basketQuantity}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell />
                        <TableCell align="right">
                            ${formatPrice(basketSum)}
                        </TableCell>
                        <TableCell>
                            <Button component={Link} variant="contained" to='/checkout'>Checkout</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
