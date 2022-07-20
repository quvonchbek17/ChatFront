import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import { useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import "./Chat.css";
import "bootstrap/dist/css/bootstrap.min.css";

const USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

const MSGS = gql`
  query {
    msgs {
      id
      desc
      userId
      nameSurname
      username
    }
  }
`;

const NEW_MSG = gql`
  mutation newMsg($desc: String!, $userId: String!) {
    newMsg(desc: $desc, userId: $userId) {
      id
      desc
      userId
    }
  }
`;

const SUBCRIPTION = gql`

subscription {
  msgs{
    id
    desc
    userId
    nameSurname
    username
  }
}

`

const Chat = () => {

  const [users, setUsers] = useState([]);
  const { data } = useQuery(MSGS);
  const [msgs, setMsgs] = useState([]);
  const [foundUser, setFoundUser] = useState({});
  const [msg, setMsg] = useState("");


const { data: newdata } = useSubscription(SUBCRIPTION)
const { data: user } = useQuery(USERS)

useEffect(() => {
  if(newdata?.msgs.length){
    setMsgs(newdata?.msgs)
  } else {
    setMsgs(data?.msgs);
  }
  setUsers(user?.users)


    document?.querySelector('main')?.scrollTo({
      top: document?.querySelector('main')?.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });


  }, [data, newdata]);

    const [ newMsg ] = useMutation(NEW_MSG, {
      update: (cache, newData) => {
      }
    })


  const postMsg = (e) => {

    e.preventDefault()
    e.target[0].value = ''

    newMsg({
        variables: {
          desc: msg,
          userId: window.localStorage.getItem('token')
        }
    })
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setFoundUser( msgs.find(item => item.userId === e.target.id))
    setShow(true);
  }

  return (
    <>
      <div className="chat container d-flex flex-column">
        <header className=" text-light p-2  ">
          <h3 className="mb-1">Najot ta'lim guruhi</h3>
          <p className=" m-0">{users?.length} a'zo</p>
        </header>

        <main  className="main text-light">
          {
          msgs &&
            msgs.map((post) => {
              return (
                <div key={ Math.random() } className=" mb-3 d-flex align-items-center">
                  <Button
                    id={post.userId}
                    variant="primary"
                    onClick={e => handleShow(e)}
                    className=" avatar"
                  >
                    {post?.nameSurname[0]?.toUpperCase()}
                  </Button>
                  <div key={post.userId} className="chat-message pt-0">
                    <p key={post?.desc} className=" m-0 text-info">{post?.nameSurname}</p>
                  <p key={post?.username} className=" m-0"> {post?.desc}</p>
                  </div>

                  {
                   <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>{foundUser?.nameSurname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p key={post?.nameSurname}>@{foundUser?.username}</p>
                    </Modal.Body>
                  </Modal>
                  }
                </div>
              );
            })}
        </main>
        <footer className=" p-1">
          <form className="d-flex" onSubmit={e => postMsg(e)}>
            <input
              onChange={e => setMsg(e.target.value)}
              className=" typing-input form-control"
              type="text"
              placeholder="Yozing..."
            />
            <button className=" btn btn-info">Yuborish</button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default Chat;
