import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { formatPrice } from "../../app/util/util";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails(){

    const {basket, setBasket, removeItem} = useStoreContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const {id} = useParams<{id: string}>();
    const [quantity, setQuantity] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    const item = basket?.items.find((item) => item.productId == product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        agent.Catalog.details(Number(id))
        .then(response => setProduct(response))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }, [id, item])

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        if(parseInt(event.currentTarget.value) >= 0){
            setQuantity(parseInt(event.currentTarget.value));
        }
    }

    function handleUpdateCart() {
        if (!product) return
        setSubmitting(true);
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;
            agent.Basket.addItem(product.id, updatedQuantity)
                .then(basket => setBasket(basket))
                .catch(error => console.log(error))
                .finally(() => setSubmitting(false))
        } else {
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product.id, updatedQuantity)
                .then(() => removeItem(product.id, updatedQuantity))
                .catch(error => console.log(error))
                .finally(() => setSubmitting(false))
        }
    }

    if (loading) return <LoadingComponent message='Loading Product...'/>
    if (!product) return <NotFound></NotFound>

    return(
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{mb: 2}}></Divider>
                <Typography variant="h4" color='grey.500'>${formatPrice(product.price)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField variant="outlined" type='number' label='Quantity In Cart' fullWidth value={quantity} onChange={handleInputChange}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} loading={submitting} onClick={handleUpdateCart} sx={{height: '55px'}} color="primary" size="large" variant="contained" fullWidth>
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}