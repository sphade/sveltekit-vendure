import { graphql } from '$houdini';
export const registerUser = graphql(`
	mutation Register($input: RegisterCustomerInput!) {
		registerCustomerAccount(input: $input) {
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const logout = graphql(`
	mutation Logout {
		logout {
			success
		}
	}
`);

export const verifyAccount = graphql(`
	mutation Verify($token: String!) {
		verifyCustomerAccount(token: $token) {
			... on CurrentUser {
				id
				identifier
				channels {
					id
				}
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const requestPasswordReset = graphql(`
	mutation RequestPasswordReset($emailAddress: String!) {
		requestPasswordReset(emailAddress: $emailAddress) {
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);
export const resetPassword = graphql(`
	mutation ResetPassword($token: String!, $password: String!) {
		resetPassword(token: $token, password: $password) {
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);
export const updatePassword = graphql(`
	mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
		updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const updateCustomer = graphql(`
	mutation UpdateCustomer($input: UpdateCustomerInput!) {
		updateCustomer(input: $input) {
			... on Customer {
				phoneNumber
				lastName
				firstName
				emailAddress
				title
				id
			}

			__typename
		}
	}
`);

export const requestEmailUpdate = graphql(`
	mutation RequestEmailUpdate($newEmail: String!, $password: String!) {
		requestUpdateCustomerEmailAddress(newEmailAddress: $newEmail, password: $password) {
			... on Success {
				success
			}
			__typename
		}
	}
`);
export const updateEmail = graphql(`
	mutation UpdateEmail($token: String!) {
		updateCustomerEmailAddress(token: $token) {
			__typename
		}
	}
`);

export const addAddress = graphql(`
	mutation AddAddress($input: CreateAddressInput!) {
		createCustomerAddress(input: $input) {
			fullName
			id
		}
	}
`);
export const editAddress = graphql(`
	mutation EditAddress($input: UpdateAddressInput!) {
		updateCustomerAddress(input: $input) {
			id
			fullName
		}
	}
`);

export const deleteAddress = graphql(`
	mutation DeleteAddress($id: ID!) {
		deleteCustomerAddress(id: $id) {
			success
		}
	}
`);

export const addItemToOrder = graphql(`
	mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
		addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
			... on ErrorResult {
				errorCode
				message
			}
			... on InsufficientStockError {
				quantityAvailable
			}
		}
	}
`);
export const removeItemFromOrder = graphql(`
	mutation RemoveItemFromOrder($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const adjustOrderLine = graphql(`
	mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const setCustomerForOrder = graphql(`
	mutation SetCustomerForOrder($input: CreateCustomerInput!) {
		setCustomerForOrder(input: $input) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const setOrderShippingAddress = graphql(`
	mutation SetOrderShippingAddress($input: CreateAddressInput!) {
		setOrderShippingAddress(input: $input) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const setShippingMethod = graphql(`
	mutation SetShippingMethod($id: [ID!]!) {
		setOrderShippingMethod(shippingMethodId: $id) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);

export const transitionToState = graphql(`
	mutation TransitionToState($state: String!) {
		transitionOrderToState(state: $state) {
			... on OrderStateTransitionError {
				errorCode
				message
				transitionError
				fromState
				toState
			}
		}
	}
`);

export const addPaymentToOrder = graphql(`
	mutation AddPaymentToOrder($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`);
