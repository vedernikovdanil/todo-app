import React from "react";
import { Button, Modal } from "react-bootstrap";
import { StoreContext } from "..";
import ErrorMessage from "./ErrorMessage";

function ModalComponent(props: {
  id: string;
  onSaveChanges?: () => void;
  children: JSX.Element;
}) {
  const { modal } = React.useContext(StoreContext);
  const [show, setShow] = React.useState(false);
  const [title, setTitle] = React.useState("Modal title");

  React.useEffect(() => {
    modal.register({
      id: props.id,
      show: handleShow,
      close: handleClose,
      setTitle,
    });
    return () => modal.unregister(props.id);
  }, [modal, props.id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ErrorMessage />
        {props.children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onSaveChanges}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalComponent;
