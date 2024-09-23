import { graphql } from '$houdini';

const ActiveOrder = graphql(`
	fragment ActiveOrder on Order {
		__typename
		id
		code
		couponCodes
		state
		currencyCode
		totalQuantity
		subTotalWithTax
		shippingWithTax
		totalWithTax
		billingAddress {
			fullName
			streetLine1
			country
			streetLine2
			city
			__typename
		}
		shippingAddress {
			fullName
			streetLine1
			country
			streetLine2
			city
			postalCode
			countryCode
			phoneNumber
			province
			__typename
		}
		customer {
			firstName
			lastName
			phoneNumber
			emailAddress
		}
		discounts {
			description
			amountWithTax
		}
		lines {
			id
			unitPriceWithTax
			quantity
			linePriceWithTax
			productVariant {
				id
				name
				sku
			}
			featuredAsset {
				id
				preview
			}
		}
		shippingLines {
			shippingMethod {
				description
			}
			priceWithTax
		}
	}
`);

export const user = graphql(`
	query User {
		activeCustomer {
			firstName
			lastName
			emailAddress
			phoneNumber
			id
			__typename
			addresses {
				id
				fullName
				city
				postalCode
				streetLine1
				streetLine2
				phoneNumber
				country {
					name
					code
				}
				province
				defaultBillingAddress
				defaultShippingAddress
			}
			orders {
				items {
					active
					id
					lines {
						linePriceWithTax
						orderPlacedQuantity
						quantity
						featuredAsset {
							preview
						}
						productVariant {
							name
							priceWithTax
							sku
							productId
							id
						}
						linePriceWithTax
					}
					currencyCode
					orderPlacedAt
					state
					code
					subTotalWithTax
				}
			}
		}
	}
`);

export const countries = graphql(`
	query Countries {
		availableCountries {
			name
			id
			code
			type
		}
	}
`);

export const productDetails = graphql(`
	query ProductDetails($slug: String!) {
		product(slug: $slug) {
			id
			name
			description

			featuredAsset {
				id
				preview
			}
			assets {
				id
				preview
			}
			variants {
				id
				name
				sku
				stockLevel
				currencyCode

				price
				priceWithTax
				featuredAsset {
					id
					preview
				}
				assets {
					id
					preview
				}
			}
		}
	}
`);

export const productDetailById = graphql(`
	query ProductDetailById($id: ID!) {
		product(id: $id) {
			id
			name
			featuredAsset {
				id
				preview
			}
		}
	}
`);
export const getActiveOrder = graphql(`
	query GetActiveOrder {
		activeOrder {
			id
			...ActiveOrder
		}
	}
`);

export const getShippingMethods = graphql(`
	query GetShippingMethods {
		eligibleShippingMethods {
			id
			price
			description
			name
			priceWithTax
		}
	}
`);
export const getPaymentMethods = graphql(`
	query GetPaymentMethods {
		eligiblePaymentMethods {
			id
			name
			code
			isEligible
		}
	}
`);

export const getOrderByCode = graphql(`
	query GetOrderByCode($code: String!) {
		orderByCode(code: $code) {
			__typename
			id
			code
			couponCodes
			state
			currencyCode
			totalQuantity
			subTotalWithTax
			shippingWithTax
			totalWithTax
			billingAddress {
				fullName
				streetLine1
				country
				streetLine2
				city
				__typename
			}
			shippingAddress {
				fullName
				streetLine1
				country
				streetLine2
				city
				__typename
			}
			customer {
				firstName
			}
			discounts {
				description
				amountWithTax
			}
			lines {
				id
				unitPriceWithTax
				quantity
				linePriceWithTax

				productVariant {
					id
					name
					sku
				}
				featuredAsset {
					id
					preview
				}
			}
			shippingLines {
				shippingMethod {
					description
				}
				priceWithTax
			}
		}
	}
`);

export const getTopLevelCollections = graphql(`
	query GetTopLevelCollections {
		collections(options: { topLevelOnly: true }) {
			items {
				id
				slug
				name
				parentId
				featuredAsset {
					id
					preview
				}
			}
		}
	}
`);

export const products = graphql(`
	query Products(
		$term: String!
		$skip: Int
		$take: Int
		$facetValueFilters: [FacetValueFilterInput!]
		$collectionSlug: String
		$sortName: SortOrder
		$sortPrice: SortOrder
		$inStock: Boolean
	) {
		search(
			input: {
				term: $term
				groupByProduct: true
				skip: $skip
				take: $take
				facetValueFilters: $facetValueFilters
				collectionSlug: $collectionSlug
				sort: { name: $sortName, price: $sortPrice }
				inStock: $inStock
			}
		) {
			totalItems
			facetValues {
				count
				facetValue {
					id
					name
					facet {
						id
						name
					}
				}
			}
			collections {
				collection {
					name
					slug
					parentId
				}
			}
			items {
				productName
				slug
				productAsset {
					id
					preview
				}

				priceWithTax {
					... on SinglePrice {
						value
					}
					... on PriceRange {
						min
						max
					}
				}
				collectionIds
				score
				productId
				currencyCode
				inStock
				description
			}
		}
	}
`);
