import React, { Component } from 'react';
import '../styles/currency.css'
import { graphql } from '@apollo/client/react/hoc';
import { getCurrencyQuery } from '../queries/queries';

class Currency extends Component {

    displayCurrencies() {
        var data = this.props.data;
        if (data.loading) {
        } else {
            return data.currencies.map((currency, index) => {
                return (
                    <div className={this.props.currencySelected === currency.symbol ? "currencies-selected" : "currencies"} key={index + currency}>
                        <p onClick={() => this.props.handleCurrencySelected(currency.symbol)}>{currency.symbol} {currency.label}</p>
                    </div>
                );
            })
        }
    }

    render() {
        return (
            <div>
                {this.displayCurrencies()}
            </div>

        );
    }
}

export default graphql(getCurrencyQuery)(Currency);