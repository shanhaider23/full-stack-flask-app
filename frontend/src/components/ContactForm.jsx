import { useState } from 'react';

function ContactForm({
	existingContacts = {},
	updateCallback = () => {},
	closeModal = () => {},
}) {
	const [firstName, setFirstName] = useState(existingContacts.firstName || '');
	const [lastName, setLastName] = useState(existingContacts.lastName || '');
	const [email, setEmail] = useState(existingContacts.email || '');

	const updating = Object.entries(existingContacts).length !== 0;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = { firstName, lastName, email };
		const url =
			'http://127.0.0.1:5000/' +
			(updating ? `update_contact/${existingContacts.id}` : 'create_contact');

		const options = {
			method: updating ? 'PATCH' : 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};
		const response = await fetch(url, options);

		if (response.status !== 201 && response.status !== 200) {
			const resData = await response.json();
			alert(resData.message);
		} else {
			updateCallback(); // Refresh contact list
			closeModal(); // Close the modal after successful update
			setFirstName('');
			setLastName('');
			setEmail('');
		}
	};

	return (
		<div>
			<form className="contact-form" onSubmit={handleSubmit}>
				<label htmlFor="firstName">First Name:</label>
				<input
					type="text"
					id="firstName"
					name="firstName"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
				<label htmlFor="lastName">Last Name:</label>
				<input
					type="text"
					id="lastName"
					name="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button type="submit">{updating ? 'Update' : 'Create'}</button>
			</form>
		</div>
	);
}

export default ContactForm;
