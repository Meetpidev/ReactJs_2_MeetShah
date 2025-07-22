import React, { useState, useMemo } from 'react';


const initialUsers = ['Meet', 'Rushikesh', 'Rahul', 'Yash'];
const INITIAL_BALANCE = 50; 


function Expense() {
  
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(initialUsers[0]);
  const [participants, setParticipants] = useState(
    initialUsers.map(u => ({ name: u, included: true }))
  );
 
  const [Alert, setAlert] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');

  
  const showCustomModal = (message) => {
    setAlertMessage(message);
    setAlert(true);
  };

  // addExpense
  const addExpense = (e) => {
    e.preventDefault(); 

   
    if (!description.trim() || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showCustomModal("Please enter a valid description and a positive amount.");
      return;
    }
    
    const Users = participants.filter(p => p.included).map(p => p.name);

 
    if (Users.length === 0) {
      showCustomModal("Please select at least one participant.");
      return;
    }


    setExpenses([...expenses, {
      id: Date.now(), 
      description: description.trim(),
      amount: parseFloat(amount),
      payer,
      participants: Users,
    }]);

 
    setDescription('');
    setAmount('');
    setPayer(initialUsers[0]); 
    setParticipants(initialUsers.map(u => ({ name: u, included: true }))); 
    showCustomModal("Expense added successfully!");
  };


  const toggleParticipant = (name) => {
    setParticipants(participants.map(p =>
      p.name === name ? { ...p, included: !p.included } : p
    ));
  };

  // Deletes an expense 
  const deleteExpense = (id) => {
    
    setAlertMessage("Are you sure you want to delete this expense?");
    setAlert(true);

    const confirmAction = () => {
      setExpenses(expenses.filter(e => e.id !== id));
      setAlert(false); 
      showCustomModal("Expense deleted successfully!");
    };

    setAlertMessage(
      <>
        Are you sure you want to delete this expense?
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '10px' }}>
          <button
            onClick={() => setAlert(false)}
            style={{ padding: '8px 15px',color:'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#0a0a0aff' }}
          >
            Cancel
          </button>
          <button
            onClick={confirmAction}
            style={{ padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white' }}
          >
            Delete
          </button>
        </div>
      </>
    );
    setAlert(true);
  };

  
  const balances = useMemo(() => {
    const currentBalances = {};

    initialUsers.forEach(u => (currentBalances[u] = INITIAL_BALANCE));

    expenses.forEach((e) => {
      const share = e.amount / e.participants.length;
     
      initialUsers.forEach(user => {
        if (e.participants.includes(user)) {
          if (user === e.payer) {
          
            currentBalances[user] += (e.amount - share);
          } else {
            currentBalances[user] -= share;
          }
        }
      });
    });
    return currentBalances;
  }, [expenses]);

  const suggestions = () => {
   
    const users = Object.entries({ ...balances });
   
    users.sort((a, b) => a[1] - b[1]);

    const transactions = [];
    let i = 0;
    let j = users.length - 1; 

    while (i < j && users[i][1] < 0 && users[j][1] > 0) {
      const debtor = users[i][0];
      const creditor = users[j][0];
     
      const move = Math.min(Math.abs(users[i][1]), users[j][1]);
      
      if (move > 0.01) {
        transactions.push({ from: debtor, to: creditor, amount: move.toFixed(2) });
      }

      users[i][1] += move; 
      users[j][1] -= move; 


      if (Math.abs(users[i][1]) < 0.01) i++;
      if (Math.abs(users[j][1]) < 0.01) j--;
    }
    return transactions;
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
      <style>
        {`
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          h1, h2, h3 {
            color: #333;
            margin-bottom: 15px;
          }
          h1 {
            font-size: 2em;
            text-align: center;
          }
          h2 {
            font-size: 1.5em;
          }
          .section-container {
            background-color: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
          }
          input[type="text"],
          input[type="number"],
          select {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
          }
          button {
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            margin-top: 10px;
          }
          button:hover {
            opacity: 0.9;
          }
          .participant-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 10px;
          }
          .expense-item {
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .expense-item div {
            flex-grow: 1;
          }
          .expense-item button {
            background-color: #dc3545;
            margin-left: 10px;
            padding: 8px 12px;
            font-size: 0.9em;
          }
          .balance-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #eee;
          }
          .balance-item:last-child {
            border-bottom: none;
          }
          .text-red {
            color: #dc3545;
          }
          .text-green {
            color: #28a745;
          }
          .suggestion-item {
            padding: 8px 0;
            border-bottom: 1px dashed #eee;
          }
          .suggestion-item:last-child {
            border-bottom: none;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background-color: white;
            padding: 25px;
            border: 1px solid #ccc;
            width: 90%;
            max-width: 400px;
          }
          .modal-content button {
            width: 100%;
            margin-top: 20px;
          }
        `}
      </style>

      <h1 style={{ marginBottom: '20px' }}>Expenses Sharing App</h1>

      
      <div className="section-container">
        <h2>Add New Expense</h2>
        <form onSubmit={addExpense}>
          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <input
              type="text"
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>Amount</label>
            <input
              type="number"
              id="amount"
              placeholder="e.g., 75.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="payer" style={{ display: 'block', marginBottom: '5px' }}>Payer</label>
            <select
              id="payer"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            >
              {initialUsers.map(user => <option key={user} value={user}>{user}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px' }}>Participants</label>
            <div className="participant-checkbox-group">
              {participants.map(p => (
                <label key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={p.included}
                    onChange={() => toggleParticipant(p.name)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="section-container">
        <h2>Expenses</h2>
        {expenses.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No expenses added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {expenses.map(e => (
              <li key={e.id} className="expense-item">
                <div>
                  <p>
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>{e.payer}</span> paid <span style={{ fontWeight: 'bold', color: '#28a745' }}>${e.amount.toFixed(2)}</span> for <span style={{ fontStyle: 'italic' }}>"{e.description}"</span>
                  </p>
                  <p style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                    Split among: {e.participants.join(', ') || 'No participants'}
                  </p>
                </div>
                <button onClick={() => deleteExpense(e.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Balances Summary */}
      <div className="section-container">
        <h2>Balances</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {initialUsers.map(user => (
            <li key={user} className="balance-item">
              <span style={{ fontWeight: 'bold' }}>{user}:</span>
              <span className={balances[user] < INITIAL_BALANCE ? 'text-red' : 'text-green'}>
                ${balances[user].toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>


      <div className="section-container">
        <h2>Settle Up Suggestions</h2>
        {suggestions().length === 0 ? (
          <p style={{ opacity: 0.7 }}>No payments needed to settle up.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestions().map((t, i) => (
              <li key={i} className="suggestion-item">
                <span style={{ fontWeight: 'bold' }}>{t.from}</span> owes <span style={{ fontWeight: 'bold' }}>{t.to}</span> <span style={{ fontWeight: 'bold' }}>${t.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

   
      {Alert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2em', marginBottom: '15px' }}>Notification</h3>
            <div style={{ marginBottom: '20px' }}>{AlertMessage}</div>
            {typeof AlertMessage === 'string' && (
              <button
                onClick={() => setAlert(false)}
                style={{ backgroundColor: '#007bff' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Expense;
