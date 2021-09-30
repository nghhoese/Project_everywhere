import React, {useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardActions,
    CardHeader,
    Grid,
    IconButton,
    makeStyles, Popover,
    Typography,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LensIcon from '@material-ui/icons/Lens';
import axios from "axios";
import UserContext from "../../context/UserContext";
import { GetCategories,DeleteCategory } from "../../data/categoryData";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 335,
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    typography: {
        padding: theme.spacing(2),
    },
}))

function CategoryOverview() {
    const classes = useStyles();

    const user_context = useContext(UserContext);
    let token = user_context.getToken();

    const [categories, setCategories] = React.useState([]);

    useEffect(async() => {
        let response = await GetCategories(token);
        setCategories(response);
    }, []);

    // Delete task
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [deleteCategoryId, setDeleteCategoryId] = React.useState("");

    const handleDeleteClick = (id, event) => {
        setDeleteCategoryId(id)
        setAnchorEl(event.currentTarget);
    };

    const handleDeleteClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteCategory = async e => {
        await DeleteCategory(deleteCategoryId, token)
        let newCategories = categories.filter((category) => category._id !== deleteCategoryId);
        setCategories(newCategories)
        handleDeleteClose()
    };

    const openDelete = Boolean(anchorEl);
    const deleteId = openDelete ? 'simple-popover' : undefined;

    return (
        <div>
            <Link to="/categories/add" >
                <IconButton aria-label="add category">
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            </Link>
            <Grid container>
            {
                categories.map((category, i) =>
                    <Card className={classes.card} key={i}>
                        <CardHeader
                            action={
                                <Link to={`/categories/edit/${category._id}`} >
                                    <IconButton aria-label="edit category">
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            }
                            title={category.name}

                        />
                      <CardActions disableSpacing>
                        <LensIcon style={{fill: category.colour}}/>
                        </CardActions>
                        <CardActions disableSpacing>
                            <IconButton aria-label="delete category" onClick={(event) => handleDeleteClick(category._id, event)}>
                                <DeleteForeverIcon  />
                            </IconButton>
                        </CardActions>
                    </Card>
                )
            }
            </Grid>
            <Popover
                id={deleteId}
                open={openDelete}
                anchorEl={anchorEl}
                onClose={handleDeleteClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.typography}>Weet je zeker dat je deze categorie wilt verwijderen?</Typography>
                <Button onClick={handleDeleteCategory} color="primary" variant="contained" autoFocus>
                    Ja
                </Button>
                <Button onClick={handleDeleteClose} color="secondary" variant="contained">
                    Nee
                </Button>
            </Popover>
        </div>
    )
}

export default CategoryOverview
