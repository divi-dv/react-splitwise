import { useState } from 'react';
import './index.css';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [allFriends, setAllFriends] = useState(initialFriends);
  const [billFriend, setBillFriend] = useState("")
  const [addFriend,setAddFriend] = useState(false)

  function handleAddNewFriend(fname,fimage){
    setAddFriend(false)
    const newFriend = {id: crypto.randomUUID(), name:fname, image:fimage, balance:0}
    setAllFriends([...allFriends,newFriend])
  }

  function handleFriendSelection(name){
    setAddFriend(false)
    setBillFriend(name)
  }

  function handleUpdateBalance(balance){
    let newAllFriend = allFriends
    newAllFriend.forEach((friend)=>{
      if (friend.name===billFriend){
        friend.balance = friend.balance+balance
      }
    })
    setAllFriends(newAllFriend)
    setBillFriend("")
  }
  return (
    <div className='app'>
      <div className="sidebar">
        <FriendsList allFriends={allFriends} billFriend={billFriend} onFriendSelected={handleFriendSelection}/>
          {!addFriend ?
            <Button onButtonClick={()=>{
              setBillFriend("");
              setAddFriend(true);
            }}>Add friend</Button>
            :
            (
            <div>
              <FormAddFriend onAddFriend={handleAddNewFriend}/>
              <Button onButtonClick={()=>setAddFriend(false)}>Close</Button>
            </div>
            )
          }
      </div>
      {billFriend.length!==0 &&
        <SplitBill name={billFriend} updateBalance={handleUpdateBalance}/>
      }
    </div>
  );
}

function FriendsList({allFriends, onFriendSelected, billFriend}){
  return (
      <ul>
        {allFriends.map((fr)=>
          <Friend pic={fr.image} name={fr.name} key={fr.id} balance={fr.balance} billFriend={billFriend} friendSelected={onFriendSelected}/>
        )}
      </ul>
  )
}

function Friend({pic, name, balance, friendSelected, billFriend}){
  const isSelected = (name===billFriend)
  function selectFriend(){
    if (isSelected){
      friendSelected("")
    } else{
      friendSelected(name)
    }
  }
  return(
    <li className={isSelected?"selected":""}>
      <img src={pic} alt={name}/>
      <span>
        <h3>{name}</h3>
        {balance>0 &&(
        <p className='green'>{name} owes you Rs.{balance}</p>
        )}
        {balance<0 &&(
        <p className='red'>You owe {name} Rs.{Math.abs(balance)}</p>
        )}
        {balance===0 &&(
        <p>You and {name} are settled</p>
        )}
      </span>
        <Button onButtonClick={()=>selectFriend()}>
          {isSelected ? "Close" : "Select"}
        </Button>
    </li>
  )
}

function Button({children, onButtonClick}){
  return (
  <button onClick={onButtonClick} className='button'>
    {children}
  </button>
  );
}

function FormAddFriend({onAddFriend}){
  const [fname,setFname] = useState("")
  const fimage = `https://i.pravatar.cc/48?u=${crypto.randomUUID()}`
  function addFriend(e){
    e.preventDefault();
    if (fname.length===0) return;
    onAddFriend(fname,fimage)
  }
  return(
    <form className='form-add-friend' onSubmit={(e)=>addFriend(e)}>
        <label>👯 Friend name</label>
        <input type="text" value={fname} onChange={(e)=>setFname(e.target.value)} placeholder='Name'/>
        <label>📸 Image URL</label>
        <input type="text" value={fimage} disabled placeholder='url'/>
        <Button>Add</Button>
    </form>
  )
}

function SplitBill({name, updateBalance}){
  const [billValue, setBillValue] = useState(0)
  const [myExpense, setMyExpense] = useState(0)
  const [payingGuy, setPayingGuy] = useState("you")
  const friendExpense = billValue-myExpense
  function handleSubmit(e){
    e.preventDefault()
    let balance=0;
    if(payingGuy==="you"){
      balance = friendExpense
    } else {
      balance = myExpense*-1
    }
    setBillValue(0)
    setMyExpense(0)
    setPayingGuy("you")
    updateBalance(balance)
  }
  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a Bill with {name}</h2>
      
      <label>💵 Bill value</label>
      <input type="number" value={billValue} onChange={(e)=>setBillValue(Number(e.target.value))}/>

      <label>🕺🏻 Your expense</label>
      <input type="number" value={myExpense} onChange={(e)=>
        setMyExpense(Number(e.target.value) <= billValue ? Number(e.target.value) : myExpense)}/>
      
      <label>👫 {name}'s expense</label>
      <input type="number" disabled={true} value={friendExpense}/>
      
      <label>💰 Who is paying?</label>
      <select value={payingGuy} onChange={(e)=>setPayingGuy(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  )
}
export default App;
