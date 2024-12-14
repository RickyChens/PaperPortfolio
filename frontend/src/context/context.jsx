import { createContext, useState, useEffect } from "react";

export const Context = createContext();

const ContextProvider = (props) => {

    const [isLogin, setIsLogin] = useState(() => JSON.parse(localStorage.getItem('isLogin')) || false);
    const [isSell, setSell] = useState(() => JSON.parse(localStorage.getItem('isSell')) || false);
    const [isBuy, setBuy] = useState(() => JSON.parse(localStorage.getItem('isBuy')) || true);
    const [isLoggedIn, setLoggedIn] = useState(() => JSON.parse(localStorage.getItem('isLoggedIn')) || false);
    const [stockSelect, setStock] = useState({
        stock: "Apple",
        acronym: "APPL",
        category: "Stock"
    });
    const [data, setData] = useState(() => {
        return JSON.parse(localStorage.getItem("data")) || { user: "", balance: 0.0 };
    });
    
    useEffect(() => {
        localStorage.setItem('isLogin', JSON.stringify(isLogin));
        localStorage.setItem('isSell', JSON.stringify(isSell));
        localStorage.setItem('isBuy', JSON.stringify(isBuy));
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        localStorage.setItem("data", JSON.stringify(data));
    }, [data, isLogin, isSell, isBuy, isLoggedIn]);
    
    const logoutUser = () => {
        setIsLogin(false);
        setSell(false);
        setBuy(true);
        setLoggedIn(false);
        setStock({
            stock: "Apple",
            acronym: "APPL",
            category: "Stock"
        });
        setData({ user: "", balance: 0 });
        
        localStorage.removeItem('isLogin');
        localStorage.removeItem('isSell');
        localStorage.removeItem('isBuy');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('data');
    };

    const contextValue = {
        isLogin, logoutUser,
        setIsLogin,
        isSell, setSell,
        isBuy, setBuy,
        stockSelect, setStock,
        data, setData,
        isLoggedIn, setLoggedIn
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider