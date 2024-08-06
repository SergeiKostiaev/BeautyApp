import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Avatar, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledListItem = styled(ListItem)(({ selected }) => ({
    backgroundColor: selected ? '#252525' : '#D9D9D9',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '10px',
    cursor: 'pointer',
    border: selected ? '2px solid #252525' : 'none',
}));

const BranchesPage = () => {
    const { t } = useTranslation();
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('https://devprimeclients.ru/api/branches/');
                console.log('API response:', response.data); // Debugging line
                if (Array.isArray(response.data)) {
                    setBranches(response.data);
                } else {
                    console.error('Expected an array of branches but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranches();
    }, []);

    const handleBranchClick = (branchId) => {
        setSelectedBranch(branchId);
    };

    return (
        <div style={{ marginTop: '70px', marginLeft: '20px', marginRight: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontSize: '25px', fontWeight: '600' }}>
                {t('select_branch')}
            </Typography>
            <List>
                {branches.map((branch) => (
                    <StyledListItem
                        key={branch._id}
                        onClick={() => handleBranchClick(branch._id)}
                        selected={selectedBranch === branch._id}
                    >
                        <Avatar src={`https://devprimeclients.ru${branch.imageUrl}`} />
                        <ListItemText primary={t(`branches.${branch.name}`)} />
                    </StyledListItem>
                ))}
            </List>
        </div>
    );
};

export default BranchesPage;
