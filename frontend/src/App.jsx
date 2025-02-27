import { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import './App.css';
import ContactForm from './components/ContactForm';

function App() {
	const [contacts, setContacts] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentContacts, setCurrentContacts] = useState({});

	useEffect(() => {
		fetchContact();
	}, []);

	const fetchContact = async () => {
		try {
			const response = await fetch('http://127.0.0.1:5000/contacts');
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			console.log('Fetched data:', data);
			setContacts(data);
		} catch (error) {
			console.error('Error fetching contacts:', error);
			setContacts([]);
		}
	};

	const openModal = () => {
		setIsModalOpen(true); // Now correctly opens the modal
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setCurrentContacts({});
	};

	const openEditModel = (contact) => {
		if (isModalOpen) return;
		setCurrentContacts(contact);
		openModal();
	};

	const onUpdate = () => {
		closeModal();
		fetchContact();
	};

	return (
		<>
			<ContactList
				contacts={contacts}
				updateContact={openEditModel}
				updateCallback={onUpdate}
			/>
			<button onClick={openModal}>Create Contact</button>
			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={closeModal}>
							&times;
						</span>
						<ContactForm
							existingContacts={currentContacts}
							updateCallback={onUpdate}
							closeModal={closeModal}
						/>

						<p>Modal content</p>
					</div>
				</div>
			)}
		</>
	);
}

export default App;
