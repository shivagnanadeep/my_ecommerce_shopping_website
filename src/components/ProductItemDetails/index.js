import './index.css';
import Header from '../Header';
import { Component } from 'react';
import Cookies from 'js-cookie';
import { BsPlusSquare } from 'react-icons/bs';
import { BsDashSquare } from 'react-icons/bs';
import SimilarProductItem from '../SimilarProductItem';
import Loader from 'react-loader-spinner';
import CartContext from '../../context/CartContext';

const statusConstants = {
	initial: 'INITIAL',
	success: 'SUCCESS',
	failure: 'FAILURE',
	loading: 'LOADING',
};

class ProductItemDetails extends Component {
	state = {
		productData: {},
		status: statusConstants.initial,
		similarProducts: [],
		quantity: 1,
	};

	componentDidMount() {
		this.getProduct();
	}

	getProduct = async () => {
		this.setState({ status: statusConstants.loading });
		const { match } = this.props;
		const { params } = match;
		const { id } = params;
		const jwtToken = Cookies.get('jwt_token');
		const url = `https://apis.ccbp.in/products/${id}`;
		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		};
		const response = await fetch(url, options);
		if (response.ok === true) {
			const productDetails = await response.json();
			const updatedProductDetails = {
				id: productDetails.id,
				imageUrl: productDetails.image_url,
				title: productDetails.title,
				brand: productDetails.brand,
				price: productDetails.price,
				description: productDetails.description,
				totalReviews: productDetails.total_reviews,
				rating: productDetails.rating,
				availability: productDetails.availability,
			};
			const updatedSimilarProducts = productDetails.similar_products.map(
				(each) => ({
					id: each.id,
					imageUrl: each.image_url,
					title: each.title,
					style: each.style,
					price: each.price,
					description: each.description,
					brand: each.brand,
					totalReviews: each.total_reviews,
					rating: each.rating,
					availability: each.availability,
				})
			);
			this.setState({
				productData: updatedProductDetails,
				similarProducts: updatedSimilarProducts,
				status: statusConstants.success,
			});
		} else {
			this.setState({ status: statusConstants.failure });
		}
	};

	incrementQuantity = () => {
		this.setState((prevState) => ({ quantity: prevState.quantity + 1 }));
	};

	decrementQuantity = () => {
		const { quantity } = this.state;
		if (quantity > 1) {
			this.setState({ quantity: quantity - 1 });
		}
	};

	continueShopping = () => {
		const { history } = this.props;
		history.replace('/products');
	};

	renderFailureView = () => {
		return (
			<div className="view-container">
				<img
					src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
					alt="error view"
					className="failure-view-image"
				/>
				<h1>Product Not Found</h1>
				<button
					className="add-to-cart-button"
					type="button"
					onClick={this.continueShopping}
				>
					Continue Shopping
				</button>
			</div>
		);
	};

	renderProductDetails = () => (
		<CartContext.Consumer>
			{(value) => {
				const { addCartItem } = value;
				const { productData, quantity, similarProducts } = this.state;
				const {
					imageUrl,
					title,
					price,
					description,
					brand,
					totalReviews,
					rating,
					availability,
				} = productData;
				const onClickAddToCart = () => {
					addCartItem({ ...productData, quantity });
				};
				return (
					<div className="product-item-details-container">
						<div className="product-item-details">
							<img
								src={imageUrl}
								alt="product"
								className="product-item-details-image"
							/>
							<div className="product-item-details-description">
								<h1 className="product-item-title">{title}</h1>
								<p className="product-item-price">{`Rs ${price}/-`}</p>
								<div className="rating-and-review-container">
									<div className="rating-container">
										<p>{rating}</p>
										<img
											src="https://assets.ccbp.in/frontend/react-js/star-img.png"
											alt="star"
											className="star-image"
										/>
									</div>
									<p className="product-item-reviews">{totalReviews} Reviews</p>
								</div>
								<p className="product-description">{description}</p>
								<p className="product-extra-details">
									Available:{' '}
									<span className="details-value">{availability}</span>
								</p>
								<p className="product-extra-details">
									Brand: <span className="details-value">{brand}</span>
								</p>
								<hr className="hr" />
								<div className="product-item-count">
									<button
										type="button"
										className="product-count-changer"
										onClick={this.decrementQuantity}
									>
										<BsDashSquare className="product-count-changer-icon" />
									</button>
									<p className="product-count">{quantity}</p>
									<button
										type="button"
										className="product-count-changer"
										onClick={this.incrementQuantity}
									>
										<BsPlusSquare className="product-count-changer-icon" />
									</button>
								</div>
								<button
									type="button"
									className="add-to-cart-button"
									onClick={onClickAddToCart}
								>
									ADD TO CART
								</button>
							</div>
						</div>
						<div className="similar-products-container">
							<h1 className="similar-products-title">Similar Products</h1>
							<ul className="similar-products-list">
								{similarProducts.map((each) => (
									<SimilarProductItem
										productDetails={each}
										key={each.id}
									/>
								))}
							</ul>
						</div>
					</div>
				);
			}}
		</CartContext.Consumer>
	);

	renderLoadingView = () => (
		<div
			className="view-container"
			data-testid="loader"
		>
			<Loader
				type="ThreeDots"
				color="#0b69ff"
				height={80}
				width={80}
			/>
		</div>
	);

	renderViews = () => {
		const { status } = this.state;
		switch (status) {
			case statusConstants.success:
				return this.renderProductDetails();
			case statusConstants.failure:
				return this.renderFailureView();
			case statusConstants.loading:
				return this.renderLoadingView();
			default:
				return null;
		}
	};

	render() {
		return (
			<>
				<Header />
				{this.renderViews()}
			</>
		);
	}
}
export default ProductItemDetails;
