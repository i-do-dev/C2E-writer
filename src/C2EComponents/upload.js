import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

import fileDownload from 'js-file-download';
import h5p from '../assets/images/studio_new_logo.png';
import epub from '../assets/images/assig1.png';
import Modal from 'react-bootstrap/Modal';
import { Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import InputSuggestion from './inputSuggestion'

const suggestionData = ['java', 'javascript', 'php', 'c#', 'go', 'dart']

function UploadFile({ setUploadProgress, getData }) {
  const fileinput = useRef()
  const [collectionData, setCollectionData] = useState([])
  const [selectedCollection, setSelectedCollction] = useState()
  const [startConversion, setStartConversion] = useState(false)
  const [show, setShow] = useState(false)
  const [isbn, setIsbn] = useState()
  const [epubmeta, setEpubData] = useState()
  const url = process.env.REACT_APP_API_URL // 'https://c2e-provider-api.curriki.org';
  const handleUpload = async (event) => {
    const formData = new FormData();

    formData.append('ebook', event.target.files[0]);
    formData.append('isbn', isbn);
    formData.append('collection', selectedCollection)
    if (epubmeta) {
      setShow(false);
      const response = await axios.post(
        url + '/c2e-media/create-epubs',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            console.log(percentCompleted);
            if (percentCompleted === 100) {
              setStartConversion(true);
            }
          },
          //  responseType: 'blob',
        }
      );
      if(response) {
        setIsbn()
      }

      setStartConversion(false);
      if (getData) {
        getData();
      }
      // // Download the file in the response
      // //fileDownload(response.data,`${event.target.files[0].name.split('.')[0]}.zip`)
      // fileDownload(
      //   response.data,
      //   event.target.files[0].name.replace('.epub', '.c2e')
      // );
    } else {
      try {
        const response = await axios.post(
          'https://writer-dev.curriki.org/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
              console.log(percentCompleted);
              if (percentCompleted === 100) {
                setStartConversion(true);
              }
            },
            responseType: 'blob',
          }
        );
        setStartConversion(false);
        // Download the file in the response
        //fileDownload(response.data,`${event.target.files[0].name.split('.')[0]}.zip`)
        fileDownload(
          response.data,
          event.target.files[0].name.replace('.zip', '.c2e')
        );
        // const url = window.URL.createObjectURL(new Blob([response.data],{ type: 'application/octet-stream' }));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `${event.target.files[0].name.split('.')[0]}.zip`);
        // document.body.appendChild(link);
        // link.click();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const selectSelection = (type) => {
    if (type === 'h5p') {
      fileinput.current.click();
    } else {
      setEpubData(true);
      fileinput.current.click();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suggestionResponse = await axios.get(
          'https://c2e-services-dev.curriki.org/c2e-media/collections'
        )
        setCollectionData(suggestionResponse.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  console.log('datatt', collectionData)
  const getSelectedVal = (value) => {
    console.log(value)
  }

  const getChanges = (value) => {
    console.log(value)
  }
  return (
    <>
      <div>
        <input
          style={{ display: 'none' }}
          onChange={(event) => {
            handleUpload(event);
          }}
          ref={fileinput}
          type="file"
        />
        {/* <button
          onClick={() => {
            //fileinput.current.click();
            setShow(true);
          }}
        >
          Choose File
        </button> */}
        <div className="selection-box">
          <div
            className="box"
            onClick={() => {
              selectSelection('h5p');
            }}
          >
            <img src={h5p} alt="" />
          </div>
          <div
            className="box"
            onClick={() => {

              setShow(true);
            }}
          >
            <img src={epub} alt="" />
          </div>
        </div>
      </div>
      {startConversion && (
        <div className="big-loader">
          <h4>Converting Your Upload Into C2E</h4>
          <p>please wait, it will take some time ...</p>
          <div className="flex">
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="light" />
          </div>
        </div>
      )}

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <Formik
            initialValues={{
              isbn: '',
              collectionName:""
            }}
            validate={(values) => {
              const errors = {};
              if (!values.isbn) {
                errors.isbn = 'Required';
              }

              if (!values.collectionName) {
                errors.collectionName = 'Required';
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              selectSelection('epub');
              setShow(false)
              setIsbn(values.isbn)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="c2e-lisence">
                <div class="form-group">
                  <label for="title">ISBN:</label>
                  <input
                    name="isbn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isbn}
                    type="text"
                  />
                  {errors.isbn && touched.isbn && errors.isbn}
                </div>
                <div class="form-group">
                  <InputSuggestion
                    placeholder="search collection..."
                    data={collectionData}
                    onSelected={getSelectedVal}
                    onChange={getChanges}
                    setSelectedCollction={setSelectedCollction}
                    name='Collection'
                    setFieldValue={setFieldValue}
                  />
                  {errors.collectionName && touched.collectionName && errors.collectionName}
                </div>
                <button
                  onClick={() => setShow(false)}
                  type="button"
                  class="btn btn-secondary"
                >
                  Close
                </button>{' '}
                &nbsp;
                <button type="submit" class="btn btn-primary">
                  Continue
                </button>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UploadFile;
