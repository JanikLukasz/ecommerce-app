import React, { Component } from 'react';
import '../styles/productpage.css';
import { flowRight as compose } from 'lodash';
import { graphql } from '@apollo/client/react/hoc';
import { getProductsQuery } from '../queries/queries';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

class ProductPage extends Component {

    displayProducts(data) {
        var indexPriceArray = this.props.currencySelected;
        switch (indexPriceArray) {
            case '$':
                indexPriceArray = 0;
                break;
            case '£':
                indexPriceArray = 1;
                break;
            case 'A$':
                indexPriceArray = 2;
                break;
            case '¥':
                indexPriceArray = 3;
                break;
            case '₽':
                indexPriceArray = 4;
                break;
            default:
                indexPriceArray = 0;
        }

        if (data.loading) {
            return (<div>Loading...</div>);
        } else {
            return data.category.products.map(product => {
                return (
                    <div className="product" key={product.id}>
                        <Link to={`/product/${product.id}`} className='link'>
                            <img className="images" src={product.gallery[0]} alt=""></img>
                            <div className="product-content">
                                <p className="product-title">{product.brand} {product.name}</p>
                                <p className="product-price">{product.prices[indexPriceArray].currency.symbol} {product.prices[indexPriceArray].amount.toFixed(2)}</p>
                            </div>
                        </Link>
                        {product.inStock ? 
                        <img onClick={() => { this.props.handleAddtoCart(product, true) }}
                            className="circle-icon" src={require('../images/CircleCart.png')} alt=""></img>
                            :
                            <img className="circle-icon-outofstock" src={require('../images/CirleCart-outofstock.png')} alt=""></img>
                        }
                    </div>
                );
            }
            )
        }
    }
    render() {
        const data = this.props.data;
        var categoryTitle = "All"
        if (this.props.match.params.categoryname) {
            categoryTitle = this.props.match.params.categoryname.charAt(0).toUpperCase() + this.props.match.params.categoryname.slice(1);
        }

        return (
            <div>
                <h1 id="category-name">{categoryTitle}</h1>
                <div id="product-list">
                    {this.displayProducts(data)}
                </div>
            </div>
        )

    }
}

export default withRouter(compose(
    graphql(getProductsQuery, {
        options: (props) => {
            if (props.match.params.categoryname !== undefined) {
                return {
                    variables: {
                        category: props.match.params.categoryname
                    }
                }
            } else {
                return {
                    variables: {
                        category: "all"
                    }
                }
            }
        }
    }))(ProductPage));