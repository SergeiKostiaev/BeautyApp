import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ServicesForm from './components/ServicesForm.js';
import MastersForm from './components/MastersForm.js';
import TimeSettingsForm from './components/TimeSettingsForm.js';

const AdminPanel = () => {
    return (
        <div>
            <h2>Admin Panel</h2>
            <nav>
                <ul>
                    <li><Link to="/admin/services/new">Добавить Услугу</Link></li>
                    <li><Link to="/admin/masters/new">Добавить Мастера</Link></li>
                    <li><Link to="/admin/time-settings">Настройка Временных Интервалов</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/admin/services/new" element={<ServicesForm />} />
                <Route path="/admin/masters/new" element={<MastersForm />} />
                <Route path="/admin/time-settings" element={<TimeSettingsForm />} />
            </Routes>
        </div>
    );
};

export default AdminPanel;
