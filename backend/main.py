from flask import request, jsonify
from config import app, db
from models import Contact  

@app.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.to_json() for contact in contacts]), 200

@app.route('/create_contact', methods=['POST'])
def create_contact():
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    email = request.json.get('email')
    if not first_name or not last_name or not email:
        return jsonify({'message': 'Please provide first name, last name and email'}), 400
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    return jsonify({'message': 'New contact created!'}), 201

@app.route('/update_contact/<int:user_id>', methods=['OPTIONS', 'PATCH'])
def update_contact(user_id):
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight request

    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({'message': 'Contact not found!'}), 404

    contact.first_name = request.json.get('firstName', contact.first_name)
    contact.last_name = request.json.get('lastName', contact.last_name)
    contact.email = request.json.get('email', contact.email)

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    return jsonify({'message': 'Contact updated!'}), 200

@app.route('/delete_contact/<int:user_id>', methods=['OPTIONS', 'DELETE'])
def delete_contact(user_id):
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight request

    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({'message': 'Contact not found!'}), 404
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted!'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
