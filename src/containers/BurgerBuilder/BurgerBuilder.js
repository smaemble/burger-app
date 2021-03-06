import React, { Component } from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

//If a component will not be used with JSX, use lower case when importing it.
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    constructor(props){
        super(props);
        this.state = {
            // ingredients: {
            //     salad: 0,
            //     bacon: 0,
            //     cheese: 0,
            //     meat: 0
            // },
            ingredients: null,
            totalPrice: 4,
            purchasable: false,
            purchasing: false,
            loading: false,
            error: false
        }
    }

    componentDidMount(){
        axios.get('https://react-burger-app-18153.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ ingredients: response.data });
        })
        .catch(error => {
                this.setState({error: true});
        });
    }

    updatePurchaseState =(ingredients) => {
        const sum = Object.keys(ingredients)
             .map(igKey => {
                return ingredients[igKey];
        }).reduce((sum, elt) =>{
            return sum + elt;
        }, 0);
        this.setState({ purchasable: sum > 0 })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice  + priceAddition;
        console.log("addNewPrice", newPrice);
        this.setState ({ ingredients: updatedIngredients, totalPrice: newPrice });
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){ return ;}
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice  - priceDeduction;
        
        this.setState ({ ingredients: updatedIngredients, totalPrice: newPrice });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () =>{
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () =>{
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Armel Maemble',
                address: {
                    street: 'sesame St',
                    city: 'New York',
                    county: 'Denton',
                    zipCode: '41356'
                },
                emailAddress: 'test@testmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
        .then(response =>{
            this.setState({loading: false, purchasing: false});
        })
        .catch(error => this.setState({loading: false, purchasing: false}));
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p>: <Spinner />
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    /> 
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            />
        }

        if(this.state.loading){
            orderSummary = <Spinner/>
        }
        //{salad: true, meat: false, etc...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}         
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);