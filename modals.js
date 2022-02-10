const modals = (message) => {
	const modal = document.createElement('div');
	const modalContent = document.createElement('div');
	const close = document.createElement('span');

	function createModal(modal, modalContent, close) {
		modal.className = 'modal';
		document.body.append(modal);
		modal.addEventListener('click', closeModal)

		modalContent.className = 'modal-content';
		modalContent.innerHTML = `<div style="color: red;"><strong>Error</strong></div> <br> ${message}`;
		document.body.append(modalContent);

		close.innerHTML = '&times;';
		close.className = 'closeModal';
		close.addEventListener('click', closeModal)
		modalContent.append(close);

		document.body.style.overflow = "hidden";
		document.addEventListener('keydown', closeModal);
	}

	function closeModal(event) {
		if (event.target === close || event.target === modal || event.key === "Escape") {
			modal.style.display = "none";
			modalContent.style.display = "none";
			document.body.style.overflow = "";
		}
		close.removeEventListener('click', closeModal);
		modal.removeEventListener('click', closeModal);
		document.removeEventListener('keydown', closeModal);
	}
	createModal(modal, modalContent, close);
};

export default modals;