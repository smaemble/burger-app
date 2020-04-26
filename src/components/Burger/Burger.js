import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.module.css';

const burger = (props) => {
    /*
     * object.keys() retrieve keys of 
     * different object and turn that into an array 
    */
   console.log("object ====", Object.keys(props.ingredients))
    let transformedIngredients = Object.keys(props.ingredients)
               .map(igKey => {
                    return [...Array(props.ingredients[igKey])].map((_, i) => {               
                        console.log("(props.ingredients[igKey], igKey)", props.ingredients[igKey], igKey);
                    return <BurgerIngredient key={igKey + i} type={igKey} />;
                    });
                })
                .reduce((prev, current) =>{
                        return prev.concat(current);
                },[]); 
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;