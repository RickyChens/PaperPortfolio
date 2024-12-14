import { React, useContext, useState, useEffect } from 'react';
import { Context } from '../../context/context';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './AccountInfo.css';

const AccountInfo = () => {
    const { data, setData } = useContext(Context);
    const [balance, setBalance] = useState(0);
    const [date, setDate] = useState();
    const [newBalance, setNewBalance] = useState(0);
    const [stocks, setStocks] = useState([]);

    const parseDecimal = (value) => {
        if (value && value.$numberDecimal) {
            return parseFloat(value.$numberDecimal);
        }
        return value;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/profile', {
                    withCredentials: true,
                });

                if (!response) {
                    toast.error('No response');
                    return;
                }

                const { balance, creationDate, stocks } = response.data;

                setBalance(parseDecimal(balance));
                setDate(new Date(creationDate));
                setStocks(
                    stocks.map((stock) => ({
                        ...stock,
                        amount: parseDecimal(stock.amount),
                    }))
                );
            } catch (err) {
                toast.error(err.response?.data?.error || 'Error fetching profile');
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const regex = /^\d+\.?\d{0,2}$/;

        const value = e.target.value;
        if (regex.test(value)) {
            setNewBalance(value);
        }
    };

    const updateBalance = async () => {
        try {
            const setBalance = { balance: Number(newBalance) };
            const response = await axios.put('/setBalance', setBalance, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (!response) {
                toast.error('No response');
                return;
            }

            if (response.error) {
                toast.error(response.error);
                return;
            }

            setData((prev) => ({ ...prev, balance: response.data.user.balance }));
            setBalance(response.data.user.balance);
            toast.success(response.data.message);
        } catch (err) {
            console.error('Error updating balance:', err);
            toast.error('An unexpected error occurred');
        }
    };

    const calculateAccountAge = () => {
        const now = new Date();
        const diffInMs = now - date;

        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInYears = Math.floor(diffInDays / 365);
        const remainingDays = diffInDays % 365;

        return `${diffInYears} years and ${remainingDays} days`;
    };

    return (
            <div className="Top-Container">
                <h1>{data.user}</h1>
                <div className="boxes">
                    <div className="Info-Box">
                        <p>Account Age: {calculateAccountAge()}</p>
                    </div>
                    <div className="Container-Set-Balance">
                        <input
                            className="Set-Balance"
                            placeholder="Set Balance"
                            value={newBalance}
                            onChange={handleInputChange}
                        />
                        <button onClick={updateBalance}>Set</button>
                    </div>
                    <div className="Info-Box">
                        <p>Balance: {balance}</p>
                    </div>
                </div>

                <div className="Stocks-Container">
                    <h2>Stocks Held:</h2>
                    {stocks.length > 0 ? (
                        <ul>
                            {stocks.map((stock, index) => (
                                <li key={stock._id}>
                                    <strong>{stock.stock}</strong> - {stock.amount} shares
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No stocks held</p>
                    )}
                </div>
            </div>
    );
};

export default AccountInfo;
