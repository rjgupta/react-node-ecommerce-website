import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

// context API: 
// Provider and Consumer 
const ProductContext = React.createContext();

class ProductProvider extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.tester = this.tester.bind(this);
  //   this.handleDetail = this.handleDetail.bind(this);
  // }

  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    // modal
    modalOpen: false,
    modalProduct: detailProduct,
    // cart
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  }

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(product => {
      const singleItem = { ...product };
      tempProducts = [...tempProducts, singleItem];
    })

    this.setState( () => {
      return {products: tempProducts}
    })
  }

  // utility method that gets the item based on id.
  getItem = (id) => {
    const product = this.state.products.find( item => item.id === id);
    return product;
  }

  // deatils page based on the id
  handleDetail = (id) => {
    // console.log('hello from details');
    const product = this.getItem(id);
    this.setState( () => {
      return {detailProduct: product}
    })
  }

  // adds product to the cart 
  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];

    // update values for the product that was added to the cart 
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    // change the values in the state 
    this.setState( () => {
      return { 
        products: tempProducts, 
        cart: [...this.state.cart, product] 
      }
    }, () => {
      this.addTotals();
    })
  }

  // modal methods:
  openModal = (id) => {
    const product = this.getItem(id);
    this.setState( () => {
      return {modalProduct: product, modalOpen: true}
    })
  }

  closeModal = () => {
    this.setState(() => {
      return {modalOpen: false}
    })
  }

  // cart methods 
  increment = (id) => {
    // console.log('increment method');
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count + 1;
    product.total = product.count * product.price;

    // updating the state
    this.setState( () => {
      return {
        cart: [...tempCart]
      }
    }, () => {
      this.addTotals();
    })

  }

  decrement = (id) => {
    // console.log('decrement method');
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count - 1;
    if(product.count === 0 ) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState( () => {
        return {
          cart: [...tempCart]
        }
      }, () => {
        this.addTotals();
      })
    }
  }

  removeItem = (id) => {
    // console.log('item removed, removeItem method');
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    // product
    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts]
      };
    }, () => {
      this.addTotals();
    })
  }

  clearCart = () => {
    // console.log('cart cleared, clearCart');
    this.setState(() => {
      return {
        cart: []
      }
    }, () => {
      this.setProducts();
      this.addTotals();
    });
  }

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total))
    const tempTax = subTotal * 0.08;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      }
    })
  }

  // *** testing for reference issue of the products ***
  // tester() {
  //   console.log('State product: ', this.state.products[0].inCart);
  //   console.log('Data product: ', storeProducts[0].inCart);

  //   const tempProducts = [...this.state.products];
  //   tempProducts[0].inCart = true
  //   this.setState( () => {
  //     return {products: tempProducts}
  //   }, () => {
  //     console.log('State product: ', this.state.products[0].inCart);
  //     console.log('Data product: ', storeProducts[0].inCart);
  //   })
  // }

  render() {
    return (
      // value can be an object too.
      <ProductContext.Provider 
        value={{ 
          ...this.state, 
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {/* <button onClick={this.tester}>Test Button</button> */}
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
