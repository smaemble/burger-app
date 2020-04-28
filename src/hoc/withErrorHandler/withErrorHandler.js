import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';
import BurgerIngredient from '../../components/Burger/BurgerIngredient/BurgerIngredient';
import BurgerBuilder from '../../containers/BurgerBuilder/BurgerBuilder';
import axios from 'axios';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component{
        state = {
            error: null
        }

        //componentDidMount() Works well for post request
        //Use componentWillMount() or a constructor()
        componentWillMount(){
            //Axios listeners
            axios.interceptors.response.use(response => response, error =>{
                this.setState({error: error});
                return
            });
            axios.interceptors.request.use(request =>{
                this.setState({error: null});
                return request;
            });
        }

        errorConfirmedHandler =()=>{
            this.setState({error: null});
        }

        render(){
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;