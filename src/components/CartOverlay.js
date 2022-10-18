import React, { Component } from 'react';
import '../styles/cartoverlay.css'
import ItemOverlay from '../components/ItemOverlay';
import { Link } from "react-router-dom";

class CartOverlay extends Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)
            && !document.getElementById('cart-icon').contains(event.target)) {
            this.props.handleCartOverlayActive();
        }
    }

    render() {
        const data = this.props.cart;
        const { total, totalQuantity, taxes } = this.props.countTotalAndQuantity();
        const idSelectedAttributesAll = this.props.idSelectedAttributesAll;
        return (
            <div className="cart-o" ref={this.wrapperRef}>
                <div className="mybag-o">My bag, <span>{totalQuantity} items</span></div>
                <div className='container'>
                {data.map((item, index) => {
                    return (
                        <ItemOverlay item={item} key={item + index} handleAmount={this.handleAmount}
                            getPrice={this.props.getPrice} handleCartButtons={this.props.handleCartButtons} index={index}
                            quantity={this.props.quantity} idSelectedAttributesAll={idSelectedAttributesAll[index]}
                            productId={item.id} />
                    );
                })} 
                </div>
                <div className='summary-o'>
                    <p>Total:</p>
                    <p className="total-o">{this.props.currencySelected}{total.toFixed(2)}</p>
                </div>
                <div className="buttons-o">
                    <Link to={'/cart/bag'}><button className="view-bag-o"
                        onClick={(e) => this.props.handleCartOverlayActive()}>VIEW BAG</button> </Link>
                    <button className="check-out-o">CHECK OUT</button>
                </div>
            </div>
        );
    }
}

export default CartOverlay;