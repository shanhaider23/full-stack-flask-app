const ContactList = ({ contacts, updateContact, updateCallback }) => {
	const onDelete = async (id) => {
		try {
			const options = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const response = await fetch(
				`http://localhost:5000/delete_contact/${id}`,
				options
			);
			if (response.status === 200) {
				updateCallback();
			} else {
				console.error('Error deleting contact:', response);
			}
		} catch (error) {
			alert('Error deleting contact:', error);
		}
	};
	return (
		<div>
			<h2>Contact List</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{contacts.map((contact) => (
						<tr key={contact.id}>
							<td>
								{contact.firstName} {contact.lastName}
							</td>
							<td>{contact.phone}</td>
							<td>{contact.email}</td>
							<td>
								<button onClick={() => updateContact(contact)}>Edit</button>
								<button onClick={() => onDelete(contact.id)}>Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ContactList;
