import React, { Component } from 'react';
import { graphql } from '@apollo/client/react/hoc';
import { getproductById } from '../queries/queries';
import '../styles/productdescription.css';
import parse from 'html-react-parser';
import { withRouter } from "react-router";


class ProductDecription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexOfGallery: 0,
        };
    }

    displayGallery(data) {
        return data.product.gallery.map((image, index) => {
            return (
                <div key={image} onClick={() => {
                    return (this.setState({ indexOfGallery: index }));
                }}>
                    <img className="image-product" src={image} alt=""></img>
                </div>
            )
        });
    }

    displayImage(data) {
        return (
            <img src={data.product.gallery[this.state.indexOfGallery]} alt=""></img>
        );
    }

    displayPrice(data) {
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

        return (
            <div className='price-amount'>
                {data.product.prices[indexPriceArray].currency.symbol}{' '}
                {data.product.prices[indexPriceArray].amount.toFixed(2)}
            </div>
        )
    }

    render() {
        const data = this.props.data;
        if (data.loading) {
            return <div>Loading...</div>
        } else {
            return (
                <div className="pdp">
                    <div className="gallery-product">{this.displayGallery(data)}</div>
                    <div className="main-image">
                        {this.displayImage(data)}
                    </div>
                    <div className="attributes-and-description">
                        <h1 className="product-brand">{data.product.brand}</h1>
                        <div className="product-name">{data.product.name}</div>

                        <div className="attributes-container">
                            {data.product.attributes.map((attribute, index) => {
                                return (
                                    <div className='attribute' key={attribute + index}>
                                        {this.props.displayAttributes(attribute, data.product)}
                                    </div>
                                );
                            })}
                        </div>

                        <p className='price'>PRICE:</p>
                        <div className='price-a'>
                            {this.displayPrice(data)} {!data.product.inStock ? <p>out of stock</p> : null}
                        </div>

                        <div onClick={() => { this.props.handleAddtoCart(data.product, false) }}>
                            <button className={data.product.inStock ? 'add-to-cart' : 'add-to-cart-outofstock'}
                                onClick={() => { this.props.countTotalAndQuantity() }}>ADD TO CART</button>
                        </div>

                        <div className="description">{parse(data.product.description)}</div>
                    </div>

                </div>
            );
        }
    }
}

export default withRouter(graphql(getproductById, {
    options: (props) => {
        return {
            variables: {
                productId: props.match.params.id
            }
        }
    }
})(ProductDecription));