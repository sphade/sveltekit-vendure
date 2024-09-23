import { writable } from 'svelte/store';

export const modalStore = (modalState: boolean) => {
	const { subscribe, set, update } = writable(modalState);

	function setTrue() {
		set(true);
	}
	function setFalse() {
		set(false);
	}
	function toggleModal() {
		update((modalState) => (modalState = !modalState));
	}
	return {
		subscribe,
		setTrue,
		setFalse,
		toggleModal
	};
};
export const searchModalStore = modalStore(false);
export const registerModalStore = modalStore(false);
export const confirmEmailModalStore = modalStore(false);
export const loginModalStore = modalStore(false);
export const requestPasswordResetModalStore = modalStore(false);
export const productModalStore = modalStore(false);
export const cartSheetStore = modalStore(false);
export const addressModalStore = modalStore(false);
export const editAddressModalStore = modalStore(false);
export const enterDeliveryModalStore = modalStore(false);
export const mobileAuthStore = modalStore(false);
