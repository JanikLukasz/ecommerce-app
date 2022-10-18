import React, { Component } from 'react';
import '../styles/navbar.css'
import { graphql } from '@apollo/client/react/hoc';
import { flowRight as compose } from 'lodash';
import { getCategoryQuery, getCurrencyQuery } from '../queries/queries'
import Currency from '../components/Currency';
import CartOverlay from '../components/CartOverlay';
import Backdrop from './Backdrop';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyActive: false,
            cartOverlayActive: false,
        };
    }

    setCartOverlayActive = () => {
        if (this.state.cartOverlayActive) {
            this.setState({ cartOverlayActive: false });
        } else {
            this.setState({ cartOverlayActive: true });
        }
    }

    handleCartOverlayActive = () => {
        this.setState({ cartOverlayActive: false });
    }

    setCurrencySelected() {
        const rotateArrow = document.getElementById('arrow');
        if (this.state.currencyActive) {
            this.setState({ currencyActive: false });
            rotateArrow.style.transform = 'rotate(360deg)';
        } else {
            this.setState({ currencyActive: true });
            rotateArrow.style.transform = 'rotate(180deg)';
        }
    }

    displayCurrency() {
        var data = this.props.getCurrencyQuery;
        if (data.loading) {
        } else return (
            <div >
                <p onClick={() => { this.setCurrencySelected() }}>{this.props.currencySelected}</p>
                <img src={require('../images/arrow.png')} id='arrow'></img>
            </div >
        );
    }

    functions(categoryName) {
        this.props.handleIdSelectedAttributes();
        this.props.handleCategorySelected(categoryName);
    }

    displayCategory() {
        let categorySelected = this.props.categorySelected;
        if (this.props.location.pathname === "/") {
            categorySelected = "all"
        } else
            if (this.props.location.pathname === "/all" || this.props.location.pathname === "/clothes"
                || this.props.location.pathname === "/tech") {
                categorySelected = this.props.location.pathname.slice(1)
            }
        var data = this.props.getCategoryQuery;
        if (data.loading) {
        } else {
            return data.categories.map((category, index) => {
                return (
                    <div className={categorySelected === category.name ? "category-selected" : "category"} key={index + category}>
                        <Link to={`/${category.name}`}>
                            <p onClick={(e) => this.functions(category.name)}>{category.name.toUpperCase()}</p>
                        </Link>
                    </div>
                );
            })
        }
    }

    componentDidMount() {
        window.addEventListener('click', function (e) {
            if (!document.getElementById('currency').contains(e.target)) {
                this.setState({ currencyActive: false });
                const rotateArrow = document.getElementById('arrow');
                rotateArrow.style.transform = 'rotate(360deg)';
            }
        }.bind(this));
    }

    render() {
        const { total, totalQuantity, taxes } = this.props.countTotalAndQuantity();
        return (
            <div>
                <div className="navbar">
                    <div className="categories">
                        {this.displayCategory()}
                    </div>

                    <div>
                        <img src={require('../images/VSF.png')} id='logo'></img>
                    </div>
                    <div className="currency-and-cart">
                        <div id="currency">
                            <div>{this.displayCurrency()}</div>
                            {
                                this.state.currencyActive ?
                                    <Currency
                                        handleCurrencySelected={this.props.handleCurrencySelected}
                                        currencySelected={this.props.currencySelected}
                                    /> : null
                            }
                        </div>

                        <div id='cartoverlay'>
                            <div id='cart-icon' onClick={() => { this.setCartOverlayActive() }}>
                                <img src={require('../images/cart.png')}></img>

                                {totalQuantity !== 0 ? <div className="total-quantity">{totalQuantity}</div> : null}

                            </div>
                            {
                                (this.state.cartOverlayActive) &&
                                <CartOverlay currencySelected={this.props.currencySelected} cart={this.props.cart}
                                    idSelectedAttributesAll={this.props.idSelectedAttributesAll} quantity={this.props.quantity}
                                    countTotalAndQuantity={this.props.countTotalAndQuantity} getPrice={this.props.getPrice}
                                    handleCartButtons={this.props.handleCartButtons} handleCartOverlayActive={this.handleCartOverlayActive}/>
                            }
                        </div>
                        {
                            this.state.cartOverlayActive && <Backdrop />
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(compose(
    graphql(getCategoryQuery, { name: "getCategoryQuery" }),
    graphql(getCurrencyQuery, { name: "getCurrencyQuery" })
)(Navbar));