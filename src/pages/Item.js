import React, { Component } from 'react';
import '../styles/item.css'
import { graphql } from '@apollo/client/react/hoc';
import { getproductById } from '../queries/queries';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            galleryIndex: 0,
        };
    }

    handleGalleryIndex(galleryIndex, galleryLength, i) {
        if ((galleryIndex + i) !== galleryLength && (galleryIndex + i) >= 0) {
            this.setState({ galleryIndex: galleryIndex += i })
        }
    }

    displayGallery(item) {
        var galleryIndex = this.state.galleryIndex;
        return (
            <div className='container-image'>
                <img className="item-image" src={item.gallery[galleryIndex]} alt=""></img>
                <div className={item.gallery.length === 1 ? 'arrows-hidden' : 'arrows'}>
                    <img onClick={() => this.handleGalleryIndex(galleryIndex, item.gallery.length, -1)}
                        src={require('../images/V-left.png')} alt=""></img>
                    <img onClick={() => this.handleGalleryIndex(galleryIndex, item.gallery.length, +1)}
                        src={require('../images/V-right.png')} alt=""></img>
                </div>
            </div>
        )
    }

    displayAttributes(attribute, product) {
        const idSelectedAttributesAll = this.props.idSelectedAttributesAll;
        return (
            attribute.items.map((item, index) => {
                if (attribute.type === "swatch") {
                    return (
                        <div className={idSelectedAttributesAll.includes(item.value + attribute.name + product.name + "x") ?
                            'swatch-attributes-selected-i' : 'swatch-attributes-i'} key={index + item} id={item.value}>
                            {index === 0 ? <div className='attribute-name'>{attribute.name.toUpperCase()}:</div> : null}
                            <button style={{ '--primary-color': item.value }}></button>
                        </div>
                    )
                } else {
                    return (
                        <div className={idSelectedAttributesAll.includes(item.value + attribute.name + product.name + "y") ?
                            'non-swatch-attributes-selected-i' : 'non-swatch-attributes-i'} key={index + item} id={item.value}>
                            {index === 0 ? <div className='attribute-name'>{attribute.name.toUpperCase()}:</div> : null}
                            <button>{item.value}</button>
                        </div>
                    )
                }
            }
            )
        )

    }

    render() {
        const data = this.props.data;
        const item = this.props.data.product;
        if (data.loading) {
            return <div>Loading...</div>
        } else {
            const { price, symbol } = this.props.getPrice(item);
            const quantity = this.props.quantity;
            return (
                <div className='item'>
                    <div className="item-attributes">
                        <div className='item-brand'>{item.brand}</div>
                        <div className='item-name'>{item.name}</div>
                        <div className='item-price'>{symbol}{' '}{price.toFixed(2)}</div>
                        {item.attributes.map((attribute, index) => {
                            return (
                                <div className='attribute' key={attribute + index}>
                                    {this.displayAttributes(attribute, item)}
                                </div>

                            );
                        })}
                    </div>
                    <div className='buttons'>
                        <button onClick={() => this.props.handleCartButtons(this.props.index, +1, quantity)}>+</button>
                        <p>{quantity[this.props.index]}</p>
                        <button onClick={() => this.props.handleCartButtons(this.props.index, -1, quantity)}>-</button>
                    </div>
                    <div className="item-gallery">{this.displayGallery(item)}</div>
                </div>
            );
        }
    }
}

export default graphql(getproductById, {
    options: (props) => {
        return {
            variables: {
                productId: props.productId
            }
        }
    }
})(Item);