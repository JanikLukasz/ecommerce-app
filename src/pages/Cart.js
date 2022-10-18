import React, { Component } from 'react';
import '../styles/cart.css'
import Item from './Item';


class Cart extends Component {

    render() {
        const data = this.props.cart;
        const { total, totalQuantity, taxes } = this.props.countTotalAndQuantity();
        const idSelectedAttributesAll = this.props.idSelectedAttributesAll;
        return (
            <div className="cart">
                <div className="title">CART</div>
                {data.map((item, index) => {
                    return (
                        <Item item={item} key={item + index} handleAmount={this.handleAmount}
                            getPrice={this.props.getPrice} handleCartButtons={this.props.handleCartButtons} index={index}
                            quantity={this.props.quantity} idSelectedAttributesAll={idSelectedAttributesAll[index]}
                            productId={item.id} />
                    );
                })}
                <div className='summary'>
                    <p>Tax 21%: <span className="taxes">{this.props.currencySelected}{taxes.toFixed(2)}</span></p>
                    <p>Quantity: <span className="quantity">{totalQuantity}</span></p>
                    <p>Total:<span className="total">{this.props.currencySelected}{total.toFixed(2)}</span></p>
                </div>
                <button className="order">ORDER</button>
            </div>
        );
    }
}

export default Cart;