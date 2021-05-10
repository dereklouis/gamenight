import axios from 'axios';
import './styles/Attending.css';

const Attending = (props) => {
  const setAttending = async (response) => {
    await axios.put(`/api/users/attending/${props.userNameLS}`, {
      answer: response,
    });
    props.updateAttending(response);
    props.loadData();
  };
  return (
    <>
      <p id="attending">Will you be attending Game Night tonight?</p>
      <div id="yesno">
        <button id="yes" onClick={() => setAttending('yes')}>
          YES
        </button>
      </div>
    </>
  );
};

export default Attending;
