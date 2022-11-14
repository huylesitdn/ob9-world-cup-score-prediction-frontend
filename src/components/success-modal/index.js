import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const SuccessModal = ({message, ...props}) => {

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="bg-success">
          <div className="text-white mb-4">{message}</div>
          <div className="text-center">
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SuccessModal;