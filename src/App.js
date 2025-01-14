import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import ProductItemDetails from './components/ProductItemDetails';
import CartContext from './context/CartContext';
import { Component } from 'react';

class App extends Component {
	state = { cartList: [] };

	addCartItem = (product) => {
		const { cartList } = this.state;
		const existingProduct = cartList.find((each) => each.id === product.id);

		if (existingProduct) {
			this.setState((prevState) => ({
				cartList: prevState.cartList.map((each) =>
					each.id === product.id
						? { ...each, quantity: each.quantity + product.quantity }
						: each
				),
			}));
		} else {
			this.setState((prevState) => ({
				cartList: [...prevState.cartList, product],
			}));
		}
	};

	removeCartItem = (id) => {
		this.setState((prevState) => ({
			cartList: prevState.cartList.filter((each) => each.id !== id),
		}));
	};

	incrementCartItemQuantity = (id) => {
		this.setState((prevState) => ({
			cartList: prevState.cartList.map((each) => {
				if (each.id === id) {
					const eachItem = {
						...each,
						quantity: each.quantity + 1,
					};
					return eachItem;
				}
				return each;
			}),
		}));
	};

	decrementCartItemQuantity = (id) => {
		this.setState((prevState) => ({
			cartList: prevState.cartList.map((each) => {
				if (each.id === id) {
					const { quantity } = each;
					if (quantity > 1) {
						const eachItem = {
							...each,
							quantity: each.quantity - 1,
						};
						return eachItem;
					}
					return each;
				}
				return each;
			}),
		}));
	};

	render() {
		const { cartList } = this.state;
		return (
			<BrowserRouter>
				<CartContext.Provider
					value={{
						cartList,
						addCartItem: this.addCartItem,
						removeCartItem: this.removeCartItem,
						removeAllCartItems: this.removeAllCartItems,
						incrementCartItemQuantity: this.incrementCartItemQuantity,
						decrementCartItemQuantity: this.decrementCartItemQuantity,
					}}
				>
					<Switch>
						<Route
							exact
							path="/login"
							component={LoginForm}
						/>
						<ProtectedRoute
							exact
							path="/"
							component={Home}
						/>
						<ProtectedRoute
							exact
							path="/products"
							component={Products}
						/>
						<ProtectedRoute
							exact
							path="/cart"
							component={Cart}
						/>
						<ProtectedRoute
							exact
							path="/products/:id"
							component={ProductItemDetails}
						/>
						<Route
							path="/not-found"
							component={NotFound}
						/>
						<Redirect to="/not-found" />
					</Switch>
				</CartContext.Provider>
			</BrowserRouter>
		);
	}
}

export default App;
