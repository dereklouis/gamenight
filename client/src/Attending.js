import axios from 'axios';
import './styles/Attending.css';

const Attending = (props) => {
  const setAttending = async (response) => {
    await axios.put(`/api/users/attending/${props.userNameLS}`, {
      answer: response,
    });
    props.updateAttending(response);
    props.loadData();
    props.socket.emit('DB-Update');
  };
  return (
    <>
      <div id="attendingContainer">
        <p id="attending">Will you be attending Game Night tonight?</p>
      </div>
      <div id="yesno">
        <button id="yes" autoFocus onClick={() => setAttending('yes')}>
          YES
        </button>
      </div>
    </>
  );
};

export default Attending;
