import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './evestlist.css';

function EventList() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const apiUrl = 'http://localhost:8000/api/events/';

        axios.get(apiUrl)
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);

    const handleEditClick = (eventId) => {
        // Fetch the details of the selected event
        axios.get(`http://localhost:8000/api/events/${eventId}/`)
            .then(response => {
                setSelectedEvent(response.data);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Update the event details
        axios.put(`http://localhost:8000/api/events/${selectedEvent.id}/`, selectedEvent)
            .then(response => {
                // Update the event list with the updated event
                const updatedEvents = events.map(event => (event.id === selectedEvent.id ? selectedEvent : event));
                setEvents(updatedEvents);
                setSelectedEvent(null);
            })
            .catch(error => {
                console.error('Error updating event:', error);
            });
    };

    const handleDelete = (eventId) => {
        // Delete the event
        axios.delete(`http://localhost:8000/api/events/${eventId}/`)
            .then(response => {
                // Remove the event from the events list
                const updatedEvents = events.filter(event => event.id !== eventId);
                setEvents(updatedEvents);
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
    };

    return (
        <div className="event-list-container">
            <h1>Data Fetched from the Server</h1>
            <ul className="event-list">
                {events.map(event => (
                    <li key={event.id} className="event-item">
                        <h2 className="event-title">{event.title}</h2>
                        <p className="event-description">{event.description}</p>
                        <p className="event-info">Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p className="event-info">Location: {event.location}</p>
                        <p className="event-info">Organizer: {event.organizer}</p>
                        <button className="delete-button" onClick={() => handleDelete(event.id)}>Delete</button>
                        <button className="edit-button" onClick={() => handleEditClick(event.id)}>Edit</button>

                    </li>
                ))}
            </ul>

            {selectedEvent && (
                <div className="edit-form">
                    <h2>Edit Event</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="title" value={selectedEvent.title} onChange={handleInputChange} />
                        <textarea name="description" value={selectedEvent.description} onChange={handleInputChange} />
                        <input type="text" name="location" value={selectedEvent.location} onChange={handleInputChange} />
                        <input type="date" name="date" value={selectedEvent.date} onChange={handleInputChange} />
                        <button type="submit">Update Event</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EventList;
