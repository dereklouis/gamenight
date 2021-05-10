import axios from 'axios';
import './styles/Welcome.css';

const Welcome = () => {
  const nameSubmit = async (e) => {
    localStorage.setItem('userNameLS', e.target.enterUserName.value);
    await axios.put('/api/users', { name: e.target.enterUserName.value });
  };

  return (
    <form id="nameForm" onSubmit={nameSubmit}>
      <input type="text" id="enterUserName" placeholder="Enter your name..." />
      <button type="submit" id="nameSubmit">
        Go!
      </button>
    </form>
  );
};

export default Welcome;
