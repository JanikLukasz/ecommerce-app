import React, { Component } from 'react';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
import ProductDescription from './pages/ProductDescription';
import Cart from './pages/Cart';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';


// apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
      currencyActive: false,
      currencySelected: "$",
      productId: "",
      product: "",
      categorySelected: "all",
      idSelectedAttributes: [],
      idSelectedAttributesAll: [],
      attribute: "",
      cart: [],
      quantity: [],
      totalQuantity: 0
    };
  }
  componentDidUpdate() {
    window.localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleCurrencySelected = (currencySelected) => {
    this.setState({ currencySelected: currencySelected });
  }

  handleCategorySelected = (categorySelected) => {
    this.setState({ categorySelected: categorySelected });
  }

  handleIdSelectedAttributes = () => {
    this.setState({ idSelectedAttributes: [] });
  }

  addNewClass = (element, attribute, id) => {
    const idSelectedAttributes = this.state.idSelectedAttributes;
    const copyOFidSelectedAttributes = [...idSelectedAttributes];
    for (let i = 0; i < idSelectedAttributes.length; i++) {
      if (idSelectedAttributes[i].length > id.length) {
        if (idSelectedAttributes[i].includes(id.substring(id.length / 2, id.length))) {
          copyOFidSelectedAttributes.splice(i, 1);
        }
      } else {
        if (id.includes(idSelectedAttributes[i].substring(idSelectedAttributes[i].length / 2, idSelectedAttributes[i].length))) {
          copyOFidSelectedAttributes.splice(i, 1);
        }
      }
    }
    var allElements = document.getElementsByTagName("*");
    if (attribute.type === "swatch") {
      for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].id === element.id)
          allElements[i].classList.remove('swatch-attributes-selected');
      }
      element.classList.add('swatch-attributes-selected');
      this.setState({ idSelectedAttributes: [...copyOFidSelectedAttributes, id] });
    } else {
      for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].id === element.id)
          allElements[i].classList.remove('non-swatch-attributes-selected');
      }
      element.classList.add('non-swatch-attributes-selected');
      this.setState({ idSelectedAttributes: [...copyOFidSelectedAttributes, id] });
    }
  }

  displayAttributes(attribute, product) {
    if (attribute.type === "swatch") {
      return (
        attribute.items.map((item, index) => {
          return (
            <div className='swatch-attributes' key={index + item} id={attribute.name}>
              {index === 0 ? <div className='attribute-name'>{attribute.name.toUpperCase()}:</div> : null}
              <button onClick={(e) => this.addNewClass(e.target.parentElement, attribute, item.value + attribute.name + product.name + "x")}
                style={{ '--primary-color': item.value }}></button>
            </div>
          )
        })
      )
    } else {
      return (
        attribute.items.map((item, index) => {
          return (
            <div className='non-swatch-attributes' key={index + item} id={attribute.name}>
              {index === 0 ? <div className='attribute-name'>{attribute.name.toUpperCase()}:</div> : null}
              <button onClick={(e) => this.addNewClass(e.target.parentElement, attribute, item.value + attribute.name + product.name + "y")}>{item.value}</button>
            </div>
          )
        })
      )
    }
  }

  getPrice = (item) => {
    var indexPriceArray = this.state.currencySelected;
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
    const price = item.prices[indexPriceArray].amount;
    const symbol = item.prices[indexPriceArray].currency.symbol;
    return { price, symbol }
  }

  handleCartButtons = (index, i, quantity) => {
    const cart = this.state.cart;
    const idSelectedAttributesAll = this.state.idSelectedAttributesAll;

    // remove product from cart if quantity is 0
    if (quantity[index] + i < 1) {
      cart.splice(index, 1);
      idSelectedAttributesAll.splice(index, 1);
      quantity.splice(index, 1);
      this.setState({ cart: cart });
      this.setState({ idSelectedAttributesAll: idSelectedAttributesAll });
      this.setState({ quantity: quantity });
    }
    // increase/decrease quantity of the product 
    else {
      if (typeof quantity[index] === 'undefined') {
        quantity[index] = 1;
      }
      quantity[index] = quantity[index] + i;
    }

    let totalQuantity = 0;
    cart.map((item, index) => {
      this.setState({ totalQuantity: totalQuantity += quantity[index] });
    })
  }

  countTotalAndQuantity = () => {
    const cart = this.state.cart;
    const quantity = this.state.quantity;
    var total = 0;
    var totalQuantity = 0;
    var taxes = 0;
    cart.map((item, index) => {
      total += this.getPrice(item).price * quantity[index];
      totalQuantity += quantity[index];
      taxes += this.getPrice(item).price * 0.21 * quantity[index];
    })
    return { total, totalQuantity, taxes }
  };

  handleAddtoCart = (product, defaultAttributes) => {
    // check if the product is in stock 
    if (!product.inStock) {
      return;
    }
    let idSelectedAttributes = this.state.idSelectedAttributes;
    const idSelectedAttributesAll = this.state.idSelectedAttributesAll;

    // add product from product page (default attributes will be selected)
    if (defaultAttributes) {
      product.attributes.map((attribute) => {
        if (attribute.type === "swatch") {
          return (
            idSelectedAttributes = [...idSelectedAttributes, attribute.items[0].value + attribute.name + product.name + "x"]
          );
        } else {
          return (
            idSelectedAttributes = [...idSelectedAttributes, attribute.items[0].value + attribute.name + product.name + "y"]
          );
        }
      })
    }
 
    // check if all attributes are selected
    var allElements = document.getElementsByClassName("attribute");
    for (let i = 0; i < allElements.length; i++) {
      let attributeSelected = false;
      for (let y = 0; y < allElements[i].childNodes.length; y++) {
        if (allElements[i].childNodes[y].classList.contains('non-swatch-attributes-selected') ||
          allElements[i].childNodes[y].classList.contains('swatch-attributes-selected')) {
          attributeSelected = true;
        }
      }
      if (!attributeSelected) {
        return;
      }
    }

    // check if product is already in cart, if yes increase its quantity 
    for (let i = 0; i < idSelectedAttributesAll.length; i++) {
      if (idSelectedAttributesAll[i].toString() === idSelectedAttributes.toString()) {
        this.handleCartButtons(i, +1, this.state.quantity);
        return;
      }
    }

    // add product to the cart
    this.setState({ idSelectedAttributesAll: [...idSelectedAttributesAll, idSelectedAttributes] });
    const cart = this.state.cart;
    this.setState({ cart: [...cart, product] })
    const quantity = this.state.quantity;
    for (let i = 0; i <= cart.length; i++) {
      if (typeof quantity[i] === 'undefined') {
        quantity[i] = 1;
      }
    }
    this.setState({ quantity: quantity });
  }

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div>
            <Navbar handleCurrencySelected={this.handleCurrencySelected} currencySelected={this.state.currencySelected}
              handleCategorySelected={this.handleCategorySelected} categorySelected={this.state.categorySelected}
              countTotalAndQuantity={this.countTotalAndQuantity} handleIdSelectedAttributes={this.handleIdSelectedAttributes}
              cart={this.state.cart} idSelectedAttributesAll={this.state.idSelectedAttributesAll} quantity={this.state.quantity}
              getPrice={this.getPrice} handleCartButtons={this.handleCartButtons} />

            <Switch>

              <Route exact path={["/", "/:categoryname"]}>
                <ProductPage currencySelected={this.state.currencySelected} handleAddtoCart={this.handleAddtoCart} />
              </Route>

              <Route exact path="/product/:id">
                <ProductDescription displayAttributes={this.displayAttributes} addNewClass={this.addNewClass}
                  currencySelected={this.state.currencySelected} handleAddtoCart={this.handleAddtoCart}
                  countTotalAndQuantity={this.countTotalAndQuantity} />
              </Route>

              <Route exact path="/cart/bag">
                <Cart currencySelected={this.state.currencySelected} cart={this.state.cart}
                  idSelectedAttributesAll={this.state.idSelectedAttributesAll} quantity={this.state.quantity}
                  countTotalAndQuantity={this.countTotalAndQuantity} getPrice={this.getPrice}
                  handleCartButtons={this.handleCartButtons} />
              </Route>

            </Switch>

          </div>
        </ApolloProvider>
      </Router>
    );
  }
}

export default App;
