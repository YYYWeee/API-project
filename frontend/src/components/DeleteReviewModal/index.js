import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import {deleteReviewThunk } from '../../store/reviews'

function DeleteReviewModal({id, spotId}) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  console.log('now',id,spotId)  //


  const confirmDelete = () => {
    dispatch(deleteReviewThunk(id, spotId));
    closeModal();
  }
  return (
    <>
      <div id="delete-box">
        <h3>Confirm Delete</h3>
        <h4>Are you sure you want to delete this review?</h4>
        <button
          className="Yes-delete-button"
        onClick={confirmDelete}
        >Yes (Delete Review)</button>

        <button
          className="No-delete-button"
          onClick={closeModal}
        >No (Keep Review)</button>

      </div>



    </>
  )
}

export default DeleteReviewModal;
